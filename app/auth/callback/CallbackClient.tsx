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
      const code = sp.get("code");

      // Selon le flow, tu peux avoir ?code=... ou des paramètres d’erreur
      const errorDesc = sp.get("error_description") || sp.get("error");
      if (errorDesc) {
        setMsg("Erreur : " + errorDesc);
        return;
      }

      if (!code) {
        setMsg("Code manquant dans l’URL.");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setMsg("Erreur : " + error.message);
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