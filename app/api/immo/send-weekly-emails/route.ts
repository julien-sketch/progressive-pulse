export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function env(name: string) {
  return process.env[name] || "";
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function GET() {
  const RESEND_API_KEY = env("RESEND_API_KEY");
  const EMAIL_FROM = env("EMAIL_FROM");
  const BASE_URL = env("BASE_URL") || "https://progressive-pulse-snowy.vercel.app";

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
  }
  if (!EMAIL_FROM) {
    return NextResponse.json({ error: "Missing EMAIL_FROM" }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();
  const resend = new Resend(RESEND_API_KEY);

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, client_name, broker_email, access_token, project_type")
    .not("broker_email", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const results: Array<{ token: string; ok: boolean; error?: string }> = [];

  for (const p of projects ?? []) {
    const token = String(p.access_token || "").trim();
    const brokerEmail = String(p.broker_email || "").trim();
    if (!token || !brokerEmail) continue;

    // Récupérer steps du projet
    const { data: steps, error: stepsError } = await supabase
      .from("project_steps")
      .select("order_index, label")
      .eq("project_id", p.id)
      .order("order_index", { ascending: true });

    if (stepsError || !steps?.length) {
      results.push({ token, ok: false, error: stepsError?.message || "No steps" });
      continue;
    }

    const buttons = steps
      .map((s) => {
        const href = `${BASE_URL}/api/immo/update-step?token=${encodeURIComponent(
          token
        )}&step=${s.order_index}`;
        return `
          <a href="${href}" style="display:block;text-decoration:none;padding:12px 14px;border-radius:14px;border:1px solid #e5e7eb;margin:8px 0;font-weight:700;color:#111;background:#fff">
            ${s.order_index}. ${escapeHtml(String(s.label))}
          </a>
        `;
      })
      .join("");

    const trackLink = `${BASE_URL}/track/${encodeURIComponent(token)}`;

    const typeLabel =
      p.project_type === "of" ? "Organisme de formation" : "Immobilier";

    const subjectName = String(p.client_name || "").trim() || "Client";

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f5f7;padding:24px">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;padding:20px;border:1px solid #eef2f7">
          <h2 style="margin:0 0 6px;font-size:18px;color:#111">Mise à jour du dossier</h2>
          <p style="margin:0 0 10px;color:#6b7280;font-weight:700">${escapeHtml(typeLabel)}</p>
          <p style="margin:0 0 14px;color:#555;font-weight:600">Client : ${escapeHtml(subjectName)}</p>

          <p style="margin:0 0 10px;color:#111;font-weight:800">Clique sur l’étape actuelle :</p>
          ${buttons}

          <p style="margin:14px 0 0;color:#6b7280;font-weight:600">Un clic suffit. Le client voit la progression en temps réel.</p>
          <p style="margin:10px 0 0">
            <a href="${trackLink}" style="color:#111;font-weight:800;text-decoration:none">Voir le lien client</a>
          </p>

          <p style="margin:18px 0 0;color:#9ca3af;font-weight:800;font-size:10px;letter-spacing:.25em;text-transform:uppercase">
            Pro-Pulse
          </p>
        </div>
      </div>
    `;

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: brokerEmail,
        subject: `Où en est le dossier – ${subjectName}`,
        html,
      });
      results.push({ token, ok: true });
    } catch (e: any) {
      results.push({ token, ok: false, error: e?.message || "send failed" });
    }
  }

  return NextResponse.json({ ok: true, sent: results.length, results });
}