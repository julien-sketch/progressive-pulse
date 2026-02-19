export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET(_request: Request, context: any) {
  const { token, value } = context.params as { token: string; value: string };

  const supabase = getSupabaseServer();

  const val = Number.parseInt(value, 10);
  if (!Number.isFinite(val) || val < 0 || val > 100) {
    return NextResponse.json({ error: "Invalid value" }, { status: 400 });
  }

  let newStatus = "Dossier en cours";
  if (val <= 25) newStatus = "Analyse des pièces";
  else if (val <= 50) newStatus = "Envoi aux banques partenaires";
  else if (val <= 75) newStatus = "Négociation des taux";
  else if (val === 100) newStatus = "🎉 Offre de prêt validée !";

  const { error } = await supabase
    .from("projects")
    .update({ progress_percent: val, status_text: newStatus })
    .eq("access_token", token);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return new NextResponse(
    `
    <html>
      <body style="font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#F5F5F7;">
        <div style="background:white;padding:40px;border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,0.1);text-align:center;">
          <h1 style="font-size:48px;">✅</h1>
          <h2 style="margin-top:20px;">Dossier mis à jour</h2>
          <p style="color:#86868b;">La barre est maintenant à <strong>${val}%</strong></p>
          <p style="font-size:14px;color:#0071e3;margin-top:20px;">Vous pouvez fermer cet onglet.</p>
        </div>
      </body>
    </html>
    `,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
