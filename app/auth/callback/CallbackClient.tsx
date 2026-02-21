"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function parseHashParams(hash: string) {
  const h = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(h);
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
    error: params.get("error"),
    error_description: params.get("error_description"),
  };
}

export default function CallbackClient() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const sp = useSearchParams();
  const [msg, setMsg] = useState("Connexion en cours...");

  useEffect(() => {
    const run = async () => {
      // erreurs en query
      const qErr = sp.get("error") || sp.get("error_description");
      if (qErr) {
        setMsg("Erreur : " + qErr);
        return;
      }

      // ✅ PKCE : /auth/callback?code=...
      const code = sp.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMsg("Erreur : " + error.message);
          return;
        }
        router.replace("/pro");
        return;
      }

      // ✅ Fallback implicit : /auth/callback#access_token=...&refresh_token=...
      const { access_token, refresh_token, error, error_description } = parseHashParams(
        typeof window !== "undefined" ? window.location.hash : ""
      );

      if (error || error_description) {
        setMsg("Erreur : " + (error_description || error));
        return;
      }

      if (access_token && refresh_token) {
        const { error: setErr } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (setErr) {
          setMsg("Lien invalide ou expiré. Reconnecte-toi.");
          return;
        }

        router.replace("/pro");
        return;
      }

      setMsg("Lien invalide ou incomplet. Reconnecte-toi.");
    };

    run();
  }, [sp, supabase, router]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xl border border-zinc-100 font-bold text-zinc-700">
        {msg}
      </div>
    </div>
  );
}