export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Resend } from "resend";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const supabase = getSupabaseServer();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!projects || projects.length === 0) {
    return NextResponse.json({ message: "No projects" });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  for (const project of projects) {
    await resend.emails.send({
      from: "ProgressivePulse <onboarding@resend.dev>",
      to: project.broker_email,
      subject: `📈 Suivi : ${project.client_name}`,
      html: `
        <h3>Où en est le dossier de ${project.client_name} ?</h3>
        <p>Cliquez sur l'étape actuelle pour mettre à jour la barre :</p>
        <a href="${baseUrl}/api/update/${project.access_token}/25">25%</a><br/>
        <a href="${baseUrl}/api/update/${project.access_token}/50">50%</a><br/>
        <a href="${baseUrl}/api/update/${project.access_token}/75">75%</a><br/>
        <a href="${baseUrl}/api/update/${project.access_token}/100">100%</a>
      `,
    });
  }

  return NextResponse.json({ message: "Emails envoyés" });
}
