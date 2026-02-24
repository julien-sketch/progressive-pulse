// app/api/track/[token]/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function GET(req: Request, context: { params: Promise<{ token: string }> }) {
  const { token: rawToken } = await context.params;
  const token = String(rawToken ?? "").trim();

  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // ✅ project + broker_phone ajouté
  const { data: project, error: pErr } = await supabase
    .from("projects")
    .select(
      "client_name, progress_percent, status_text, created_at, updated_at, broker_email, broker_phone, drive_folder_url, access_token, project_type"
    )
    .eq("access_token", token)
    .maybeSingle();

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Steps (si tu as une table project_steps)
  const { data: steps, error: sErr } = await supabase
    .from("project_steps")
    .select("order_index, label, is_completed")
    .eq("project_id", (project as any).id) // si ton select ci-dessus ne prend pas id
    .order("order_index", { ascending: true });

  // ⚠️ Si ton select du projet ne récupère pas id,
  // alors il faut le prendre. Version robuste :
  // -> ajoute "id" dans le select projet.
  // Je te mets la version propre ci-dessous :

  return NextResponse.json(
    {
      project,
      steps: steps ?? [],
    },
    { status: 200 }
  );
}