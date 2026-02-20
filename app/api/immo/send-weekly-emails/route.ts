export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const IMMO_STEPS = [
  "Mandat signé",
  "Shooting photo réalisé",
  "Annonce publiée",
  "Visites en cours",
  "Offre acceptée",
  "Compromis signé",
  "Délai de rétractation",
  "Acte authentique signé",
] as const;

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export async function GET() {
  const supabase = getSupabaseAdmin();

  const RESEND_API_KEY = requireEnv("RESEND_API_KEY");
  const EMAIL_FROM = requireEnv("EMAIL_FROM");
  const BASE_URL = process.env.BASE_URL || "https://progressive-pulse-snowy.vercel.app";

  const resend = new Resend(RESEND_API_KEY);

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, client_name, broker_email, access_token")
    .not("broker_email", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const results: Array<{ token: string; ok: boolean; error?: string }> = [];

  for (const p of projects ?? []) {
    const token = p.access_token as string;
    const brokerEmail = String(p.broker_email || "").trim();
    if (!brokerEmail) continue;

    // Boutons étapes -> /api/immo/update-step?token=...&step=...
    const buttons = IMMO_STEPS.map((label, idx) => {
      const step = idx + 1;
      const href = `${BASE_URL}/api/immo/update-step?token=${encodeURIComponent(token)}&step=${step}`;
      return `
        <a href="${href}" style="display:block;text-decoration:none;padding:12px 14px;border-radius:14px;border:1px solid #e5e7eb;margin:8px 0;font-weight:700;color:#111;background:#fff">
          ${step}. ${label}
        </a>
      `;
    }).join("");

    const trackLink = `${BASE_URL}/track/${encodeURIComponent(token)}`;

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f5f7;padding:24px">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;padding:20px;border:1px solid #eef2f7">
          <h2 style="margin:0 0 6px;font-size:18px;color:#111">Mise à jour du dossier</h2>
          <p style="margin:0 0 14px;color:#555;font-weight:600">Client : ${escapeHtml(String(p.client_name || "Client"))}</p>

          <p style="margin:0 0 10px;color:#111;font-weight:800">Clique sur l’étape actuelle :</p>
          ${buttons}

          <p style="margin:14px 0 0;color:#6b7280;font-weight:600">Un clic suffit. Le client voit la progression en temps réel.</p>
          <p style="margin:10px 0 0">
            <a href="${trackLink}" style="color:#111;font-weight:800;text-decoration:none">Voir le lien client</a>
          </p>

          <p style="margin:18px 0 0;color:#9ca3af;font-weight:800;font-size:10px;letter-spacing:.25em;text-transform:uppercase">
            Pro-Pulse Immobilier
          </p>
        </div>
      </div>
    `;

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: brokerEmail,
        subject: `Où en est le dossier – ${String(p.client_name || "").trim() || "Client"}`,
        html,
      });
      results.push({ token, ok: true });
    } catch (e: any) {
      results.push({ token, ok: false, error: e?.message || "send failed" });
    }
  }

  return NextResponse.json({ ok: true, sent: results.length, results });
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}