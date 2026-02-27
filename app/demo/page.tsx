"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, Check, Hourglass, Lock, FileUp } from "lucide-react";

type Step = {
  id: number;
  label: string;
  desc?: string;
  percent: number;
};

const DEMO_STEPS: Step[] = [
  { id: 1, label: "Documents reçus", desc: "Vos pièces ont bien été reçues.", percent: 0 },
  { id: 2, label: "Dossier complet", desc: "Vérification des pièces en cours.", percent: 15 },
  { id: 3, label: "Dépôt effectué", desc: "Dépôt réalisé auprès de l’organisme.", percent: 30 },
  { id: 4, label: "En attente de validation", desc: "Contrôle et validation en cours.", percent: 45 },
  { id: 5, label: "Demande acceptée", desc: "Votre demande a été acceptée.", percent: 65 },
  { id: 6, label: "Fin de formation transmise", desc: "Les justificatifs de fin ont été envoyés.", percent: 80 },
  { id: 7, label: "Remboursement en cours", desc: "Traitement du paiement en cours.", percent: 90 },
  { id: 8, label: "Paiement validé", desc: "Paiement confirmé. Dossier terminé.", percent: 100 },
];

function clampPct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function DemoPage() {
  // Par défaut : étape 4 (ça donne “en cours”)
  const [currentStepId, setCurrentStepId] = useState<number>(4);

  const current = useMemo(() => {
    return DEMO_STEPS.find((x) => x.id === currentStepId) ?? DEMO_STEPS[0];
  }, [currentStepId]);

  const pct = clampPct(current.percent);

  const completedCount = useMemo(() => DEMO_STEPS.filter((s) => s.id < currentStepId).length, [currentStepId]);
  const totalCount = DEMO_STEPS.length;

  const goPrev = () => setCurrentStepId((x) => Math.max(1, x - 1));
  const goNext = () => setCurrentStepId((x) => Math.min(DEMO_STEPS.length, x + 1));

  const isFinished = currentStepId === DEMO_STEPS.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Subtle background glow (même style que ta landing) */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-3xl opacity-35 bg-[radial-gradient(circle,rgba(79,70,229,0.18),transparent_60%)]" />
        <div className="absolute top-24 -left-44 h-[460px] w-[460px] rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle,rgba(13,148,136,0.12),transparent_60%)]" />
        <div className="absolute -bottom-60 right-[-120px] h-[560px] w-[560px] rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle,rgba(124,58,237,0.12),transparent_60%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20">
        <div className="mx-auto max-w-2xl px-6 pt-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white/70 backdrop-blur-md shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="px-5 py-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 shadow-sm">
                <span className="size-2 rounded-full bg-indigo-600" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  Démo Progressive Pulse
                </span>
              </div>
              <h1 className="mt-3 text-lg font-extrabold tracking-tight">Suivi de dossier</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Clique sur une étape : statut + progression changent instantanément.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-24">
        {/* Status card */}
        <section className="mt-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 ring-1 ring-indigo-100">
                  {isFinished ? (
                    <>
                      <span className="size-2 rounded-full bg-emerald-500" />
                      Terminé
                    </>
                  ) : (
                    <>
                      <span className="size-2 rounded-full bg-indigo-600" />
                      En cours
                    </>
                  )}
                </span>

                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                  {current.label}
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-600">{current.desc}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  Progression
                </div>
                <div className="mt-1 text-3xl font-extrabold text-indigo-700 tabular-nums">
                  {pct}%
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-500">
                  Étape {currentStepId} / {totalCount}
                </div>
              </div>
            </div>

            <div className="mt-6 h-2.5 w-full rounded-full bg-slate-100 ring-1 ring-[#E2E8F0] overflow-hidden">
              <div
                className="h-full rounded-full bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              <span>Début</span>
              <span className="text-indigo-700">
                {pct}% ({completedCount}/{totalCount})
              </span>
              <span>Fin</span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={goPrev}
                className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-50 transition"
              >
                Étape précédente
              </button>
              <button
                onClick={goNext}
                className="flex-1 rounded-2xl px-4 py-3 text-sm font-extrabold text-white
                           bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)]
                           shadow-[0_12px_28px_rgba(79,70,229,0.22)]
                           transition-all duration-200 ease-out
                           hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)]
                           active:translate-y-[1px]"
              >
                Étape suivante
              </button>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mt-10">
          <h3 className="text-lg font-extrabold tracking-tight">Étapes du dossier</h3>

          <div className="mt-5 space-y-0 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {DEMO_STEPS.map((s) => {
              const done = s.id < currentStepId;
              const isCurrentStep = s.id === currentStepId;
              const locked = s.id > currentStepId;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStepId(s.id)}
                  className="relative w-full text-left"
                >
                  <div className="relative flex gap-4 pb-8 items-start">
                    <div
                      className={[
                        "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm transition",
                        done ? "bg-indigo-600 text-white" : "",
                        isCurrentStep ? "bg-white border-4 border-indigo-600 text-indigo-700" : "",
                        locked ? "bg-slate-100 border-2 border-slate-200 text-slate-400" : "",
                      ].join(" ")}
                    >
                      {done ? (
                        <Check className="size-5" />
                      ) : isCurrentStep ? (
                        <Hourglass className="size-5 animate-pulse" />
                      ) : (
                        <Lock className="size-5" />
                      )}
                    </div>

                    <div className="flex flex-col pt-1 min-w-0">
                      <div
                        className={[
                          "font-extrabold truncate",
                          isCurrentStep ? "text-indigo-700" : done ? "text-slate-900" : "text-slate-400",
                        ].join(" ")}
                      >
                        {s.label}
                      </div>
                      <div
                        className={[
                          "text-sm font-semibold",
                          isCurrentStep ? "text-slate-600" : done ? "text-slate-500" : "text-slate-400",
                        ].join(" ")}
                      >
                        {isCurrentStep ? s.desc : done ? "Validé" : "En attente"}
                      </div>
                    </div>

                    <div className="ml-auto pt-1 shrink-0">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold border",
                          done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "",
                          isCurrentStep ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "",
                          locked ? "bg-white text-slate-400 border-slate-200" : "",
                        ].join(" ")}
                      >
                        {done ? "OK" : isCurrentStep ? "EN COURS" : "LOCK"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Bottom actions (upload + mail + phone) */}
        <section className="mt-2">
          <div className="rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => alert("Démo : l’upload est désactivé ici.")}
                className="flex-1 flex items-center justify-center gap-2 font-extrabold py-4 rounded-2xl
                           shadow-[0_12px_28px_rgba(79,70,229,0.18)]
                           transition-all active:scale-[0.98]
                           text-white bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)]
                           hover:brightness-[1.03]"
              >
                <FileUp className="size-5" />
                <span className="text-sm">Ajouter un document</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Démo : mail")}
                className="flex size-14 items-center justify-center rounded-full bg-white border border-[#E2E8F0]
                           shadow-sm hover:bg-slate-50 transition"
                aria-label="Contacter par mail"
              >
                <Mail className="size-5 text-indigo-700" />
              </button>

              <button
                type="button"
                onClick={() => alert("Démo : téléphone")}
                className="flex size-14 items-center justify-center rounded-full bg-white border border-[#E2E8F0]
                           shadow-sm hover:bg-slate-50 transition"
                aria-label="Contacter par téléphone"
              >
                <Phone className="size-5 text-indigo-700" />
              </button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-8 text-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-7 py-4 text-sm font-extrabold text-white hover:bg-slate-800 transition"
          >
            Passer sur mon espace Pro
          </a>
          <div className="mt-3 text-xs font-semibold text-slate-500">
            Démo : aucune donnée réelle n’est modifiée.
          </div>
        </section>
      </main>
    </div>
  );
}