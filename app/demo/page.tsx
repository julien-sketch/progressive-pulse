"use client";

import React, { useMemo, useState } from "react";
import {
  FileUp,
  MessageCircle,
  CheckCircle2,
  Loader2,
  Phone,
  Check,
  Hourglass,
  Lock,
  Home,
} from "lucide-react";

type StatusDef = { label: string; percent: number };

const STATUS_BY_TYPE: Record<string, StatusDef[]> = {
  immo: [
    { label: "Mandat signé", percent: 10 },
    { label: "Documents reçus", percent: 25 },
    { label: "Dossier complet", percent: 35 },
    { label: "Visites en cours", percent: 50 },
    { label: "Offre acceptée", percent: 70 },
    { label: "Compromis signé", percent: 80 },
    { label: "Acte signé", percent: 100 },
  ],
  of: [
    { label: "Documents reçus", percent: 0 },
    { label: "Dossier complet", percent: 15 },
    { label: "Dépôt effectué", percent: 30 },
    { label: "En attente de validation", percent: 45 },
    { label: "Demande acceptée", percent: 65 },
    { label: "Financement reçu", percent: 100 },
  ],
};

function clampPct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function DemoPage() {
  const [projectType] = useState<"immo" | "of">("of");
  const [currentIndex, setCurrentIndex] = useState(3);

  const statuses = STATUS_BY_TYPE[projectType];
  const currentStatus = statuses[currentIndex];
  const pct = clampPct(currentStatus.percent);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-white/70 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider ring-1 ring-indigo-100">
            Progressive Pulse — DEMO
          </div>
          <h1 className="mt-3 text-xl font-extrabold tracking-tight">
            Suivi de dossier
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full pb-32 p-4">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow p-6 mb-6">
          <h2 className="text-2xl font-extrabold mb-1">
            {currentStatus.label}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Suivi de dossier • Jean Dupont
          </p>

          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Progression {pct}%
          </p>
        </div>

        {/* Timeline interactive */}
        <div className="space-y-4">
          {statuses.map((s, idx) => {
            const done = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                {done ? (
                  <div className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check size={16} />
                  </div>
                ) : (
                  <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <Lock size={16} />
                  </div>
                )}

                <span
                  className={
                    isCurrent
                      ? "font-extrabold text-indigo-700"
                      : done
                      ? "font-semibold"
                      : "text-slate-400"
                  }
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => alert("Upload demo")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-2xl font-bold"
          >
            <FileUp size={18} />
            Ajouter document
          </button>

          <button
            onClick={() => alert("Appel demo")}
            className="flex items-center gap-2 border px-4 py-3 rounded-2xl font-bold"
          >
            <Phone size={18} />
            Appeler
          </button>

          <button
            onClick={() => alert("Mail demo")}
            className="flex items-center gap-2 border px-4 py-3 rounded-2xl font-bold"
          >
            <MessageCircle size={18} />
            Email
          </button>
        </div>
      </main>
    </div>
  );
}