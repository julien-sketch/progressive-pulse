// app/api/email/remind-pro/route.ts
import "server-only";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProjectRow = {
  id: string;
  client_name: string | null;
  broker_email: string | null;
  access_token: string;
  progress_percent: number | null;
  status_text: string | null;
  drive_folder_url: string | null;
  created_at: string | null;
};

type StepRow = {
  id: string;
  project_id: string;
  order_index: number;
  label: string | null;
  is_completed: boolean | null;
};

function env(name: string, required = true): string {
  const v = process.env[name];
  if (!v && required) throw new Error(`Missing env var: ${name}`);
  return v ?? "";
}

function escapeHtml(input: string) {
  return (input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPct(n: number | null | undefined) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

function canonicalQuery(params: Record<string, string>) {
  const keys = Object.keys(params).sort();
  return keys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join("&");
}

function signLink(params: Record<string, string>) {
  const secret = env("EMAIL_LINK_SECRET", true);
  const canonical = canonicalQuery(params);
  const sig = crypto.createHmac("sha256", secret).update(canonical).digest("hex");
  return { canonical, sig };
}

function getSupabaseAdmin() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

function renderReminderEmail(args: {
  proEmail: string;
  appUrl: string;
  items: Array<{
    project: ProjectRow;
    steps: StepRow[];
    dashboardUrl: string;
    clientUrl: string;
    driveUrl?: string | null;
    updateLinks: Array<{ label: string; url: string; isCompleted: boolean; orderIndex: number }>;
  }>;
}) {
  const { proEmail, appUrl, items } = args;

  const blocks = items
    .map(({ project, dashboardUrl, clientUrl, driveUrl, updateLinks }) => {
      const title = escapeHtml(project.client_name || "Dossier");
      const status = escapeHtml(project.status_text || "—");
      const pct = formatPct(project.progress_percent);

      const driveLine = driveUrl
        ? `<a href="${driveUrl}" style="color:#111827;text-decoration:underline;">Dossier Drive</a>`
        : `<span style="color:#6b7280;">Drive : non défini</span>`;

      const stepsHtml =
        updateLinks.length === 0
          ? `<div style="color:#6b7280;font-size:14px;margin-top:8px;">Aucune étape.</div>`
          : updateLinks
              .map((s) => {
                const badge = s.isCompleted
                  ? `<span style="display:inline-block;padding:2px 10px;border-radius:999px;background:#e7f7ef;color:#0b6b3a;font-size:12px;">Fait</span>`
                  : `<span style="display:inline-block;padding:2px 10px;border-radius:999px;background:#fff3cd;color:#7a5b00;font-size:12px;">À faire</span>`;

                const btn = `<a href="${s.url}" style="display:inline-block;text-decoration:none;background:#111827;color:#ffffff;padding:10px 12px;border-radius:10px;font-size:14px;">Positionner ici</a>`;

                return `
                  <div style="padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-top:10px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
                      <div style="font-size:14px;color:#111827;line-height:1.3;">
                        <strong>${escapeHtml(s.label)}</strong>
                      </div>
                      <div>${badge}</div>
                    </div>
                    <div style="margin-top:10px;">
                      ${btn}
                    </div>
                  </div>
                `;
              })
              .join("");

      return `
        <div style="border:1px solid #e5e7eb;border-radius:18px;padding:16px;margin-top:16px;">
          <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div>
              <div style="font-size:16px;color:#111827;"><strong>${title}</strong></div>
              <div style="font-size:14px;color:#6b7280;margin-top:4px;">
                Statut : ${status} • Progression : ${pct}
              </div>
            </div>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
              <a href="${dashboardUrl}" style="text-decoration:none;background:#111827;color:#fff;padding:10px 12px;border-radius:12px;font-size:14px;">Ouvrir dashboard</a>
              <a href="${clientUrl}" style="text-decoration:none;background:#f3f4f6;color:#111827;padding:10px 12px;border-radius:12px;font-size:14px;border:1px solid #e5e7eb;">Lien client</a>
            </div>
          </div>

          <div style="margin-top:12px;font-size:14px;color:#111827;">
            ${driveLine}
          </div>

          <div style="margin-top:14px;">
            <div style="font-size:14px;color:#111827;"><strong>Étapes</strong></div>
            ${stepsHtml}
          </div>
        </div>
      `;
    })
    .join("");

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Rappel dossiers – Picqtures</title>
  <style>
    @media (max-width: 640px) {
      .container { padding: 14px !important; }
      .h1 { font-size: 18px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
  <div style="width:100%;padding:22px 10px;">
    <div class="container" style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:22px;padding:20px;">
      <div style="font-size:12px;color:#6b7280;">Picqtures • Suivi de dossiers</div>
      <div class="h1" style="font-size:20px;color:#111827;margin-top:8px;">
        <strong>Rappel hebdo – mise à jour dossiers</strong>
      </div>
      <div style="font-size:14px;color:#374151;margin-top:6px;line-height:1.5;">
        Bonjour,<br/>
        Voici vos dossiers et étapes. Cliquez sur “Positionner ici” pour mettre à jour la progression.
      </div>

      ${blocks}

      <div style="margin-top:18px;padding-top:14px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.5;">
        Email envoyé à <strong>${escapeHtml(proEmail)}</strong>.<br/>
        Accès plateforme : <a href="${appUrl}" style="color:#111827;text-decoration:underline;">${appUrl}</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = `Rappel hebdo – Picqtures
Connectez-vous: ${appUrl}`;

  return { html, text };
}

export async function POST(req: Request) {
  // 🔒 Protection cron
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${env("CRON_SECRET")}`;
  if (auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  const appUrl = env("APP_URL");
  const updatePath = process.env.EMAIL_UPDATE_STEP_PATH ?? "/api/immo/update-step";
  const limitProjects = Number(process.env.EMAIL_REMIND_LIMIT ?? "500");

  const { data: projects, error: pErr } = await sb
    .from("projects")
    .select("id, client_name, broker_email, access_token, progress_percent, status_text, drive_folder_url, created_at")
    .not("broker_email", "is", null)
    .lt("progress_percent", 100)
    .order("created_at", { ascending: false })
    .limit(limitProjects);

  if (pErr) {
    return NextResponse.json({ error: "DB error (projects)", details: pErr.message }, { status: 500 });
  }

  if (!projects || projects.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, skipped: 0, reason: "No projects to remind" });
  }

  const projectIds = projects.map((p) => p.id);

  const { data: steps, error: sErr } = await sb
    .from("project_steps")
    .select("id, project_id, order_index, label, is_completed")
    .in("project_id", projectIds)
    .order("order_index", { ascending: true });

  if (sErr) {
    return NextResponse.json({ error: "DB error (project_steps)", details: sErr.message }, { status: 500 });
  }

  const stepsByProject = new Map<string, StepRow[]>();
  for (const st of (steps ?? []) as StepRow[]) {
    const arr = stepsByProject.get(st.project_id) ?? [];
    arr.push(st);
    stepsByProject.set(st.project_id, arr);
  }

  const byPro = new Map<string, ProjectRow[]>();
  for (const p of projects as ProjectRow[]) {
    const email = (p.broker_email ?? "").trim().toLowerCase();
    if (!email) continue;
    const arr = byPro.get(email) ?? [];
    arr.push(p);
    byPro.set(email, arr);
  }

  let sent = 0;
  let skipped = 0;
  const errors: Array<{ proEmail: string; error: any }> = [];

  for (const [proEmail, proProjects] of byPro.entries()) {
    try {
      const items = proProjects.map((project) => {
        const projSteps = stepsByProject.get(project.id) ?? [];
        const dashboardUrl = `${appUrl}/app/projects/${project.id}`;
        const clientUrl = `${appUrl}/d/${project.access_token}`;

        const ts = Math.floor(Date.now() / 1000).toString();

        const updateLinks = projSteps.map((st) => {
          const params = { token: project.access_token, step: String(st.order_index), ts };
          const { canonical, sig } = signLink(params);
          const url = `${appUrl}${updatePath}?${canonical}&sig=${sig}`;

          return {
            label: st.label ?? `Étape ${st.order_index}`,
            url,
            isCompleted: Boolean(st.is_completed),
            orderIndex: st.order_index,
          };
        });

        return {
          project,
          steps: projSteps,
          dashboardUrl,
          clientUrl,
          driveUrl: project.drive_folder_url,
          updateLinks,
        };
      });

      const { html, text } = renderReminderEmail({ proEmail, appUrl, items });
      const subject = `Picqtures – Rappel dossiers (${items.length})`;

      const res = await sendEmail({
        to: proEmail,
        subject,
        html,
        text,
        tags: [{ name: "type", value: "remind-pro" }],
      });

      if (!res.ok) {
        skipped += 1;
        errors.push({ proEmail, error: res.error });
      } else {
        sent += 1;
      }

      await new Promise((r) => setTimeout(r, 150));
    } catch (e: any) {
      skipped += 1;
      errors.push({ proEmail, error: e?.message ?? String(e) });
    }
  }

  return NextResponse.json({ ok: true, sent, skipped, pros: byPro.size, errors: errors.slice(0, 20) });
}