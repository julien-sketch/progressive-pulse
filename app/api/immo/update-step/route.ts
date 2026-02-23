// app/api/immo/update-step/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import crypto from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 jours

function env(name: string, required = true): string {
  const v = process.env[name];
  if (!v && required) throw new Error(`Missing env var: ${name}`);
  return v ?? "";
}

function badRequest(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

function safeEqualHex(a: string, b: string) {
  // compare constant-time
  try {
    const ba = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function canonicalQuery(params: Record<string, string>) {
  // ordre stable (important pour la signature)
  const keys = Object.keys(params).sort();
  return keys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join("&");
}

function computeSig(canonical: string) {
  const secret = env("EMAIL_LINK_SECRET", true);
  return crypto.createHmac("sha256", secret).update(canonical).digest("hex");
}

function verifySignedLink(url: URL) {
  // paramètres attendus
  const token = String(url.searchParams.get("token") ?? "").trim();
  const stepStr = String(url.searchParams.get("step") ?? "").trim();
  const tsStr = String(url.searchParams.get("ts") ?? "").trim();
  const sig = String(url.searchParams.get("sig") ?? "").trim();

  const step = Number(stepStr);
  const ts = Number(tsStr);

  if (!token) return { ok: false as const, error: "Missing token" };
  if (!Number.isFinite(step) || step < 1) return { ok: false as const, error: "Invalid step" };
  if (!Number.isFinite(ts) || ts <= 0) return { ok: false as const, error: "Missing/invalid ts" };
  if (!sig) return { ok: false as const, error: "Missing sig" };

  // expiration
  const nowSec = Math.floor(Date.now() / 1000);
  const age = nowSec - ts;
  if (age < -60) return { ok: false as const, error: "Link timestamp is in the future" }; // tolérance 60s
  if (age > MAX_AGE_SECONDS) return { ok: false as const, error: "Link expired" };

  // vérif signature
  const canonical = canonicalQuery({ token, step: String(step), ts: String(ts) });
  const expected = computeSig(canonical);

  if (!safeEqualHex(sig, expected)) {
    return { ok: false as const, error: "Invalid signature" };
  }

  return { ok: true as const, token, step, ts };
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  // 🔒 EXIGE signature + ts
  const v = verifySignedLink(url);
  if (!v.ok) {
    // Option compat (DÉCONSEILLÉE) :
    // Si tu veux temporairement accepter les anciens liens non signés,
    // remplace ce return par un fallback sur l’ancienne logique.
    return badRequest(v.error, 401);
  }

  const { token, step } = v;
  const supabase = getSupabaseAdmin();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, access_token")
    .eq("access_token", token)
    .maybeSingle();

  if (projectError) return badRequest(projectError.message, 400);
  if (!project) return badRequest("Not found", 404);

  // Récupère total steps
  const { data: steps, error: stepsError } = await supabase
    .from("project_steps")
    .select("order_index, label")
    .eq("project_id", project.id)
    .order("order_index", { ascending: true });

  if (stepsError) return badRequest(stepsError.message, 400);

  const total = steps?.length ?? 0;
  if (!total) return badRequest("No steps for this project", 400);

  // Clamp step to [1..total]
  const target = Math.max(1, Math.min(step, total));

  // Update steps: <= target true, > target false
  const nowIso = new Date().toISOString();

  const { error: up1 } = await supabase
    .from("project_steps")
    .update({ is_completed: true, completed_at: nowIso })
    .eq("project_id", project.id)
    .lte("order_index", target);

  if (up1) return badRequest(up1.message, 400);

  const { error: up2 } = await supabase
    .from("project_steps")
    .update({ is_completed: false, completed_at: null })
    .eq("project_id", project.id)
    .gt("order_index", target);

  if (up2) return badRequest(up2.message, 400);

  const progress = Math.round((target / total) * 100);
  const status_text =
    steps?.find((s) => s.order_index === target)?.label ?? `Étape ${target}/${total}`;

  const { error: upProject } = await supabase
    .from("projects")
    .update({
      progress_percent: progress,
      status_text,
      updated_at: nowIso,
    })
    .eq("id", project.id);

  if (upProject) return badRequest(upProject.message, 400);

  // Page de confirmation
  // ⚠️ Je garde ton lien, adapte si ta vraie URL client est /d/[token] ou /track/[token]
  const html = `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Mise à jour enregistrée</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f5f7;margin:0;padding:40px}
  .card{max-width:520px;margin:0 auto;background:#fff;border-radius:24px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.08)}
  h1{margin:0 0 8px;font-size:20px}
  p{margin:0;color:#555;line-height:1.4}
  a{display:inline-block;margin-top:16px;color:#111;text-decoration:none;font-weight:700}
</style></head>
<body>
  <div class="card">
    <h1>Mise à jour enregistrée</h1>
    <p>Étape actuelle : <b>${escapeHtml(status_text)}</b> — ${progress}%</p>
    <a href="/track/${encodeURIComponent(token)}">Voir le suivi client</a>
  </div>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(input: string) {
  return (input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}