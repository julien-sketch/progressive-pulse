"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type ProfessionValue =
  | "courtier"
  | "immo"
  | "of"
  | "artisan"
  | "freelance"
  | "other";

const PROFESSION_OPTIONS: Array<{ value: ProfessionValue; label: string }> = [
  { value: "courtier", label: "Courtier" },
  { value: "immo", label: "Agent immobilier" },
  { value: "of", label: "Organisme de formation" },
  { value: "artisan", label: "Artisan" },
  { value: "freelance", label: "Freelance" },
  { value: "other", label: "Autre" },
];

export default function SignupPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState<ProfessionValue>("courtier");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptLegal, setAcceptLegal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg("Renseigne ton prénom et ton nom.");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Renseigne ton email.");
      return;
    }

    if (!phone.trim()) {
      setErrorMsg("Renseigne ton téléphone.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!acceptLegal) {
      setErrorMsg("Tu dois accepter les CGU et les CGV pour créer un compte.");
      return;
    }

    setLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : undefined;

      const acceptedAt = new Date().toISOString();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            profession,
            accepted_cgu: true,
            accepted_cgv: true,
            accepted_legal_at: acceptedAt,
          },
        },
      });

      if (error) {
        throw error;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session || data.session) {
        window.location.href = "/pro";
        return;
      }

      setSuccessMsg(
        "Compte créé. Vérifie ton email pour confirmer ton inscription, puis connecte-toi."
      );
    } catch (err: any) {
      setErrorMsg(err?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.18),transparent_60%)] opacity-25 blur-3xl" />
        <div className="absolute -left-60 top-1/2 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.12),transparent_60%)] opacity-15 blur-3xl" />
      </div>

      <div className="bg-indigo-600 px-4 py-2.5 text-center text-xs font-extrabold tracking-wide text-white">
        🎁 1 dossier offert à l&apos;inscription — aucune carte bancaire requise
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-6xl items-center px-6 py-12">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm">
              <span className="size-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Crée ton compte gratuitement
              </span>
            </div>

            <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Active ton compte.
              <br />
              <span className="text-indigo-600">Teste avec 1 dossier offert.</span>
            </h1>

            <p className="mb-8 max-w-lg text-base font-semibold leading-relaxed text-slate-500">
              Aucun abonnement. Aucune carte bancaire. Tu crées ton compte, tu
              reçois 1 crédit gratuit, puis tu peux commencer immédiatement.
            </p>

            <div className="space-y-4">
              {[
                "1 dossier offert dès l’inscription",
                "Aucun compte requis côté client",
                "Actif en quelques secondes",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-extrabold text-white">
                    ✓
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Créer mon compte
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                1 dossier gratuit à la création. Puis achat de crédits uniquement si besoin.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Julien"
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 00 00 00 00"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Métier
                </label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value as ProfessionValue)}
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  {PROFESSION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Confirmer
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme le mot de passe"
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptLegal}
                    onChange={(e) => setAcceptLegal(e.target.checked)}
                    className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-slate-600 leading-6">
                    J’accepte les{" "}
                    <Link href="/cgu" className="font-extrabold text-indigo-600 hover:text-indigo-700 underline">
                      CGU
                    </Link>{" "}
                    et les{" "}
                    <Link href="/cgv" className="font-extrabold text-indigo-600 hover:text-indigo-700 underline">
                      CGV
                    </Link>
                    . J’ai également pris connaissance de la{" "}
                    <Link
                      href="/confidentialite"
                      className="font-extrabold text-indigo-600 hover:text-indigo-700 underline"
                    >
                      politique de confidentialité
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {errorMsg ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {errorMsg}
                </div>
              ) : null}

              {successMsg ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {successMsg}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(79,70,229,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Création du compte..." : "Créer mon compte gratuitement"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm font-semibold text-slate-500">
              Déjà inscrit ?{" "}
              <Link
                href="/login"
                className="font-extrabold text-indigo-600 hover:text-indigo-700"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}