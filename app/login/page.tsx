"use client";

import { useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { ArrowLeft } from "lucide-react";

type Mode = "password" | "signup";

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

  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // password login
  const [password, setPassword] = useState("");
  const [loadingPwd, setLoadingPwd] = useState(false);

  // forgot password
  const [resetLoading, setResetLoading] = useState(false);

  // signup fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("courtier");
  const [loadingSignup, setLoadingSignup] = useState(false);

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

  const handleForgotPassword = async () => {
    const eEmail = email.trim();
    if (!eEmail) {
      setErr("Renseigne ton email pour recevoir le lien.");
      setInfo(null);
      return;
    }

    setErr(null);
    setInfo(null);
    setResetLoading(true);

    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(eEmail, {
      redirectTo: `${origin}/auth/callback`,
    });

    setResetLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    setInfo("Email de réinitialisation envoyé. Vérifie ta boîte mail (et le spam).");
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

    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: eEmail,
      password: ePwd,
    });

    if (signUpErr) {
      setLoadingSignup(false);
      setErr(signUpErr.message);
      return;
    }

    // Si confirmation OFF, on peut être déjà connecté / sinon on tente un login
    let userId = signUpData.user?.id ?? null;

    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUser = sessionData.session?.user ?? null;

    if (sessionUser?.id) {
      userId = sessionUser.id;
    } else {
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email: eEmail,
        password: ePwd,
      });
      if (!loginErr) {
        const { data: sessionData2 } = await supabase.auth.getSession();
        userId = sessionData2.session?.user?.id ?? userId;
      }
    }

    // On met à jour le profil uniquement si on a une session active
    const { data: sessionData3 } = await supabase.auth.getSession();
    const finalUser = sessionData3.session?.user ?? null;

    if (finalUser?.id) {
      const { error: upErr } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          profession,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", finalUser.id);

      setLoadingSignup(false);

      if (upErr) {
        setErr(`Compte créé, profil non mis à jour : ${upErr.message}`);
        return;
      }

      setInfo("Compte créé. Redirection...");
      window.location.href = "/pro";
      return;
    }

    // Pas de session => confirmation email ON
    setLoadingSignup(false);
    setInfo("Compte créé. Confirme ton email pour activer l’accès, puis reconnecte-toi.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* subtle background glow */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle,rgba(79,70,229,0.18),transparent_60%)]" />
        <div className="absolute top-32 -left-40 h-[420px] w-[420px] rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle,rgba(13,148,136,0.12),transparent_60%)]" />
      </div>

      {/* header simple */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition"
            aria-label="Retour"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1 text-center font-extrabold tracking-tight">
            {mode === "signup" ? "Créer un compte Pro" : "Connexion Pro"}
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 pt-10 pb-12">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] border border-[#E2E8F0]">
          <div className="mb-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider ring-1 ring-indigo-100">
              Progressive Pulse
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
              {mode === "signup" ? "Créer un compte Pro" : "Accès professionnel"}
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-semibold">
              Connecte-toi pour gérer tes dossiers.
            </p>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F8FAFC] p-2 border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`rounded-xl px-3 py-2 text-sm font-extrabold transition ${
                mode === "password"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-transparent text-slate-700 hover:bg-white"
              }`}
            >
              Mot de passe
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-xl px-3 py-2 text-sm font-extrabold transition ${
                mode === "signup"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-transparent text-slate-700 hover:bg-white"
              }`}
            >
              Inscription
            </button>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Email
            </label>
            <input
              required
              type="email"
              className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 outline-none transition-all
                         focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              placeholder="ex: pro@agence.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {mode === "signup" && (
            <form onSubmit={signup} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Prénom
                  </label>
                  <input
                    required
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 outline-none transition-all
                               focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Nom
                  </label>
                  <input
                    required
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 outline-none transition-all
                               focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  Téléphone
                </label>
                <input
                  required
                  type="tel"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 outline-none transition-all
                             focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  placeholder="ex: 06 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  Métier
                </label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 font-extrabold outline-none transition-all
                             focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                >
                  {PROFESSION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  Mot de passe
                </label>
                <input
                  required
                  type="password"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 outline-none transition-all
                             focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loadingSignup}
                className="w-full rounded-2xl p-4 font-extrabold text-white transition disabled:opacity-50
                           bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)]
                           shadow-[0_12px_28px_rgba(79,70,229,0.22)]
                           hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)]
                           active:translate-y-[1px]"
              >
                {loadingSignup ? "Création..." : "Créer mon compte"}
              </button>
            </form>
          )}

          {mode === "password" && (
            <form onSubmit={loginPassword} className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Mot de passe
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="text-xs font-extrabold text-indigo-700 hover:underline disabled:opacity-60"
                    title="Recevoir un lien de réinitialisation"
                  >
                    {resetLoading ? "Envoi..." : "Mot de passe oublié ?"}
                  </button>
                </div>

                <input
                  required
                  type="password"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 outline-none transition-all
                             focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loadingPwd}
                className="w-full rounded-2xl p-4 font-extrabold text-white transition disabled:opacity-50
                           bg-slate-900 hover:bg-slate-800"
              >
                {loadingPwd ? "Connexion..." : "Se connecter"}
              </button>

              <div className="text-xs font-semibold text-slate-500 text-center">
                Astuce : utilise le bouton “Essayer” sur la landing pour aller plus vite.
              </div>
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

        <p className="mt-8 text-center text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-300">
          Propulsé par Progressive Pulse
        </p>
      </div>
    </div>
  );
}