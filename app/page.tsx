"use client";

import { useState } from "react";

function InteractiveDemo() {
  const [step, setStep] = useState<"create" | "link" | "client">("create");
  const [clientName, setClientName] = useState("");
  const [dossierName, setDossierName] = useState("");
  const [link, setLink] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const dossierSteps = [
    "Prise en charge",
    "Documents reçus",
    "Analyse en cours",
    "Validation finale",
    "Dossier clôturé",
  ];

  const handleGenerate = () => {
    if (!clientName || !dossierName) return;
    const slug = dossierName.toLowerCase().replace(/\s+/g, "-");
    const rand = Math.random().toString(36).slice(2, 6);
    setLink(`suivi.progressivepulse.app/${slug}-${rand}`);
    setStep("link");
  };

  const handleAdvance = () => {
    if (activeStep < dossierSteps.length - 1) {
      const next = activeStep + 1;
      setActiveStep(next);
      setProgress(Math.round((next / (dossierSteps.length - 1)) * 100));
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex justify-center">
        <div className="inline-flex gap-1 rounded-2xl border border-[#E2E8F0] bg-white p-1 shadow-sm">
          {[
            { id: "create", label: "1. Créer" },
            { id: "link", label: "2. Lien généré" },
            { id: "client", label: "3. Vue client" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStep(tab.id as "create" | "link" | "client")}
              className={`rounded-xl px-5 py-2.5 text-xs font-extrabold transition-all ${
                step === tab.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] bg-slate-50 px-5 py-3">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-amber-400" />
          <span className="size-3 rounded-full bg-green-400" />
          <span className="mx-auto text-xs font-semibold text-slate-400">
            {step === "client"
              ? link || "suivi.progressivepulse.app/mon-dossier"
              : "dashboard.progressivepulse.app"}
          </span>
        </div>

        <div className="flex min-h-[340px] flex-col justify-center p-8">
          {step === "create" && (
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-8 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                    ⚡ Moins de 10 secondes
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  Créez votre dossier
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  2 champs. C&apos;est tout.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    placeholder="ex : Martin Sophie"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Nom du dossier
                  </label>
                  <input
                    type="text"
                    placeholder="ex : Achat appartement Lyon"
                    value={dossierName}
                    onChange={(e) => setDossierName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!clientName || !dossierName}
                  className="w-full rounded-2xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] px-6 py-4 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(79,70,229,0.22)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Générer le lien client →
                </button>
              </div>
            </div>
          )}

          {step === "link" && (
            <div className="mx-auto w-full max-w-md text-center">
              <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-3xl">
                🔗
              </div>
              <h3 className="mb-1 text-xl font-extrabold text-slate-800">
                Lien généré !
              </h3>
              <p className="mb-6 text-sm font-semibold text-slate-400">
                Envoyez-le à votre client par email, SMS ou WhatsApp.
              </p>

              <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-left">
                <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                  Dossier créé
                </div>
                <div className="mb-1 text-sm font-extrabold text-slate-800">
                  {dossierName || "Achat appartement Lyon"}
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  Client : {clientName || "Martin Sophie"}
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex-1 truncate text-left text-xs font-semibold text-slate-500">
                  {link}
                </div>
                <button className="flex-shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-indigo-700">
                  Copier
                </button>
              </div>

              <button
                onClick={() => setStep("client")}
                className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-6 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                Voir ce que voit votre client →
              </button>
            </div>
          )}

          {step === "client" && (
            <div className="mx-auto w-full max-w-md">
              <div className="mb-6 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-600">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Vue client — accès par lien unique
                </span>
              </div>

              <div className="mb-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="text-base font-extrabold">
                      {dossierName || "Achat appartement Lyon"}
                    </div>
                    <div className="mt-0.5 text-xs font-semibold text-slate-400">
                      Client : {clientName || "Martin Sophie"}
                    </div>
                  </div>
                  <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-600 ring-1 ring-indigo-100">
                    En cours
                  </div>
                </div>

                <div className="mb-5">
                  <div className="mb-2 flex justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Progression
                    </span>
                    <span className="text-xs font-extrabold text-indigo-600">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#4F46E5,#7C3AED)] transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mb-5 space-y-2">
                  {dossierSteps.map((s, i) => (
                    <div
                      key={s}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                        i === activeStep
                          ? "border border-indigo-100 bg-indigo-50"
                          : "border border-[#E2E8F0] bg-white"
                      }`}
                    >
                      <div
                        className={`flex size-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${
                          i < activeStep
                            ? "bg-indigo-600 text-white"
                            : i === activeStep
                            ? "border-2 border-indigo-400 bg-indigo-100 text-indigo-600"
                            : "bg-slate-100 text-slate-300"
                        }`}
                      >
                        {i < activeStep ? "✓" : i + 1}
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          i < activeStep
                            ? "text-slate-400 line-through"
                            : i === activeStep
                            ? "font-extrabold text-slate-800"
                            : "text-slate-300"
                        }`}
                      >
                        {s}
                      </span>

                      {i === activeStep && (
                        <span className="ml-auto text-[10px] font-extrabold text-indigo-500">
                          En cours
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {activeStep < dossierSteps.length - 1 ? (
                  <button
                    onClick={handleAdvance}
                    className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-extrabold text-indigo-600 transition hover:bg-indigo-50"
                  >
                    ↗ Simuler une mise à jour (côté pro)
                  </button>
                ) : (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">
                    <span className="text-xs font-extrabold text-emerald-600">
                      🎉 Dossier clôturé !
                    </span>
                  </div>
                )}
              </div>

              <p className="text-center text-xs font-semibold text-slate-400">
                C&apos;est exactement ce que voit votre client sur son téléphone.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen text-slate-900">
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.18),transparent_60%)] opacity-25 blur-3xl" />
        <div className="absolute -left-60 top-1/2 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.12),transparent_60%)] opacity-15 blur-3xl" />
      </div>

      {/* BANNER */}
      <div className="bg-indigo-600 px-4 py-2.5 text-center text-xs font-extrabold tracking-wide text-white">
        🎁 1 dossier offert à l&apos;inscription — aucune carte bancaire requise
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 font-extrabold text-white shadow-[0_8px_20px_rgba(79,70,229,0.22)]">
                  P
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-extrabold tracking-tight">
                    Progressive Pulse
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Suivi de dossiers
                  </div>
                </div>
              </div>

              <nav className="hidden items-center gap-6 md:flex">
                {[
                  ["Comment ça marche", "#how"],
                  ["Métiers", "#metiers"],
                  ["Tarifs", "#tarifs"],
                  ["FAQ", "#faq"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <a
                  href="/login"
                  className="hidden text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 sm:inline"
                >
                  Connexion
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(79,70,229,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(79,70,229,0.28)]"
                >
                  Commencer gratuitement
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="flex min-h-[90vh] items-center justify-center bg-[#F8FAFC] px-6 pb-20 pt-8">
        <div className="w-full max-w-6xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm">
            <span className="size-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              1 dossier offert à l&apos;inscription
            </span>
          </div>

          <h1 className="mx-auto mb-8 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[62px]">
            Créez un dossier
            <br />
            <span className="text-indigo-600">en 10 secondes.</span>
            <br />
            <span className="text-slate-400">Votre client suit. Sans relancer.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg font-semibold leading-relaxed text-slate-500">
            Nom du client, nom du dossier, lien généré. Votre client suit
            l’avancement en temps réel, sans créer de compte.
          </p>

          <div className="mb-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className="rounded-2xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] px-8 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(79,70,229,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)]"
            >
              🎁 Commencer gratuitement
            </a>
            <a
              href="#demo"
              className="rounded-2xl border border-[#E2E8F0] bg-white px-8 py-4 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
            >
              ▶ Voir la démo en direct
            </a>
          </div>

          <div className="mb-12 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              "Aucun abonnement",
              "Crédits sans expiration",
              "Aucun compte client requis",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"
              >
                <span className="text-indigo-500">✓</span>
                {item}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {["A", "M", "L", "S"].map((c) => (
                <div
                  key={c}
                  className="flex size-9 items-center justify-center rounded-full border-2 border-[#F8FAFC] bg-white text-sm font-extrabold text-slate-700 shadow-sm"
                >
                  {c}
                </div>
              ))}
            </div>
            <span className="text-sm font-extrabold text-slate-600">
              Déjà utilisé par des professionnels du suivi client
            </span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#E2E8F0] bg-white px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { num: "10s", label: "pour créer un dossier" },
            { num: "1 lien", label: "pour informer le client" },
            { num: "0€", label: "pour démarrer" },
            { num: "Sans compte", label: "côté client" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold tracking-tight text-indigo-600">
                {stat.num}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLÈME */}
      <section className="bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-500">
                Le problème
              </span>
            </div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Gérer un dossier client
              <br />
              est souvent <span className="text-red-400">chaotique</span>.
            </h2>
          </div>

          <div className="mb-10 grid gap-5 md:grid-cols-2">
            {[
              {
                emoji: "📞",
                title: '"Où en est mon dossier ?" — encore',
                desc: "Le 5ème appel de la semaine. Vos clients ne savent pas où vous en êtes, alors ils appellent.",
              },
              {
                emoji: "📎",
                title: "Des documents qui n'arrivent jamais au bon endroit",
                desc: "Email, WhatsApp, SMS… les pièces se perdent et vous passez votre temps à les chercher.",
              },
              {
                emoji: "📂",
                title: "Aucune visibilité pour le client",
                desc: "Sans suivi clair, le client se sent dans le flou. Le flou génère de la méfiance.",
              },
              {
                emoji: "🔁",
                title: "Des relances qui mangent votre journée",
                desc: "Chaque heure passée à relancer est une heure de moins sur vos vrais dossiers.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mt-0.5 flex-shrink-0 text-2xl">{item.emoji}</div>
                <div>
                  <div className="mb-1 text-sm font-extrabold text-slate-800">
                    {item.title}
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="max-w-xl rounded-2xl border border-indigo-100 bg-indigo-50 px-8 py-5 text-center">
              <p className="text-sm font-extrabold text-indigo-700">
                Progressive Pulse centralise tout dans un seul lien client —
                généré en 10 secondes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="how" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Simplicité
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              3 étapes. C&apos;est tout.
            </h2>
            <p className="mt-4 font-semibold leading-relaxed text-slate-500">
              Pas de formation, pas de complexité. Opérationnel en moins de 10
              secondes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                icon: "✏️",
                title: "Créez un dossier",
                desc: "Nom du client + nom du dossier. Deux champs. Moins de 10 secondes. C'est tout.",
              },
              {
                num: "02",
                icon: "🔗",
                title: "Envoyez le lien",
                desc: "Un lien unique est généré. Envoyez-le par email, SMS ou WhatsApp. Votre client l'ouvre sans compte.",
              },
              {
                num: "03",
                icon: "📊",
                title: "Mettez à jour les étapes",
                desc: "Vous avancez le dossier côté pro. Le client voit la progression en temps réel, sans vous appeler.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-7 shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="absolute bottom-2 right-3 select-none text-[80px] font-extrabold leading-none text-slate-100">
                  {item.num}
                </div>
                <div className="mb-5 text-3xl">{item.icon}</div>
                <div className="mb-2 text-xs font-extrabold uppercase tracking-widest text-indigo-500">
                  {item.num}
                </div>
                <h3 className="mb-2 text-lg font-extrabold">{item.title}</h3>
                <p className="text-sm font-semibold leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DÉMO */}
      <section id="demo" className="bg-[#F0F4FF] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Démo en direct
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Essayez maintenant.
              <br />
              <span className="text-indigo-600">Sans créer de compte.</span>
            </h2>
            <p className="mt-4 font-semibold leading-relaxed text-slate-500">
              Créez un vrai dossier, générez un vrai lien, voyez exactement ce
              que voit votre client.
            </p>
          </div>

          <InteractiveDemo />
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Documents
              </span>
            </div>
            <h2 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Récupérez les documents
              <br />
              <span className="text-indigo-600">
                sans courir après vos clients
              </span>
              .
            </h2>
            <p className="mb-8 font-semibold leading-relaxed text-slate-500">
              Votre client reçoit un lien unique, suit son dossier et vous
              transmet les documents attendus simplement, sans créer de compte.
            </p>

            <div className="space-y-4">
              {[
                "Moins d’allers-retours par email",
                "Moins de pièces perdues dans WhatsApp ou les SMS",
                "Un dossier plus vite complet",
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

          <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
            <div className="mb-4 rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-slate-800">
                    Pièces demandées
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    Dossier en cours
                  </div>
                </div>
                <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-600 ring-1 ring-indigo-100">
                  2 reçues / 4
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Pièce d’identité", status: "Reçu" },
                  { label: "Justificatif de domicile", status: "Reçu" },
                  { label: "Bulletins de salaire", status: "En attente" },
                  { label: "Avis d’imposition", status: "En attente" },
                ].map((doc) => (
                  <div
                    key={doc.label}
                    className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-slate-700">
                      {doc.label}
                    </span>
                    <span
                      className={`text-xs font-extrabold ${
                        doc.status === "Reçu"
                          ? "text-emerald-600"
                          : "text-amber-500"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-xs font-semibold text-slate-400">
              Une vue simple pour le client. Moins de relances pour vous.
            </p>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                  Fonctionnalités
                </span>
              </div>
              <h2 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Simple, rapide,
                <br />
                <span className="text-indigo-600">efficace</span>.
              </h2>
              <p className="mb-8 font-semibold leading-relaxed text-slate-500">
                Progressive Pulse simplifie le suivi client : un dossier créé en
                quelques secondes, un lien partagé, une progression visible sans
                relance.
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: "⚡",
                    title: "Dossier créé en moins de 10 secondes",
                    desc: "Deux champs. Un lien généré. Aucune configuration. Vous êtes opérationnel immédiatement.",
                  },
                  {
                    icon: "🔗",
                    title: "Lien unique par dossier",
                    desc: "Chaque dossier a son propre lien sécurisé. Votre client y accède sans compte ni mot de passe.",
                  },
                  {
                    icon: "📊",
                    title: "Barre de progression dynamique",
                    desc: "Vous mettez à jour une étape côté pro — la barre avance côté client, en temps réel.",
                  },
                  {
                    icon: "📧",
                    title: "Documents envoyés par mail sécurisé",
                    desc: "Votre client peut vous envoyer des documents via un lien sécurisé. Vous les recevez directement par email.",
                  },
                  {
                    icon: "📅",
                    title: "Récap hebdomadaire le lundi matin",
                    desc: "Chaque lundi, vous recevez un email avec tous vos dossiers en cours — pour ne rien oublier de mettre à jour.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600/10 text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <div className="mb-0.5 text-sm font-extrabold">
                        {item.title}
                      </div>
                      <p className="text-sm font-semibold leading-relaxed text-slate-500">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
                <div className="mb-6 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  Résultats observés
                </div>
                <div className="space-y-4">
                  {[
                    {
                      icon: "📞",
                      label: "Relances client",
                      value: "Moins fréquentes",
                    },
                    {
                      icon: "⏱️",
                      label: "Création du dossier",
                      value: "10 sec",
                    },
                    {
                      icon: "📂",
                      label: "Suivi du dossier",
                      value: "Plus clair",
                    },
                    {
                      icon: "⭐",
                      label: "Perception client",
                      value: "Plus professionnelle",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="flex-1 text-sm font-semibold text-slate-600">
                        {item.label}
                      </span>
                      <span className="text-sm font-extrabold text-indigo-600">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-7">
                <p className="mb-4 text-sm font-semibold italic leading-relaxed text-slate-700">
                  &quot;Depuis qu&apos;on envoie le lien de suivi, les clients
                  arrêtent de relancer. Ils voient l&apos;avancement. Ça change
                  tout.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-indigo-200 text-xs font-extrabold text-indigo-700">
                    D
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-700">
                      Dimitri
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      Courtier en financement
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTIERS */}
      <section id="metiers" className="bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Métiers
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Conçu pour les pros qui gèrent
              <br />
              des <span className="text-indigo-600">dossiers clients</span>.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                emoji: "🏠",
                title: "Agents immobiliers",
                desc: "Suivez chaque vente ou location de A à Z. Votre client voit chaque étape sans vous appeler.",
                tags: ["Mandat", "Compromis", "Acte de vente"],
              },
              {
                emoji: "💰",
                title: "Courtiers",
                desc: "Montrez l'avancement du dossier de financement en temps réel. Fini le téléphone qui sonne.",
                tags: ["Étude", "Accord", "Offre de prêt"],
              },
              {
                emoji: "🛠️",
                title: "Artisans & BTP",
                desc: "Informez vos clients de l'avancement du chantier à chaque étape clé.",
                tags: ["Devis", "Travaux", "Réception"],
              },
              {
                emoji: "💼",
                title: "Freelances",
                desc: "Donnez une visibilité totale sur l'avancement du projet. Plus de questions incessantes.",
                tags: ["Brief", "Production", "Livraison"],
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 text-3xl">{item.emoji}</div>
                <h3 className="mb-2 text-base font-extrabold">{item.title}</h3>
                <p className="mb-4 text-sm font-semibold leading-relaxed text-slate-500">
                  {item.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                Rentabilité
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Un coût <span className="text-indigo-600">invisible</span>
              <br />
              face à votre commission.
            </h2>
            <p className="mt-4 font-semibold leading-relaxed text-slate-500">
              Vous payez uniquement quand vous avez un vrai dossier à traiter.
              Pas d’abonnement à vide, pas de coût fixe inutile.
            </p>
          </div>

          <div className="mb-10 flex flex-col items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 sm:flex-row">
            <div className="flex-1">
              <p className="mb-1 text-sm font-extrabold text-indigo-800">
                Pas d’abonnement à vide.
              </p>
              <p className="text-sm font-semibold leading-relaxed text-indigo-600">
                Vous utilisez l’outil uniquement quand vous en avez besoin. Le
                coût reste très faible face à la valeur d’un dossier signé ou
                traité.
              </p>
            </div>
            <div className="flex-shrink-0 rounded-2xl bg-indigo-600 px-6 py-3 text-center">
              <div className="text-lg font-extrabold text-white">
                Coût maîtrisé
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-slate-50">
                  {[
                    "Métier",
                    "Gain moyen / dossier",
                    "Coût du suivi",
                    "Représente",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-400"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    m: "🏠 Agent immobilier",
                    g: "5 000€ – 15 000€",
                    c: "19€",
                    r: "0,1% à 0,4% du gain",
                  },
                  {
                    m: "💰 Courtier",
                    g: "2 000€ – 4 000€",
                    c: "19€",
                    r: "0,5% à 1% du gain",
                  },
                  {
                    m: "🛠️ Artisan",
                    g: "1 500€ – 8 000€",
                    c: "19€",
                    r: "0,2% à 1,3% du gain",
                  },
                  {
                    m: "💼 Freelance",
                    g: "500€ – 3 000€",
                    c: "19€",
                    r: "0,6% à 3,8% du gain",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.m}
                    className={`border-b border-[#E2E8F0] transition hover:bg-slate-50 ${
                      i % 2 !== 0 ? "bg-[#FAFBFC]" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-extrabold">{row.m}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                      {row.g}
                    </td>
                    <td className="px-6 py-4 text-sm font-extrabold text-indigo-600">
                      {row.c}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-400">
                      {row.r}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-center font-semibold italic text-slate-500">
            &quot;Un seul dossier rentable rembourse largement l&apos;outil.{" "}
            <span className="font-extrabold not-italic text-indigo-600">
              Le calcul est vite fait.
            </span>
            &quot;
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" className="bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Tarifs
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Payez uniquement
              <br />
              quand vous <span className="text-indigo-600">travaillez</span>.
            </h2>
            <p className="mt-4 font-semibold leading-relaxed text-slate-500">
              Zéro abonnement. Zéro frais fixe. Des crédits qui n&apos;expirent
              jamais.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-3">
              <span className="text-sm font-extrabold text-amber-700">
                🎁 Votre premier dossier est offert à la création du compte.
                Ensuite, achetez des crédits uniquement si vous souhaitez créer
                d&apos;autres dossiers.
              </span>
            </div>
          </div>

          <div className="grid items-start gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
              <div className="mb-1 text-sm font-extrabold">Découverte</div>
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-600 ring-1 ring-amber-100">
                🎁 Offert à l&apos;inscription
              </div>
              <div className="mb-1 text-5xl font-extrabold tracking-tight">0€</div>
              <div className="mb-1 text-sm font-semibold text-slate-400">
                Sans carte bancaire
              </div>
              <div className="mb-6 text-xs font-semibold text-indigo-500">
                → Pour tester sans risque
              </div>
              <div className="mb-0.5 text-2xl font-extrabold">1 dossier</div>
              <div className="mb-6 text-sm font-semibold text-slate-400">
                inclus à la création de compte
              </div>
              <div className="mb-6 h-px bg-[#E2E8F0]" />
              <ul className="mb-8 space-y-3 text-sm font-semibold text-slate-600">
                {[
                  "Espace client partageable",
                  "Barre de progression",
                  "Lien unique sécurisé",
                  "Récap lundi matin",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4 text-sm font-extrabold text-slate-800 transition hover:bg-slate-100"
              >
                Créer mon compte →
              </a>
            </div>

            <div className="relative rounded-3xl border border-indigo-200 bg-indigo-50/60 p-1 shadow-[0_28px_80px_rgba(79,70,229,0.14)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                ⚡ Populaire
              </div>
              <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-7">
                <div className="mb-1 text-sm font-extrabold">Pro</div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-600 ring-1 ring-amber-100">
                  🏷 Économisez 31%
                </div>
                <div className="mb-1 flex items-end gap-1.5">
                  <div className="text-5xl font-extrabold tracking-tight">69€</div>
                  <div className="pb-2 text-sm font-extrabold text-slate-500">
                    HT
                  </div>
                </div>
                <div className="mb-6 text-xs font-semibold text-indigo-500">
                  → 13,80€ par dossier
                </div>
                <div className="mb-0.5 text-2xl font-extrabold">5 dossiers</div>
                <div className="mb-6 text-sm font-semibold text-slate-400">
                  Crédits sans expiration
                </div>
                <div className="mb-6 h-px bg-[#E2E8F0]" />
                <ul className="mb-8 space-y-3 text-sm font-semibold text-slate-600">
                  {[
                    "Tout du pack Découverte",
                    "Mises à jour illimitées",
                    "Documents reçus par mail sécurisé",
                    "Support par email",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-indigo-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(79,70,229,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)]"
                >
                  Réserver mes crédits →
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
              <div className="mb-1 text-sm font-extrabold">Business</div>
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-600 ring-1 ring-amber-100">
                🏷 Économisez 48%
              </div>
              <div className="mb-1 flex items-end gap-1.5">
                <div className="text-5xl font-extrabold tracking-tight">149€</div>
                <div className="pb-2 text-sm font-extrabold text-slate-500">
                  HT
                </div>
              </div>
              <div className="mb-6 text-xs font-semibold text-indigo-500">
                → 9,93€ par dossier
              </div>
              <div className="mb-0.5 text-2xl font-extrabold">15 dossiers</div>
              <div className="mb-6 text-sm font-semibold text-slate-400">
                Crédits sans expiration
              </div>
              <div className="mb-6 h-px bg-[#E2E8F0]" />
              <ul className="mb-8 space-y-3 text-sm font-semibold text-slate-600">
                {[
                  "Tout du pack Pro",
                  "Utilisable par plusieurs collaborateurs",
                  "Support prioritaire par email",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-indigo-200 px-6 py-4 text-sm font-extrabold text-indigo-600 transition hover:bg-indigo-50"
              >
                Réserver mes crédits →
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              "🔒 Paiement sécurisé",
              "♾️ Crédits sans expiration",
              "👤 Aucun compte client requis",
              "⚡ Actif en 10 secondes",
              "🚫 Zéro abonnement",
            ].map((item) => (
              <span key={item} className="text-sm font-semibold text-slate-400">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-16 md:grid-cols-[1fr_0.85fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                FAQ
              </span>
            </div>
            <h2 className="mb-10 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Les questions
              <br />
              qu&apos;on nous <span className="text-indigo-600">pose</span>.
            </h2>

            <div className="space-y-3">
              {[
                {
                  q: "Le client doit-il créer un compte ?",
                  a: "Non. Votre client accède à son espace via un lien unique que vous lui envoyez. Aucune inscription, aucun mot de passe requis.",
                },
                {
                  q: "Combien de temps pour créer un dossier ?",
                  a: "Moins de 10 secondes. Vous entrez le nom du client et le nom du dossier — un lien unique est généré instantanément.",
                },
                {
                  q: "Comment le client envoie ses documents ?",
                  a: "Via un lien sécurisé intégré à son espace. Les documents vous sont transmis directement par email. Pas de stockage dans l'interface pro.",
                },
                {
                  q: "Les crédits ont-ils une date d'expiration ?",
                  a: "Non. Vos crédits sont permanents. Vous les utilisez à votre rythme, sans aucune pression.",
                },
                {
                  q: "Puis-je utiliser l'outil à plusieurs dans mon cabinet ?",
                  a: "Oui, si vous le souhaitez, plusieurs collaborateurs peuvent utiliser les mêmes codes d’accès au sein de votre structure. Une gestion d’équipe plus avancée n’est pas incluse à ce stade.",
                },
                {
                  q: "C'est quoi le mail du lundi matin ?",
                  a: "Chaque lundi matin, vous recevez automatiquement un récapitulatif de tous vos dossiers en cours — pour ne rien oublier de mettre à jour en début de semaine.",
                },
                {
                  q: "Et si je n'ai pas de client actif en ce moment ?",
                  a: "Aucun problème — vous ne payez rien. Pas d'abonnement à vide. Vous dépensez uniquement quand vous avez un dossier actif.",
                },
                {
                  q: "Les données sont-elles sécurisées ?",
                  a: "Oui. Chaque dossier possède son propre lien unique et l’accès n’est pas indexé publiquement. Seules les personnes disposant du lien peuvent consulter le suivi.",
                },
                {
                  q: "Le lien client est-il public ou protégé ?",
                  a: "Chaque dossier possède une URL unique et aléatoire. Seules les personnes qui reçoivent ce lien peuvent y accéder. Il n'y a aucun annuaire, aucune liste publique.",
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50">
                    {item.q}
                    <span className="ml-4 flex-shrink-0 text-slate-300 transition-transform group-open:rotate-180 group-open:text-indigo-500">
                      ▼
                    </span>
                  </summary>
                  <div className="border-t border-[#E2E8F0] px-6 pb-5 pt-4 text-sm font-semibold leading-relaxed text-slate-500">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="sticky top-24 rounded-3xl border border-indigo-200 bg-indigo-50 p-8 shadow-[0_20px_60px_rgba(79,70,229,0.10)]">
            <div className="mb-3 text-2xl font-extrabold tracking-tight">
              1 dossier offert.
              <br />
              Aucune carte requise.
            </div>
            <p className="mb-7 text-sm font-semibold leading-relaxed text-slate-600">
              Testez Progressive Pulse gratuitement sur un vrai dossier. Voyez
              par vous-même en moins de 10 secondes.
            </p>
            <a
              href="/signup"
              className="mb-4 inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(79,70,229,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)]"
            >
              🎁 Commencer gratuitement
            </a>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {["Sans CB", "Aucun abonnement", "10 secondes"].map((item) => (
                <span key={item} className="text-xs font-semibold text-slate-500">
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-indigo-700 px-6 py-28 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Simplifiez la gestion
            <br />
            de vos dossiers clients.
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg font-semibold leading-relaxed opacity-90">
            Un lien. 10 secondes. Votre client est informé en temps réel.
            Commencez avec 1 dossier offert — sans carte.
          </p>
          <div className="mb-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className="rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-indigo-700 transition hover:bg-indigo-50"
            >
              🎁 Créer mon premier dossier
            </a>
            <a
              href="#demo"
              className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-extrabold text-white transition hover:bg-white/20"
            >
              Voir la démo →
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              "1 dossier offert sans CB",
              "Aucun abonnement",
              "Actif en 10 secondes",
            ].map((item) => (
              <span key={item} className="text-xs font-semibold opacity-80">
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
<footer className="bg-[#F8FAFC] px-6 py-16">
  <div className="mx-auto mb-12 grid max-w-6xl gap-10 md:grid-cols-4">
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-600 text-sm font-extrabold text-white">
          P
        </div>
        <span className="text-sm font-extrabold">Progressive Pulse</span>
      </div>
      <p className="text-sm font-semibold leading-relaxed text-slate-500">
        Le suivi de dossiers simple et partageable, pour informer vos
        clients sans perdre de temps.
      </p>
    </div>

    <div>
      <div className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">
        Produit
      </div>
      <div className="space-y-3">
        {[
          ["Comment ça marche", "#how"],
          ["Métiers", "#metiers"],
          ["Démo", "#demo"],
          ["Tarifs", "#tarifs"],
        ].map(([label, href]) => (
          <a
            key={label}
            href={href}
            className="block text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            {label}
          </a>
        ))}
      </div>
    </div>

    <div>
      <div className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">
        Accès
      </div>
      <div className="space-y-3">
        {[
          ["Connexion", "/login"],
          ["Créer un compte", "/signup"],
          ["FAQ", "#faq"],
        ].map(([label, href]) => (
          <a
            key={label}
            href={href}
            className="block text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            {label}
          </a>
        ))}
      </div>
    </div>

    <div>
      <div className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">
        Légal
      </div>
      <div className="space-y-3">
        {[
          ["Mentions légales", "/mentions-legales"],
          ["CGU", "/cgu"],
          ["CGV", "/cgv"],
          ["Confidentialité", "/confidentialite"],
        ].map(([label, href]) => (
          <a
            key={label}
            href={href}
            className="block text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  </div>

  <div className="mx-auto max-w-6xl border-t border-[#E2E8F0] pt-8 text-center text-xs font-semibold text-slate-400">
    © 2026 Progressive Pulse • Suivi client structuré
  </div>
</footer>
    </main>
  );
}