"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type ProfessionValue = "immo";

export default function SignupPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ métier forcé
  const profession: ProfessionValue = "immo";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : "https://www.progressive-pulse.fr/login";

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            profession,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(
        "Compte créé. Vérifie tes emails pour confirmer ton inscription."
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err: any) {
      setError(err?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D6DBF5] bg-white px-5 py-3 shadow-sm">
            <span className="size-2 rounded-full bg-indigo-500" />
            <span className="text-sm font-extrabold uppercase tracking-wide text-slate-700">
              Crée ton compte gratuitement
            </span>
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
            Active ton compte.
            <br />
            <span className="text-indigo-600">
              Teste avec 1 dossier offert.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-relaxed text-slate-500">
            Aucun abonnement. Aucune carte bancaire. Tu crées ton compte, tu
            reçois 1 crédit gratuit, puis tu peux commencer immédiatement.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "1 dossier offert dès l’inscription",
              "Aucun compte requis côté client",
              "Actif en quelques secondes",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-black text-white">
                  ✓
                </div>

                <span className="text-lg font-semibold text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-[32px] border border-[#E2E8F0] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <form onSubmit={handleSignup}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Julien"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />

              <input
                type="text"
                placeholder="Dupont"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Email
              </label>

              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Téléphone
              </label>

              <input
                type="tel"
                placeholder="06 00 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Mot de passe
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Création du compte..."
                : "Créer mon compte gratuitement"}
            </button>

            <div className="mt-8 text-center text-sm font-semibold text-slate-500">
              Déjà inscrit ?{" "}
              <Link
                href="/login"
                className="font-extrabold text-indigo-600 transition hover:text-indigo-500"
              >
                Connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}