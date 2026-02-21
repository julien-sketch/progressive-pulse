"use client";

import { useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 pt-20 text-zinc-900">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl border border-zinc-100">
        <h1 className="text-2xl font-black tracking-tight">Connexion Pro</h1>
        <p className="mt-2 text-sm text-zinc-500 font-semibold">
          Recevez un lien de connexion par email (magic link).
        </p>

        <form onSubmit={sendLink} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
              Email
            </label>
            <input
              required
              type="email"
              className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
              placeholder="ex: pro@agence.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="w-full rounded-2xl bg-black p-4 font-black text-white hover:bg-zinc-800 transition">
            Envoyer le lien
          </button>
        </form>

        {sent && (
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-800 font-bold">
            Lien envoyé. Vérifiez votre boîte mail (et spam).
          </div>
        )}

        {err && (
          <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-700 font-bold">
            {err}
          </div>
        )}
      </div>
    </div>
  );
}