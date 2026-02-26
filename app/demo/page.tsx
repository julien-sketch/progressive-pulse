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
  { id: 1, label: "Dossier reçu", desc: "Documents bien reçus", percent: 10 },
  { id: 2, label: "Vérification des pièces", desc: "Contrôle des documents", percent: 35 },
  { id: 3, label: "Analyse de solvabilité", desc: "Étude par le service crédit", percent: 65 },
  { id: 4, label: "Décision finale", desc: "Validation / finalisation", percent: 100 },
];

function clampPct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function DemoPage() {
  const [currentStepId, setCurrentStepId] = useState<number>(3);

  const current = useMemo(() => {
    const s = DEMO_STEPS.find((x) => x.id === currentStepId) ?? DEMO_STEPS[0];
    return s;
  }, [currentStepId]);

  const pct = clampPct(current.percent);
  const completedCount = useMemo(
    () => DEMO_STEPS.filter((s) => s.id < currentStepId).length,
    [currentStepId]
  );
  const totalCount = DEMO_STEPS.length;

  const goPrev = () => setCurrentStepId((x) => Math.max(1, x - 1));
  const goNext = () => setCurrentStepId((x) => Math.min(DEMO_STEPS.length, x + 1));

  return (
    <div className="min-h-screen bg-[#f8f7f6] text-slate-900">
      <header className="border-b border-[#e77e23]/10 bg-[#f8f7f6]">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <div className="inline-block px-2 py-1 rounded-md bg-[#e77e23]/10 text-[#e77e23] text-xs font-extrabold uppercase tracking-wider">
            Démo Progressive Pulse
          </div>
          <h1 className="mt-3 text-xl font-extrabold tracking-tight">Suivi de dossier</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Clique sur les étapes pour voir la progression changer.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-24">
        <section className="mt-6 rounded-3xl border border-[#e77e23]/10 bg-white shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-2 py-1 rounded-md bg-[#e77e23]/10 text-[#e77e23] text-xs font-extrabold uppercase tracking-wider">
                  Statut actuel
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight">{current.label}</h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">{current.desc}</p>
              </div>

              <div className="text-right">
                <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  Progression
                </div>
                <div className="mt-1 text-2xl font-extrabold text-[#e77e23]">{pct}%</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">
                  Étape {currentStepId} / {totalCount}
                </div>
              </div>
            </div>

            <div className="mt-6 h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e77e23] rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              <span>Début</span>
              <span className="text-[#e77e23]">
                {pct}% ({completedCount}/{totalCount})
              </span>
              <span>Fin</span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={goPrev}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold hover:bg-slate-50 transition"
              >
                Étape précédente
              </button>
              <button
                onClick={goNext}
                className="flex-1 rounded-2xl bg-[#e77e23] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#e77e23]/90 transition"
              >
                Étape suivante
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-extrabold">Étapes du dossier</h3>

          <div className="mt-5 space-y-0 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {DEMO_STEPS.map((s) => {
              const done = s.id < currentStepId;
              const isCurrent = s.id === currentStepId;
              const locked = s.id > currentStepId;

              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStepId(s.id)}
                  className="relative w-full text-left"
                  type="button"
                >
                  <div className="relative flex gap-4 pb-8 items-start">
                    <div
                      className={[
                        "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm transition",
                        done ? "bg-[#e77e23] text-white" : "",
                        isCurrent ? "bg-white border-4 border-[#e77e23] text-[#e77e23]" : "",
                        locked ? "bg-slate-100 border-2 border-slate-200 text-slate-400" : "",
                      ].join(" ")}
                    >
                      {done ? (
                        <Check className="size-5" />
                      ) : isCurrent ? (
                        <Hourglass className="size-5 animate-pulse" />
                      ) : (
                        <Lock className="size-5" />
                      )}
                    </div>

                    <div className="flex flex-col pt-1">
                      <div
                        className={
                          isCurrent
                            ? "font-extrabold text-[#e77e23]"
                            : done
                            ? "font-extrabold"
                            : "font-extrabold text-slate-400"
                        }
                      >
                        {s.label}
                      </div>
                      <div
                        className={
                          isCurrent
                            ? "text-sm font-semibold text-slate-600"
                            : done
                            ? "text-sm font-semibold text-slate-500"
                            : "text-sm font-semibold text-slate-400"
                        }
                      >
                        {isCurrent ? s.desc : done ? "Validé" : "En attente"}
                      </div>
                    </div>

                    <div className="ml-auto pt-1">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold border",
                          done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "",
                          isCurrent ? "bg-[#e77e23]/10 text-[#e77e23] border-[#e77e23]/20" : "",
                          locked ? "bg-white text-slate-400 border-slate-200" : "",
                        ].join(" ")}
                      >
                        {done ? "OK" : isCurrent ? "EN COURS" : "LOCK"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-2">
          <div className="rounded-3xl border border-[#e77e23]/10 bg-white shadow-sm p-6">
            <div className="mt-1 flex items-center gap-4">
              <button
                type="button"
                onClick={() => alert("Démo : l’upload est désactivé ici.")}
                className="flex-1 flex items-center justify-center gap-2 font-extrabold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] bg-[#e77e23] hover:bg-[#e77e23]/90 text-white"
              >
                <FileUp className="size-5" />
                <span className="text-sm">Ajouter un document</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Démo : mail")}
                className="flex size-14 items-center justify-center rounded-full bg-white border border-[#e77e23]/20 shadow-sm hover:bg-[#e77e23]/10 transition"
                aria-label="Contacter par mail"
              >
                <Mail className="size-5 text-[#e77e23]" />
              </button>

              <button
                type="button"
                onClick={() => alert("Démo : téléphone")}
                className="flex size-14 items-center justify-center rounded-full bg-white border border-[#e77e23]/20 shadow-sm hover:bg-[#e77e23]/10 transition"
                aria-label="Contacter par téléphone"
              >
                <Phone className="size-5 text-[#e77e23]" />
              </button>
            </div>
          </div>
        </section>

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