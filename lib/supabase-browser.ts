import { createClient } from "@supabase/supabase-js";

export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing public Supabase env vars");

  return createClient(url, key, {
    auth: {
      // ✅ implicit: pas de code_verifier requis
      flowType: "implicit",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "propulse-auth", // évite conflits si tu as d’autres apps supabase
    },
  });
}
