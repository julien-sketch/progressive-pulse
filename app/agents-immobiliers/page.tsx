"use client";

import { useState } from "react";
import {
  Building2,
  EyeOff,
  PhoneCall,
  Timer,
  Home,
  FileText,
  KeyRound,
  Users,
} from "lucide-react";

function InteractiveDemo() {
  const [step, setStep] = useState<"create" | "link" | "client">("create");
  const [clientName, setClientName] = useState("");
  const [dossierName, setDossierName] = useState("");
  const [link, setLink] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const dossierSteps = [
    "Mandat signé",
    "Shooting photo réalisé",
    "Annonce publiée",
    "Visites en cours",
    "Offre reçue",
    "Compromis signé",
    "Acte authentique signé",
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
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex justify-center">
        <div className="inline-flex gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {[
            { id: "create", label: "1. Créer" },
            { id: "link", label: "2. Partager" },
            { id: "client", label: "3. Vue client" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStep(tab.id as "create" | "link" | "client")}
              className={`rounded-xl px-5 py-2.5 text-xs font-extrabold transition-all ${
                step === tab.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-amber-400" />
          <span className="size-3 rounded-full bg-green-400" />
          <span className="mx-auto text-xs font-semibold text-slate-400">
            {step === "client"
              ? link || "suivi.progressivepulse.app/vente-appartement-chambery"
              : "dashboard.progressivepulse.app"}
          </span>
        </div>

        <div className="flex min-h-[360px] flex-col justify-center p-8 md:p-10">
          {step === "create" && (
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-8 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Côté agent immobilier
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Créez un suivi client en quelques secondes
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Nom du client. Nom du bien. Lien généré.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    placeholder="ex : Sophie Martin"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Bien / dossier
                  </label>
                  <input
                    type="text"
                    placeholder="ex : Vente appartement Chambéry"
                    value={dossierName}
                    onChange={(e) => setDossierName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!clientName || !dossierName}
                  className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
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
              <h3 className="mb-1 text-xl font-extrabold text-slate-900">
                Lien prêt à être envoyé
              </h3>
              <p className="mb-6 text-sm font-semibold text-slate-500">
                Email, SMS, WhatsApp. Votre client ouvre le lien sans créer de
                compte.
              </p>

              <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Dossier créé
                </div>
                <div className="mb-1 text-sm font-extrabold text-slate-900">
                  {dossierName || "Vente appartement Chambéry"}
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  Client : {clientName || "Sophie Martin"}
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex-1 truncate text-left text-xs font-semibold text-slate-500">
                  {link}
                </div>
                <button className="flex-shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-slate-800">
                  Copier
                </button>
              </div>

              <button
                onClick={() => setStep("client")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                Voir ce que voit votre client →
              </button>
            </div>
          )}

          {step === "client" && (
            <div className="mx-auto w-full max-w-md">
              <div className="mb-6 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-600">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                  Vue client — sans compte ni mot de passe
                </span>
              </div>

              <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">
                      {dossierName || "Vente appartement Chambéry"}
                    </div>
                    <div className="mt-0.5 text-xs font-semibold text-slate-400">
                      Client : {clientName || "Sophie Martin"}
                    </div>
                  </div>
                  <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-extrabold text-white">
                    En cours
                  </div>
                </div>

                <div className="mb-5">
                  <div className="mb-2 flex justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Progression
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all duration-700"
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
                          ? "border border-slate-300 bg-white"
                          : "border border-slate-200 bg-white"
                      }`}
                    >
                      <div
                        className={`flex size-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${
                          i < activeStep
                            ? "bg-slate-900 text-white"
                            : i === activeStep
                            ? "border-2 border-slate-700 bg-slate-100 text-slate-900"
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
                            ? "font-extrabold text-slate-900"
                            : "text-slate-300"
                        }`}
                      >
                        {s}
                      </span>

                      {i === activeStep && (
                        <span className="ml-auto text-[10px] font-extrabold text-slate-500">
                          En cours
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {activeStep < dossierSteps.length - 1 ? (
                  <button
                    onClick={handleAdvance}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-900 transition hover:bg-slate-50"
                  >
                    ↗ Simuler une mise à jour côté agent
                  </button>
                ) : (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">
                    <span className="text-xs font-extrabold text-emerald-600">
                      🎉 Vente finalisée
                    </span>
                  </div>
                )}
              </div>

              <p className="text-center text-xs font-semibold text-slate-400">
                Une visibilité simple qui rassure votre client sans vous faire
                perdre du temps.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const problems = [
  {
    title: "Les clients demandent où en est leur vente",
    desc: "Pas parce qu’ils sont compliqués. Parce qu’ils n’ont aucune visibilité entre le mandat et l’acte.",
  },
  {
    title: "Le silence crée du stress et de la méfiance",
    desc: "Quand le client ne voit rien, il imagine une vente qui stagne, des visites qui n’avancent pas ou un suivi trop léger.",
  },
  {
    title: "Les relances cassent vos journées",
    desc: "Chaque appel ou message “des nouvelles ?” vous coupe dans vos rendez-vous, vos visites et vos vraies priorités.",
  },
  {
    title: "Vous pouvez être très bon sans paraître structuré",
    desc: "Sans suivi visible, un mandataire donne moins de confiance qu’une structure qui paraît mieux organisée.",
  },
];

const problemIcons = [PhoneCall, EyeOff, Timer, Building2];

const benefits = [
  {
    icon: "🏠",
    title: "Le client voit où en est la vente",
    desc: "Mandat, annonce, visites, offre, compromis, acte : chaque étape devient visible.",
  },
  {
    icon: "🔓",
    title: "Aucun compte à créer",
    desc: "Vous envoyez un lien. Le client ouvre. C’est tout. Aucune friction inutile.",
  },
  {
    icon: "📉",
    title: "Moins d’appels de suivi",
    desc: "Vous réduisez les relances de statut et gardez du temps pour le terrain.",
  },
  {
    icon: "✨",
    title: "Une image plus solide face au client",
    desc: "Vous paraissez plus structuré, plus clair, plus professionnel, sans complexifier votre quotidien.",
  },
];

const jobs = [
  {
    num: "01",
    title: "Créer",
    desc: "Vous créez un dossier de vente en quelques secondes.",
  },
  {
    num: "02",
    title: "Partager",
    desc: "Vous envoyez un lien unique à votre client par mail, SMS ou WhatsApp.",
  },
  {
    num: "03",
    title: "Rassurer",
    desc: "Le client suit l’avancement sans vous appeler à chaque étape.",
  },
];

const useCases = [
  {
    icon: Home,
    title: "Mandat signé",
    desc: "Le client sait que le dossier est bien lancé dès le départ.",
  },
  {
    icon: FileText,
    title: "Annonce & visites",
    desc: "Vous rendez visibles les avancées qui comptent vraiment pour votre client.",
  },
  {
    icon: Users,
    title: "Offre & compromis",
    desc: "Le client voit que le dossier progresse vers une vraie issue.",
  },
  {
    icon: KeyRound,
    title: "Acte authentique",
    desc: "Vous terminez avec une expérience claire du début à la signature finale.",
  },
];

const faqs = [
  {
    q: "Le client doit-il créer un compte ?",
    a: "Non. Vous lui envoyez un lien unique, il consulte l’avancement immédiatement, sans inscription ni mot de passe.",
  },
  {
    q: "À quoi sert Progressive Pulse pour un agent immobilier ?",
    a: "À rendre la vente plus lisible côté client. Vous montrez où en est le dossier sans devoir répondre sans arrêt aux mêmes demandes de nouvelles.",
  },
  {
    q: "En combien de temps je peux créer un dossier ?",
    a: "En quelques secondes. Vous renseignez le nom du client, le bien ou le dossier, puis le lien est prêt à être envoyé.",
  },
  {
    q: "Quelles étapes puis-je afficher ?",
    a: "Par exemple : mandat signé, shooting photo, annonce publiée, visites en cours, offre reçue, compromis signé, acte authentique signé.",
  },
  {
    q: "Pourquoi ne pas simplement envoyer des SMS au client ?",
    a: "Parce qu’un SMS se perd, se répète et ne donne aucune vue d’ensemble. Ici, le client a un point d’accès clair, à jour et toujours disponible.",
  },
  {
    q: "Est-ce adapté à un mandataire indépendant ?",
    a: "Oui. C’est même là que l’impact est fort. Vous donnez une image plus structurée sans mettre en place une usine à gaz.",
  },
  {
    q: "Les crédits expirent-ils ?",
    a: "Non. Vous achetez des crédits et vous les utilisez quand vous avez de vrais dossiers à suivre.",
  },
  {
    q: "Y a-t-il un abonnement mensuel ?",
    a: "Non. Vous payez uniquement lorsque vous avez besoin de créer des dossiers.",
  },
];

export default function AgentsImmobiliersPage() {
  return (
    <main className="landing-page min-h-screen bg-white text-slate-900">
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        <div className="absolute -top-48 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(15,23,42,0.12),transparent_60%)] opacity-30 blur-3xl" />
        <div className="absolute -left-40 top-1/2 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.14),transparent_60%)] opacity-25 blur-3xl" />
      </div>

      <div className="bg-slate-900 px-4 py-2.5 text-center text-xs font-extrabold tracking-wide text-white">
        🎁 Créez votre compte et testez Progressive Pulse avec 1 dossier offert
        — sans carte bancaire
      </div>

      <header className="sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white/88 backdrop-blur-md">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 font-extrabold text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)]">
                  P
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-extrabold tracking-tight">
                    Progressive Pulse
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Suivi client pour agents immobiliers
                  </div>
                </div>
              </div>

              <nav className="hidden items-center gap-6 md:flex">
                {[
                  ["Comment ça marche", "#how"],
                  ["Démo", "#demo"],
                  ["Cas d’usage", "#cas-usage"],
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
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5"
                >
                  🎁 1 dossier offert à l’inscription
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="landing-hero flex min-h-[86vh] items-center justify-center px-6 pb-24 pt-14">
        <div className="w-full max-w-6xl">
          <div className="grid items-center gap-20 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Suivi client sans compte à créer
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] md:text-[56px]">
                Vos clients savent
                <br />
                où en est leur vente.
                <br />
                <span className="text-slate-500">Sans vous relancer.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-500">
                Progressive Pulse permet aux agents immobiliers et mandataires
                de partager un suivi de vente clair à leurs clients via un
                simple lien. Aucun compte client à créer. 1 dossier offert à
                l’inscription.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/signup"
                  className="rounded-2xl bg-slate-900 px-8 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5"
                >
                  🎁 Créer mon compte — 1 dossier offert
                </a>
                <a
                  href="#demo"
                  className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
                >
                  Voir la démo
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                {[
                  "Aucun compte client requis",
                  "Aucun abonnement",
                  "Crédits sans expiration",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"
                  >
                    <span className="text-emerald-500">✓</span>
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold text-slate-900">
                  Le vrai sujet n’est pas juste de suivre une vente.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  Le vrai sujet, c’est de donner au client une visibilité claire
                  entre le mandat et l’acte, sans lui imposer un compte, un
                  outil compliqué ou des échanges répétitifs.
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-5">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      Expérience client
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      Ce que reçoit votre client
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600">
                    Sans compte
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">
                        Vente appartement Chambéry
                      </div>
                      <div className="mt-0.5 text-xs font-semibold text-slate-400">
                        Client : Sophie Martin
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-extrabold text-white">
                      En cours
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="mb-2 flex justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Avancement
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        50%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-1/2 rounded-full bg-slate-900" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {([
                      ["Mandat signé", true, false],
                      ["Shooting photo réalisé", true, false],
                      ["Annonce publiée", true, false],
                      ["Visites en cours", false, true],
                      ["Offre reçue", false, false],
                    ] as Array<[string, boolean, boolean]>).map(
                      ([label, done, current]) => (
                        <div
                          key={label}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                        >
                          <div
                            className={`flex size-6 items-center justify-center rounded-full text-[10px] font-extrabold ${
                              done
                                ? "bg-slate-900 text-white"
                                : current
                                ? "border-2 border-slate-700 bg-white text-slate-900"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {done ? "✓" : ""}
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              done
                                ? "text-slate-400 line-through"
                                : current
                                ? "font-extrabold text-slate-900"
                                : "text-slate-400"
                            }`}
                          >
                            {label}
                          </span>
                          {current && (
                            <span className="ml-auto text-[10px] font-extrabold text-slate-500">
                              En cours
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <p className="mt-4 text-center text-xs font-semibold text-slate-400">
                  Clair pour le client. Léger pour vous.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section border-y border-slate-200 bg-white px-6 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { num: "0 compte", label: "côté client" },
            { num: "1 lien", label: "à envoyer" },
            { num: "10 sec", label: "pour démarrer" },
            { num: "1 dossier offert", label: "à l’inscription" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">
                {stat.num}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-500">
                Le vrai problème
              </span>
            </div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Quand le client ne voit rien,
              <br />
              il relance.
            </h2>
            <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-slate-500">
              Entre le mandat, les visites, les offres et le compromis, le
              manque de visibilité crée du stress, des appels inutiles et une
              perception floue de votre suivi.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {problems.map((item, index) => {
              const Icon = problemIcons[index];

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)]"
                >
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <Icon className="size-5 stroke-[1.9]" />
                  </div>
                  <div className="mb-1 text-sm font-extrabold text-slate-900">
                    {item.title}
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white px-8 py-5 text-center shadow-sm">
              <p className="text-sm font-extrabold text-slate-900">
                Progressive Pulse ne sert pas juste à suivre une vente.
              </p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500">
                Il sert à rendre votre suivi visible pour le client, sans lui
                imposer un outil compliqué.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="landing-section bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Comment ça marche
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              3 étapes pour rendre vos ventes lisibles
              <br />
              côté client.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {jobs.map((item) => (
              <div
                key={item.num}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 shadow-[0_4px_24px_rgba(15,23,42,0.04)]"
              >
                <div className="absolute bottom-2 right-3 select-none text-[80px] font-extrabold leading-none text-slate-100">
                  {item.num}
                </div>
                <div className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  {item.num}
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm font-semibold leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Pourquoi c’est différent
                </span>
              </div>
              <h2 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Pas un CRM de plus.
                <br />
                <span className="text-slate-400">
                  Un outil de clarté côté client.
                </span>
              </h2>
              <p className="mb-8 font-semibold leading-relaxed text-slate-500">
                Les outils classiques gèrent votre activité en interne.
                Progressive Pulse rend le suivi compréhensible pour votre
                client, ce qui améliore directement sa perception de votre
                sérieux.
              </p>

              <div className="space-y-5">
                {benefits.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900/5 text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <div className="mb-0.5 text-sm font-extrabold text-slate-900">
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

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
              <div className="mb-6 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Ce que vous gagnez vraiment
              </div>
              <div className="space-y-4">
                {[
                  {
                    label: "Moins d’appels “où en est la vente ?”",
                    value: "Moins de friction",
                  },
                  {
                    label: "Un client plus rassuré",
                    value: "Plus de confiance",
                  },
                  {
                    label: "Une image plus solide",
                    value: "Plus pro",
                  },
                  {
                    label: "Un suivi visible sans lourdeur",
                    value: "Plus simple",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="flex-1 text-sm font-semibold text-slate-600">
                      {item.label}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold italic leading-relaxed text-slate-700">
                  “Vous ne vendez pas juste un suivi. Vous rassurez le client
                  sans perdre votre journée à répondre aux mêmes questions.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="landing-section bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Démo en direct
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Voyez exactement ce que voit votre client.
            </h2>
            <p className="mt-4 font-semibold leading-relaxed text-slate-500">
              Créez un dossier, générez un lien, visualisez une expérience
              client simple, lisible et adaptée à la vente immobilière.
            </p>
          </div>

          <InteractiveDemo />
        </div>
      </section>

      <section id="cas-usage" className="landing-section bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Cas d’usage
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Une vraie visibilité sur les étapes
              <br />
              qui comptent pour le client.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)]"
                >
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <Icon className="size-5 stroke-[1.9]" />
                  </div>
                  <h3 className="mb-2 text-base font-extrabold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="landing-section bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                Rentabilité
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Une vente à plusieurs milliers d’euros
              <br />
              mérite mieux que des relances floues.
            </h2>
            <p className="mt-4 font-semibold leading-relaxed text-slate-500">
              Progressive Pulse coûte presque rien face à la valeur d’un mandat
              mené jusqu’au compromis puis à l’acte authentique.
            </p>
          </div>

          <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
            <p className="text-lg font-extrabold text-slate-900">
              Vos clients suivent déjà leurs colis en temps réel.
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">
              Leur vente immobilière mérite au moins le même niveau de
              visibilité.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {[
                    "Type de dossier",
                    "Commission moyenne",
                    "Coût du suivi",
                    "Impact",
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
                    m: "Mandat simple",
                    g: "3 000€ – 8 000€",
                    c: "19€",
                    r: "Très faible",
                  },
                  {
                    m: "Mandat exclusif",
                    g: "5 000€ – 15 000€",
                    c: "19€",
                    r: "Quasi négligeable",
                  },
                  {
                    m: "Portefeuille récurrent",
                    g: "Variable",
                    c: "69€ / 5 dossiers",
                    r: "Très rentable",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.m}
                    className={`border-b border-slate-200 transition hover:bg-slate-50 ${
                      i % 2 !== 0 ? "bg-[#FAFBFC]" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-extrabold text-slate-900">
                      {row.m}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                      {row.g}
                    </td>
                    <td className="px-6 py-4 text-sm font-extrabold text-slate-900">
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
            “À 19€, ce n’est pas une dépense.
            <span className="font-extrabold not-italic text-slate-900">
              {" "}
              C’est un amortisseur de friction.
            </span>
            ”
          </p>
        </div>
      </section>

      <section id="tarifs" className="landing-section bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Tarifs
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Vous payez uniquement
              <br />
              quand vous avez des ventes à suivre.
            </h2>
            <p className="mt-4 font-semibold leading-relaxed text-slate-500">
              Pas d’abonnement inutile. Des crédits simples. Sans expiration.
            </p>
          </div>

          <div className="grid items-start gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
              <div className="mb-1 text-sm font-extrabold text-slate-900">
                Découverte
              </div>
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-600 ring-1 ring-amber-100">
                🎁 1 dossier offert à l’inscription
              </div>
              <div className="mb-1 text-5xl font-extrabold tracking-tight text-slate-900">
                0€
              </div>
              <div className="mb-1 text-sm font-semibold text-slate-400">
                Sans carte bancaire
              </div>
              <div className="mb-6 text-xs font-semibold text-slate-500">
                Pour tester sur une vraie vente
              </div>
              <div className="mb-0.5 text-2xl font-extrabold text-slate-900">
                1 dossier
              </div>
              <div className="mb-6 text-sm font-semibold text-slate-400">
                inclus à la création du compte
              </div>
              <div className="mb-6 h-px bg-slate-200" />
              <ul className="mb-8 space-y-3 text-sm font-semibold text-slate-600">
                {[
                  "Lien client partageable",
                  "Barre de progression",
                  "Accès sans compte client",
                  "Prise en main immédiate",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-slate-900" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-extrabold text-slate-800 transition hover:bg-slate-100"
              >
                🎁 Créer mon compte — 1 dossier offert
              </a>
            </div>

            <div className="relative rounded-3xl border border-slate-300 bg-slate-100/60 p-1 shadow-[0_28px_80px_rgba(15,23,42,0.10)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                Recommandé
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-7">
                <div className="mb-1 text-sm font-extrabold text-slate-900">
                  Pro
                </div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600 ring-1 ring-emerald-100">
                  Économisez 31%
                </div>
                <div className="mb-1 flex items-end gap-1.5">
                  <div className="text-5xl font-extrabold tracking-tight text-slate-900">
                    69€
                  </div>
                  <div className="pb-2 text-sm font-extrabold text-slate-500">
                    HT
                  </div>
                </div>
                <div className="mb-6 text-xs font-semibold text-slate-500">
                  13,80€ par dossier
                </div>
                <div className="mb-0.5 text-2xl font-extrabold text-slate-900">
                  5 dossiers
                </div>
                <div className="mb-6 text-sm font-semibold text-slate-400">
                  Crédits sans expiration
                </div>
                <div className="mb-6 h-px bg-slate-200" />
                <ul className="mb-8 space-y-3 text-sm font-semibold text-slate-600">
                  {[
                    "Tout du pack Découverte",
                    "Mises à jour illimitées",
                    "Suivi client plus fluide",
                    "Usage simple au quotidien",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-slate-900" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5"
                >
                  Réserver mes crédits →
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
              <div className="mb-1 text-sm font-extrabold text-slate-900">
                Business
              </div>
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600 ring-1 ring-emerald-100">
                Économisez 48%
              </div>
              <div className="mb-1 flex items-end gap-1.5">
                <div className="text-5xl font-extrabold tracking-tight text-slate-900">
                  149€
                </div>
                <div className="pb-2 text-sm font-extrabold text-slate-500">
                  HT
                </div>
              </div>
              <div className="mb-6 text-xs font-semibold text-slate-500">
                9,93€ par dossier
              </div>
              <div className="mb-0.5 text-2xl font-extrabold text-slate-900">
                15 dossiers
              </div>
              <div className="mb-6 text-sm font-semibold text-slate-400">
                Crédits sans expiration
              </div>
              <div className="mb-6 h-px bg-slate-200" />
              <ul className="mb-8 space-y-3 text-sm font-semibold text-slate-600">
                {[
                  "Tout du pack Pro",
                  "Volume plus rentable",
                  "Utilisation souple",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-slate-900" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-6 py-4 text-sm font-extrabold text-slate-900 transition hover:bg-slate-50"
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
              "🚫 Zéro abonnement",
            ].map((item) => (
              <span key={item} className="text-sm font-semibold text-slate-400">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="landing-section bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-16 md:grid-cols-[1fr_0.85fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                FAQ
              </span>
            </div>
            <h2 className="mb-10 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Les questions que les agents
              <br />
              vont se poser.
            </h2>

            <div className="space-y-3">
              {faqs.map((item, i) => (
                <details
                  key={i}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-sm font-extrabold text-slate-900 transition hover:bg-slate-50">
                    {item.q}
                    <span className="ml-4 flex-shrink-0 text-slate-300 transition-transform group-open:rotate-180 group-open:text-slate-500">
                      ▼
                    </span>
                  </summary>
                  <div className="border-t border-slate-200 px-6 pb-5 pt-4 text-sm font-semibold leading-relaxed text-slate-500">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900">
              1 dossier offert.
              <br />
              Aucune carte requise.
            </div>
            <p className="mb-7 text-sm font-semibold leading-relaxed text-slate-600">
              Testez Progressive Pulse sur une vraie vente et voyez si vos
              clients comprennent enfin où en est leur dossier sans vous
              relancer.
            </p>
            <a
              href="/signup"
              className="mb-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5"
            >
              🎁 Tester avec 1 dossier offert
            </a>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {["Sans CB", "Aucun abonnement", "Sans compte client"].map(
                (item) => (
                  <span
                    key={item}
                    className="text-xs font-semibold text-slate-500"
                  >
                    ✓ {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section bg-slate-900 px-6 py-28 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Faites comprendre à vos clients
            <br />
            que leur vente avance.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-semibold leading-relaxed text-slate-300">
            Un lien. Une progression claire. Moins de relances. Plus de
            confiance. Commencez gratuitement avec 1 dossier offert à
            l’inscription.
          </p>
          <div className="mb-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className="rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-slate-900 transition hover:bg-slate-100"
            >
              🎁 Créer mon compte — 1 dossier offert
            </a>
            <a
              href="#demo"
              className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-extrabold text-white transition hover:bg-white/10"
            >
              Voir la démo
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              "1 dossier offert sans CB",
              "Aucun abonnement",
              "Aucun compte client requis",
            ].map((item) => (
              <span key={item} className="text-xs font-semibold opacity-80">
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#F8FAFC] px-6 py-16">
        <div className="mx-auto mb-12 grid max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
                P
              </div>
              <span className="text-sm font-extrabold">Progressive Pulse</span>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-slate-500">
              Le suivi client partageable, pensé pour la relation entre l’agent
              immobilier et son client.
            </p>
          </div>

          <div>
            <div className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Produit
            </div>
            <div className="space-y-3">
              {[
                ["Comment ça marche", "#how"],
                ["Démo", "#demo"],
                ["Cas d’usage", "#cas-usage"],
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
                ["Cookies", "/cookies"],
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

        <div className="mx-auto max-w-6xl border-t border-slate-200 pt-8 text-center text-xs font-semibold text-slate-400">
          © 2026 Progressive Pulse • La transparence client comme standard
          professionnel
        </div>
      </footer>
    </main>
  );
}