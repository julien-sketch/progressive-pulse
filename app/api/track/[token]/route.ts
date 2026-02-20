export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function extractTokenFromUrl(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  // /api/track/<token>
  return parts.length >= 3 ? decodeURIComponent(parts[2]).trim() : "";
}

export async function GET(req: Request) {
  const token = extractTokenFromUrl(req);

  if (!token) {
    return NextResponse.json({ error: "Token missing in URL" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select(
      "id, client_name, progress_percent, status_text, created_at, updated_at, broker_email, drive_folder_url, access_token"
    )
    .eq("access_token", token)
    .maybeSingle();

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 400 });
  }
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: steps, error: stepsError } = await supabase
    .from("project_steps")
    .select("order_index, label, is_completed")
    .eq("project_id", project.id)
    .order("order_index", { ascending: true });

  if (stepsError) {
    return NextResponse.json({ error: stepsError.message }, { status: 400 });
  }

  return NextResponse.json({ project, steps: steps ?? [] });
}
