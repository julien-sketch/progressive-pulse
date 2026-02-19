export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(_req: Request, context: any) {
  const token = String(context.params.token || "").trim();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) return NextResponse.json({ error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });
  if (!serviceKey) return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data, error } = await supabase
    .from("projects")
    .select("client_name,progress_percent,status_text,created_at,broker_email,drive_folder_url,access_token")
    .eq("access_token", token)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (!data) {
    return NextResponse.json(
      { error: "Not found", token_received: token },
      { status: 404 }
    );
  }

  return NextResponse.json({ project: data });
}
