"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [msg, setMsg] = useState("Connexion en cours...");

  useEffect(() => {
    const run = async () => {
      const { access_token, refresh_token, error, error_description } = parseHashParams(
        typeof window !== "undefined" ? window.location.hash : ""
      );

      if (error || error_description) {
        setMsg("Erreur : " + (error_description || error));
        return;
      }

      if (!access_token || !refresh_token) {
        setMsg("Lien invalide ou incomplet. Reconnecte-toi depuis /login.");
        return;
      }

      const { error: setErr } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (setErr) {
        setMsg("Lien invalide ou expiré. Reconnecte-toi.");
        return;
      }

      router.replace("/pro");
    };

    run();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xl border border-zinc-100 font-bold text-zinc-700">
        {msg}
      </div>
    </div>
  );
}