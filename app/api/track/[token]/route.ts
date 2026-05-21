// app/api/track/[token]/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token: rawToken } = await context.params;
  const token = String(rawToken ?? "").trim();

  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: project, error: pErr } = await supabase
    .from("projects")
    .select(
      "id, client_name, progress_percent, status_text, created_at, updated_at, broker_email, broker_phone, drive_folder_url, access_token, project_type"
    )
    .eq("access_token", token)
    .maybeSingle();

  if (pErr) {
    return NextResponse.json({ error: pErr.message }, { status: 400 });
  }

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: steps, error: sErr } = await supabase
    .from("project_steps")
    .select("order_index, label, is_completed")
    .eq("project_id", project.id)
    .order("order_index", { ascending: true });

  if (sErr) {
    return NextResponse.json({ error: sErr.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      project,
      steps: steps ?? [],
    },
    { status: 200 }
  );
}