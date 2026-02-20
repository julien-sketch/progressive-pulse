export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { IMMO_STEPS } from "@/lib/templates/immo";
import { OF_STEPS } from "@/lib/templates/of";

type ProjectType = "immo" | "of";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function generateUniqueToken(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  base: string
) {
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
  return `${base}-${Date.now()}`;
}

export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();

  const body = await req.json().catch(() => null);

  const client_name = String(body?.client_name ?? "").trim();
  const broker_email = String(body?.broker_email ?? "").trim();
  const property_name = String(body?.property_name ?? "").trim();
  const project_type = (String(body?.project_type ?? "immo").trim() ||
    "immo") as ProjectType;

  if (!client_name || !broker_email) {
    return NextResponse.json(
      { error: "Missing client_name or broker_email" },
      { status: 400 }
    );
  }

  const allowed: ProjectType[] = ["immo", "of"];
  const safeType: ProjectType = allowed.includes(project_type)
    ? project_type
    : "immo";

  const base = slugify(property_name || client_name || "dossier");
  const token = await generateUniqueToken(supabase, base);

  // Valeurs par défaut selon type
  const defaultStatus =
    safeType === "of" ? "Documents reçus" : "Mandat signé";

  const { data: inserted, error: insertError } = await supabase
    .from("projects")
    .insert([
      {
        client_name,
        broker_email,
        access_token: token,
        project_type: safeType,
        progress_percent: 0,
        status_text: defaultStatus,
        updated_at: new Date().toISOString(),
      },
    ])
    .select("id, access_token")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json(
      { error: insertError?.message ?? "Insert failed" },
      { status: 400 }
    );
  }

  const templateSteps = safeType === "of" ? OF_STEPS : IMMO_STEPS;

  const stepsRows = templateSteps.map((label, idx) => ({
    project_id: inserted.id,
    order_index: idx + 1,
    label,
    is_completed: false,
  }));

  const { error: stepsError } = await supabase
    .from("project_steps")
    .insert(stepsRows);

  if (stepsError) {
    return NextResponse.json({ error: stepsError.message }, { status: 400 });
  }

  return NextResponse.json({ token: inserted.access_token }, { status: 200 });
}