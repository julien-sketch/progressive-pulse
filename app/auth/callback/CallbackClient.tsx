"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function CallbackClient() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const sp = useSearchParams();
  const [msg, setMsg] = useState("Connexion en cours...");

  useEffect(() => {
    const run = async () => {
      // erreurs éventuelles
      const errorDesc = sp.get("error_description") || sp.get("error");
      if (errorDesc) {
        setMsg("Erreur : " + errorDesc);
        return;
      }

      // ✅ PKCE: code dans l'URL
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

      // ✅ Fallback: au cas où Supabase utilise encore le hash (#access_token=...)
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
      if (error) {
        setMsg("Lien invalide ou expiré. Reconnecte-toi.");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setMsg("Session introuvable. Reconnecte-toi.");
        return;
      }

      router.replace("/pro");
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