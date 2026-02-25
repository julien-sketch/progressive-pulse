"use client";

import { useMemo, useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Mode = "password" | "magic" | "signup";

const PROFESSION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "courtier", label: "Courtier" },
  { value: "immo", label: "Agent immobilier" },
  { value: "of", label: "Organisme de formation" },
  { value: "artisan", label: "Artisan" },
  { value: "freelance", label: "Freelance" },
  { value: "other", label: "Autre" },
];

export default function LoginPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [mode, setMode] = useState<Mode>("password");

  // shared
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // password login
  const [password, setPassword] = useState("");
  const [loadingPwd, setLoadingPwd] = useState(false);

  // magic link
  const [loadingMagic, setLoadingMagic] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("courtier");
  const [loadingSignup, setLoadingSignup] = useState(false);

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

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);

    const eEmail = email.trim();
    const ePwd = password;
    if (!firstName.trim()) return setErr("Renseigne le prénom.");
    if (!lastName.trim()) return setErr("Renseigne le nom.");
    if (!eEmail) return setErr("Renseigne l’email.");
    if (!phone.trim()) return setErr("Renseigne le téléphone.");
    if (!ePwd || ePwd.length < 8) return setErr("Mot de passe : 8 caractères minimum.");

    setLoadingSignup(true);

    const { data, error } = await supabase.auth.signUp({
      email: eEmail,
      password: ePwd,
    });

    if (error) {
      setLoadingSignup(false);
      setErr(error.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoadingSignup(false);
      setErr("Création utilisateur incomplète (userId manquant).");
      return;
    }

    const { error: profileErr } = await supabase.from("profiles").insert({
      user_id: userId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      profession,
    });

    setLoadingSignup(false);

    if (profileErr) {
      setErr(`Compte créé, mais profil non enregistré : ${profileErr.message}`);
      return;
    }

    // Selon config Supabase, email de confirmation possible.
    // Si confirmation OFF, l'utilisateur est déjà connecté.
    setInfo("Compte créé. Redirection...");
    window.location.href = "/pro";
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 pt-20 text-zinc-900">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl border border-zinc-100">
        <h1 className="text-2xl font-black tracking-tight">
          {mode === "signup" ? "Créer un compte Pro" : "Connexion Pro"}
        </h1>

        <p className="mt-2 text-sm text-zinc-500 font-semibold">
          {mode === "signup"
            ? "On te demande ton métier et ton téléphone pour préparer les bons dossiers automatiquement."
            : "Connexion simple. En prod, tu peux activer magic link quand ton quota email est OK."}
        </p>

        {/* Mode switch */}
        <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-zinc-50 p-2 border border-zinc-100">
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
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-xl px-3 py-2 text-sm font-black transition ${
              mode === "signup" ? "bg-black text-white" : "bg-transparent text-zinc-700 hover:bg-white"
            }`}
          >
            Inscription
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

        {/* SIGNUP */}
        {mode === "signup" && (
          <form onSubmit={signup} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
                  Prénom
                </label>
                <input
                  required
                  className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
                  Nom
                </label>
                <input
                  required
                  className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
                Téléphone
              </label>
              <input
                required
                type="tel"
                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
                placeholder="ex: 06 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
                Métier
              </label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 font-bold outline-none focus:border-zinc-300 transition-all"
              >
                {PROFESSION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
                Mot de passe
              </label>
              <input
                required
                type="password"
                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
                placeholder="8 caractères minimum"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loadingSignup}
              className="w-full rounded-2xl bg-black p-4 font-black text-white hover:bg-zinc-800 transition disabled:opacity-50"
            >
              {loadingSignup ? "Création..." : "Créer mon compte"}
            </button>
          </form>
        )}

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
              {loadingMagic ? "Envoi..." : cooldown > 0 ? `Réessayer dans ${cooldown}s` : "Envoyer le lien"}
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