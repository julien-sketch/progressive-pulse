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
      redirectTo: `${origin}/reset-password`,
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
    const ePhone = phone.trim();
    const eProfession = profession.trim();

    if (!firstName.trim()) return setErr("Renseigne le prénom.");
    if (!lastName.trim()) return setErr("Renseigne le nom.");
    if (!eEmail) return setErr("Renseigne l’email.");
    if (!ePhone) return setErr("Renseigne le téléphone.");
    if (!ePwd || ePwd.length < 8) {
      return setErr("Mot de passe : 8 caractères minimum.");
    }

    setLoadingSignup(true);

    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: eEmail,
      password: ePwd,
      options: {
        emailRedirectTo: `${origin}/login`,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: ePhone,
          profession: eProfession,
        },
      },
    });

    if (signUpErr) {
      setLoadingSignup(false);
      setErr(signUpErr.message);
      return;
    }

    // Si confirmation email OFF => session directe
    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUser = sessionData.session?.user ?? null;

    setLoadingSignup(false);

    if (sessionUser?.id || signUpData.session?.user?.id) {
      setInfo("Compte créé. Redirection...");
      window.location.href = "/pro";
      return;
    }

    setInfo("Compte créé. Confirme ton email pour activer l’accès, puis reconnecte-toi.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex size-10 items-center justify-center rounded-full transition hover:bg-slate-100"
            aria-label="Retour"
          >
            <ArrowLeft className="size-5" />
          </button>

          <div className="flex-1 text-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-700 ring-1 ring-indigo-100">
              Pro-Pulse
            </div>
            <div className="mt-2 font-extrabold tracking-tight">
              {mode === "signup" ? "Créer un compte Pro" : "Connexion Pro"}
            </div>
          </div>

          <div className="w-10" />
        </div>
      </header>

      <div className="px-6 pb-12 pt-10">
        <div className="mx-auto max-w-md">
          <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="p-6">
              <h1 className="text-2xl font-extrabold tracking-tight">
                {mode === "signup" ? "Créer un compte Pro" : "Accès professionnel"}
              </h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {mode === "signup"
                  ? "1 dossier offert à l’inscription, sans carte bancaire."
                  : "Connecte-toi pour gérer tes dossiers."}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-[#E2E8F0] bg-slate-50 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("password");
                    setErr(null);
                    setInfo(null);
                  }}
                  className={`rounded-xl px-3 py-2 text-sm font-extrabold transition ${
                    mode === "password"
                      ? "bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] text-white shadow-sm"
                      : "bg-transparent text-slate-700 hover:bg-white"
                  }`}
                >
                  Mot de passe
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErr(null);
                    setInfo(null);
                  }}
                  className={`rounded-xl px-3 py-2 text-sm font-extrabold transition ${
                    mode === "signup"
                      ? "bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] text-white shadow-sm"
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
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-extrabold outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                      placeholder="8 caractères minimum"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingSignup}
                    className="w-full rounded-2xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] p-4 font-extrabold text-white shadow-[0_12px_28px_rgba(79,70,229,0.20)] transition disabled:opacity-50 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)] active:scale-[0.98]"
                  >
                    {loadingSignup ? "Création..." : "Créer mon compte"}
                  </button>
                </form>
              )}

              {mode === "password" && (
                <form onSubmit={loginPassword} className="mt-4 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
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
                      className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingPwd}
                    className="w-full rounded-2xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] p-4 font-extrabold text-white shadow-[0_12px_28px_rgba(79,70,229,0.20)] transition disabled:opacity-50 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)] active:scale-[0.98]"
                  >
                    {loadingPwd ? "Connexion..." : "Se connecter"}
                  </button>
                </form>
              )}

              {info && (
                <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 font-bold text-emerald-800">
                  {info}
                </div>
              )}

              {err && (
                <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 font-bold text-red-700">
                  {err}
                </div>
              )}
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-300">
            Propulsé par Pro-Pulse
          </p>
        </div>
      </div>
    </div>
  );
}