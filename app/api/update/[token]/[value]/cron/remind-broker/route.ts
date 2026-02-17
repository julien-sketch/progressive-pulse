import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  // 1. Récupérer tous les projets actifs
  const { data: projects } = await supabase.from('projects').select('*');

  if (!projects) return NextResponse.json({ message: "No projects" });

  for (const project of projects) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // 2. Envoyer l'email avec les liens magiques
    await resend.emails.send({
      from: 'ProgressivePulse <onboarding@resend.dev>',
      to: project.broker_email,
      subject: `📈 Suivi : ${project.client_name}`,
      html: `
        <h3>Où en est le dossier de ${project.client_name} ?</h3>
        <p>Cliquez sur l'étape actuelle pour mettre à jour la barre de votre client :</p>
        <a href="${baseUrl}/api/update/${project.access_token}/25" style="display:block; margin:10px 0; color:#0071e3;">Dossier Completé (25%)</a>
        <a href="${baseUrl}/api/update/${project.access_token}/50" style="display:block; margin:10px 0; color:#0071e3;">Envoi Banques (50%)</a>
        <a href="${baseUrl}/api/update/${project.access_token}/75" style="display:block; margin:10px 0; color:#0071e3;">Offre Reçue (75%)</a>
        <a href="${baseUrl}/api/update/${project.access_token}/100" style="display:block; margin:10px 0; color:#28a745;">Signé ! (100%)</a>
      `
    });
  }

  return NextResponse.json({ message: "Emails envoyés" });
}