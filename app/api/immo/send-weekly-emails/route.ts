export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function env(name: string) {
  return process.env[name] || "";
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendWithBackoff(
  resend: Resend,
  payload: { from: string; to: string; subject: string; html: string }
) {
  const delays = [0, 1200, 2500]; // 3 tentatives max
  let lastErr: any = null;

  for (let i = 0; i < delays.length; i++) {
    if (delays[i] > 0) await sleep(delays[i]);

    try {
      await resend.emails.send(payload);
      return { ok: true as const, attempts: i + 1 };
    } catch (e: any) {
      lastErr = e;
      const status = e?.statusCode || e?.status || null;
      const name = e?.name || "";
      // On réessaie uniquement si rate limit
      if (!(status === 429 || name === "rate_limit_exceeded")) break;
    }
  }

  return {
    ok: false as const,
    error: lastErr?.message || "send failed",
    status: lastErr?.statusCode || lastErr?.status || null,
  };
}

export async function GET() {
  const RESEND_API_KEY = env("RESEND_API_KEY");
  const EMAIL_FROM = env("EMAIL_FROM"); // ex: Pro-Pulse <support@picqtures.fr>
  const BASE_URL = env("BASE_URL") || "https://progressive-pulse-snowy.vercel.app";

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
  }
  if (!EMAIL_FROM) {
    return NextResponse.json({ error: "Missing EMAIL_FROM" }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();
  const resend = new Resend(RESEND_API_KEY);

  // 1) Récupérer tous les projets
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, client_name, broker_email, access_token, project_type")
    .not("broker_email", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 2) Grouper par broker_email
  const byBroker = new Map<string, typeof projects>();

  for (const p of projects ?? []) {
    const email = String(p.broker_email || "").trim().toLowerCase();
    if (!email) continue;
    if (!byBroker.has(email)) byBroker.set(email, []);
    byBroker.get(email)!.push(p);
  }

  const results: Array<{ to: string; ok: boolean; attempts?: number; error?: string }> = [];

  // Throttle entre emails (maintenant tu en envoies très peu)
  const THROTTLE_MS = 600;

  for (const [to, list] of byBroker.entries()) {
    // 3) Construire le HTML de tous les dossiers de ce broker
    let blocks = "";

    for (const p of list) {
      const token = String(p.access_token || "").trim();
      if (!token) continue;

      const { data: steps, error: stepsError } = await supabase
        .from("project_steps")
        .select("order_index, label")
        .eq("project_id", p.id)
        .order("order_index", { ascending: true });

      const typeLabel = p.project_type === "of" ? "Organisme de formation" : "Immobilier";
      const clientName = String(p.client_name || "").trim() || "Client";

      if (stepsError || !steps?.length) {
        blocks += `
          <div style="padding:14px;border:1px solid #fee2e2;border-radius:16px;margin:14px 0;background:#fff5f5">
            <div style="font-weight:900;color:#991b1b">Dossier: ${escapeHtml(clientName)} (${escapeHtml(typeLabel)})</div>
            <div style="color:#991b1b;font-weight:700;margin-top:6px">Impossible de charger les étapes.</div>
          </div>
        `;
        continue;
      }

      const buttons = steps
        .map((s) => {
          const href = `${BASE_URL}/api/immo/update-step?token=${encodeURIComponent(token)}&step=${s.order_index}`;
          return `
            <a href="${href}" style="display:block;text-decoration:none;padding:10px 12px;border-radius:14px;border:1px solid #e5e7eb;margin:8px 0;font-weight:800;color:#111;background:#fff">
              ${s.order_index}. ${escapeHtml(String(s.label))}
            </a>
          `;
        })
        .join("");

      const trackLink = `${BASE_URL}/track/${encodeURIComponent(token)}`;

      blocks += `
        <div style="padding:16px;border:1px solid #eef2f7;border-radius:18px;margin:14px 0;background:#ffffff">
          <div style="font-weight:900;color:#111;font-size:14px;margin-bottom:4px">
            ${escapeHtml(clientName)} <span style="color:#6b7280;font-weight:800">• ${escapeHtml(typeLabel)}</span>
          </div>
          <div style="margin-top:10px">${buttons}</div>
          <div style="margin-top:10px">
            <a href="${trackLink}" style="color:#111;font-weight:900;text-decoration:none">Voir le lien client</a>
          </div>
        </div>
      `;
    }

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f5f7;padding:24px">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;padding:20px;border:1px solid #eef2f7">
          <h2 style="margin:0 0 8px;font-size:18px;color:#111">Mise à jour des dossiers</h2>
          <p style="margin:0 0 14px;color:#6b7280;font-weight:700">
            Clique sur l’étape actuelle pour chaque dossier. Un clic = progression client mise à jour.
          </p>

          ${blocks}

          <p style="margin:18px 0 0;color:#9ca3af;font-weight:900;font-size:10px;letter-spacing:.25em;text-transform:uppercase">
            Pro-Pulse
          </p>
        </div>
      </div>
    `;

    const sendResult = await sendWithBackoff(resend, {
      from: EMAIL_FROM,
      to,
      subject: `Mise à jour hebdo – ${list.length} dossier(s)`,
      html,
    });

    if (sendResult.ok) {
      results.push({ to, ok: true, attempts: sendResult.attempts });
    } else {
      results.push({ to, ok: false, error: sendResult.error });
    }

    await sleep(THROTTLE_MS);
  }

  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.filter((r) => !r.ok).length;

  return NextResponse.json({
    ok: true,
    brokers: results.length,
    sent_ok: okCount,
    sent_fail: failCount,
    results,
  });
}