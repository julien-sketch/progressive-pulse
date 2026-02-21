"use client";

import { useMemo, useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Mode = "password" | "magic";

export default function LoginPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [mode, setMode] = useState<Mode>("password");

  // shared
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // password mode
  const [password, setPassword] = useState("");
  const [loadingPwd, setLoadingPwd] = useState(false);

  // magic link mode
  const [loadingMagic, setLoadingMagic] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const loginPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);

    setLoadingPwd(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoadingPwd(false);

    if (error) {
      setErr(error.message);
      return;
    }

    window.location.href = "/pro";
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);

    // ton quota Supabase = 2 emails/heure → on évite le spam clic
    if (cooldown > 0) return;

    setLoadingMagic(true);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    setLoadingMagic(false);

    if (error) {
      setErr(error.message);
      return;
    }

    setInfo("Lien envoyé. Vérifie ta boîte mail (et le spam).");
    setCooldown(60);
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 pt-20 text-zinc-900">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl border border-zinc-100">
        <h1 className="text-2xl font-black tracking-tight">Connexion Pro</h1>
        <p className="mt-2 text-sm text-zinc-500 font-semibold">
          Connexion simple. En prod, tu peux activer magic link quand ton email quota est OK.
        </p>

        {/* Mode switch */}
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-zinc-50 p-2 border border-zinc-100">
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`rounded-xl px-3 py-2 text-sm font-black transition ${
              mode === "password" ? "bg-black text-white" : "bg-transparent text-zinc-700 hover:bg-white"
            }`}
          >
            Mot de passe
          </button>
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`rounded-xl px-3 py-2 text-sm font-black transition ${
              mode === "magic" ? "bg-black text-white" : "bg-transparent text-zinc-700 hover:bg-white"
            }`}
          >
            Magic link
          </button>
        </div>

        {/* Email */}
        <div className="mt-6">
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

        {/* Password mode */}
        {mode === "password" && (
          <form onSubmit={loginPassword} className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
                Mot de passe
              </label>
              <input
                required
                type="password"
                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loadingPwd}
              className="w-full rounded-2xl bg-black p-4 font-black text-white hover:bg-zinc-800 transition disabled:opacity-50"
            >
              {loadingPwd ? "Connexion..." : "Se connecter"}
            </button>

            <p className="text-xs font-semibold text-zinc-500">
              Astuce : crée ton user dans Supabase Auth (Users → Add user) pour éviter tout envoi d’email.
            </p>
          </form>
        )}

        {/* Magic mode */}
        {mode === "magic" && (
          <form onSubmit={sendMagicLink} className="mt-4 space-y-4">
            <button
              type="submit"
              disabled={loadingMagic || cooldown > 0}
              className="w-full rounded-2xl bg-black p-4 font-black text-white hover:bg-zinc-800 transition disabled:opacity-50"
            >
              {loadingMagic
                ? "Envoi..."
                : cooldown > 0
                ? `Réessayer dans ${cooldown}s`
                : "Envoyer le lien"}
            </button>

            <p className="text-xs font-semibold text-zinc-500">
              Ton projet Supabase est limité à 2 emails/heure : si tu testes beaucoup, ça bloque.
            </p>
          </form>
        )}

        {info && (
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-800 font-bold">
            {info}
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
