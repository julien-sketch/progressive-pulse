export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
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

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function generateUniqueToken(supabase: ReturnType<typeof getSupabaseAdmin>, base: string) {
  for (let i = 0; i < 10; i++) {
    const suffix = Math.floor(100 + Math.random() * 900);
    const token = `${base}-${suffix}`;

    const { data } = await supabase
      .from("projects")
      .select("id")
      .eq("access_token", token)
      .maybeSingle();

    if (!data) return token;
  }
  // fallback
  return `${base}-${Date.now()}`;
}

export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();

  const body = await req.json().catch(() => null);
  const client_name = String(body?.client_name ?? "").trim();
  const broker_email = String(body?.broker_email ?? "").trim();
  const property_name = String(body?.property_name ?? "").trim(); // optionnel pour l’immo

  if (!client_name || !broker_email) {
    return NextResponse.json({ error: "Missing client_name or broker_email" }, { status: 400 });
  }

  const base = slugify(property_name || client_name || "dossier");
  const token = await generateUniqueToken(supabase, base);

  const { data: inserted, error: insertError } = await supabase
    .from("projects")
    .insert([
      {
        client_name,
        broker_email,
        access_token: token,
        progress_percent: 0,
        status_text: "Mandat non confirmé",
        updated_at: new Date().toISOString(),
      },
    ])
    .select("id, access_token")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json({ error: insertError?.message ?? "Insert failed" }, { status: 400 });
  }

  const stepsRows = IMMO_STEPS.map((label, idx) => ({
    project_id: inserted.id,
    order_index: idx + 1,
    label,
    is_completed: false,
  }));

  const { error: stepsError } = await supabase.from("project_steps").insert(stepsRows);
  if (stepsError) {
    return NextResponse.json({ error: stepsError.message }, { status: 400 });
  }

  return NextResponse.json({ token: inserted.access_token }, { status: 200 });
}