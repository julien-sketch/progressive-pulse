// app/api/d/[token]/upload/route.ts
import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BUCKET = "client-documents";
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1h

function env(name: string, required = true): string {
  const v = process.env[name];
  if (!v && required) throw new Error(`Missing env var: ${name}`);
  return v ?? "";
}

function getSupabaseAdmin() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

function sanitizeFilename(name: string) {
  return name
    .replaceAll("\\", "_")
    .replaceAll("/", "_")
    .replaceAll("..", "_")
    .replace(/[^\w.\-()+ ]+/g, "_")
    .slice(0, 180);
}

function escapeHtml(input: string) {
  return (input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderProNewDocEmail(args: {
  proEmail: string;
  dossierName: string;
  downloadUrl: string;
  dashboardUrl: string;
  clientFollowUrl: string;
}) {
  const { proEmail, dossierName, downloadUrl, dashboardUrl, clientFollowUrl } = args;

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Nouveau document reçu</title>
  <style>@media (max-width:640px){ .container{padding:14px !important;} }</style>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;">
  <div style="width:100%;padding:22px 10px;">
    <div class="container" style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:22px;padding:20px;">
      <div style="font-size:12px;color:#6b7280;">Picqtures • Suivi de dossiers</div>
      <div style="font-size:18px;color:#111827;margin-top:8px;"><strong>Nouveau document reçu</strong></div>

      <div style="font-size:14px;color:#374151;margin-top:8px;line-height:1.5;">
        Un client vient d’envoyer un document sur le dossier : <strong>${escapeHtml(dossierName)}</strong>
      </div>

      <div style="margin-top:14px;">
        <a href="${downloadUrl}"
           style="display:inline-block;text-decoration:none;background:#111827;color:#fff;padding:10px 12px;border-radius:12px;font-size:14px;">
          Télécharger le document
        </a>
      </div>

      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${dashboardUrl}"
           style="display:inline-block;text-decoration:none;background:#f3f4f6;color:#111827;padding:10px 12px;border-radius:12px;font-size:14px;border:1px solid #e5e7eb;">
          Ouvrir le dashboard
        </a>
        <a href="${clientFollowUrl}"
           style="display:inline-block;text-decoration:none;background:#f3f4f6;color:#111827;padding:10px 12px;border-radius:12px;font-size:14px;border:1px solid #e5e7eb;">
          Voir le suivi client
        </a>
      </div>

      <div style="margin-top:18px;padding-top:14px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.5;">
        Email envoyé à <strong>${escapeHtml(proEmail)}</strong>.<br/>
        Lien de téléchargement signé (valide ${Math.round(SIGNED_URL_TTL_SECONDS / 60)} min).
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = `Nouveau document reçu – ${dossierName}
Télécharger: ${downloadUrl}
Dashboard: ${dashboardUrl}
Suivi client: ${clientFollowUrl}`;

  return { html, text };
}

// ✅ Next.js 15: context.params est une Promise
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token: rawToken } = await context.params;
  const token = String(rawToken ?? "").trim();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const sb = getSupabaseAdmin();
  const appUrl = env("APP_URL");

  // 1) Vérifie dossier + récupère email pro
  const { data: project, error: pErr } = await sb
    .from("projects")
    .select("id, access_token, broker_email, client_name")
    .eq("access_token", token)
    .maybeSingle();

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // 2) Récupère fichier
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file (field name: file)" }, { status: 400 });
  }
  if (file.size <= 0) return NextResponse.json({ error: "Empty file" }, { status: 400 });

  // 3) Upload Storage
  const safeName = sanitizeFilename(file.name || "document");
  const ts = Date.now();
  const path = `projects/${project.id}/${ts}_${safeName}`;

  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
    cacheControl: "3600",
  });

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  // 4) Lien signé
  const { data: signed, error: signErr } = await sb.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (signErr || !signed?.signedUrl) {
    return NextResponse.json(
      {
        ok: true,
        bucket: BUCKET,
        path,
        signedUrl: null,
        emailSent: false,
        warning: "Upload ok but no signed url",
      },
      { status: 200 }
    );
  }

  // 5) Email au pro
  let emailSent = false;
  const proEmail = (project.broker_email ?? "").trim();
  if (proEmail) {
    const dossierName = project.client_name ?? "Dossier";
    const dashboardUrl = `${appUrl}/app/projects/${project.id}`;
    const clientFollowUrl = `${appUrl}/d/${project.access_token}`;

    const { html, text } = renderProNewDocEmail({
      proEmail,
      dossierName,
      downloadUrl: signed.signedUrl,
      dashboardUrl,
      clientFollowUrl,
    });

    const subject = `Picqtures – Nouveau document reçu (${dossierName})`;

    const res = await sendEmail({
      to: proEmail,
      subject,
      html,
      text,
      tags: [{ name: "type", value: "client-upload" }],
    });

    emailSent = res.ok;
  }

  return NextResponse.json(
    {
      ok: true,
      bucket: BUCKET,
      path,
      signedUrl: signed.signedUrl,
      emailSent,
    },
    { status: 200 }
  );
}