export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = String(url.searchParams.get("token") ?? "").trim();
  const stepStr = String(url.searchParams.get("step") ?? "").trim();
  const step = Number(stepStr);

  if (!token || !Number.isFinite(step) || step < 1) {
    return NextResponse.json({ error: "Invalid token or step" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, access_token")
    .eq("access_token", token)
    .maybeSingle();

  if (projectError) return NextResponse.json({ error: projectError.message }, { status: 400 });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Récupère total steps
  const { data: steps, error: stepsError } = await supabase
    .from("project_steps")
    .select("order_index, label")
    .eq("project_id", project.id)
    .order("order_index", { ascending: true });

  if (stepsError) return NextResponse.json({ error: stepsError.message }, { status: 400 });
  const total = steps?.length ?? 0;
  if (!total) return NextResponse.json({ error: "No steps for this project" }, { status: 400 });

  // Clamp step to [1..total]
  const target = Math.max(1, Math.min(step, total));

  // Update steps: <= target true, > target false
  // (simple: 2 updates)
  const { error: up1 } = await supabase
    .from("project_steps")
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq("project_id", project.id)
    .lte("order_index", target);

  if (up1) return NextResponse.json({ error: up1.message }, { status: 400 });

  const { error: up2 } = await supabase
    .from("project_steps")
    .update({ is_completed: false, completed_at: null })
    .eq("project_id", project.id)
    .gt("order_index", target);

  if (up2) return NextResponse.json({ error: up2.message }, { status: 400 });

  const progress = Math.round((target / total) * 100);
  const status_text = steps?.find((s) => s.order_index === target)?.label ?? `Étape ${target}/${total}`;

  const { error: upProject } = await supabase
    .from("projects")
    .update({
      progress_percent: progress,
      status_text,
      updated_at: new Date().toISOString(),
    })
    .eq("id", project.id);

  if (upProject) return NextResponse.json({ error: upProject.message }, { status: 400 });

  // Page de confirmation simple
  const html = `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Mise à jour enregistrée</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f5f7;margin:0;padding:40px}
.card{max-width:520px;margin:0 auto;background:#fff;border-radius:24px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.08)}
h1{margin:0 0 8px;font-size:20px}p{margin:0;color:#555}a{display:inline-block;margin-top:16px;color:#111;text-decoration:none;font-weight:700}
</style></head>
<body>
  <div class="card">
    <h1>Mise à jour enregistrée</h1>
    <p>Étape actuelle : <b>${status_text}</b> — ${progress}%</p>
    <a href="/track/${encodeURIComponent(token)}">Voir le suivi client</a>
  </div>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}