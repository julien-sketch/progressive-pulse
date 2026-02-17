import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string; value: string }> }
) {
  const resolvedParams = await params;
  const { token, value } = resolvedParams;

  // 1. Déterminer le nouveau statut texte en fonction de la valeur
  let newStatus = "Dossier en cours";
  const val = parseInt(value);
  
  if (val <= 25) newStatus = "Analyse des pièces";
  else if (val <= 50) newStatus = "Envoi aux banques partenaires";
  else if (val <= 75) newStatus = "Négociation des taux";
  else if (val === 100) newStatus = "🎉 Offre de prêt validée !";

  // 2. Mettre à jour la base de données
  const { error } = await supabase
    .from('projects')
    .update({ 
      progress_percent: val,
      status_text: newStatus 
    })
    .eq('access_token', token);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 3. Page de confirmation ultra-simple pour le courtier
  return new NextResponse(`
    <html>
      <body style="font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #F5F5F7;">
        <div style="background: white; padding: 40px; border-radius: 24px; shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center;">
          <h1 style="font-size: 48px;">✅</h1>
          <h2 style="margin-top: 20px;">Dossier mis à jour</h2>
          <p style="color: #86868b;">La barre est maintenant à <strong>${value}%</strong></p>
          <p style="font-size: 14px; color: #0071e3; margin-top: 20px;">Vous pouvez fermer cet onglet.</p>
        </div>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } });
}