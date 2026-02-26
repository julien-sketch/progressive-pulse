"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import {
  FileUp,
  MessageCircle,
  CheckCircle2,
  Loader2,
  Phone,
  ArrowLeft,
  Bell,
  Check,
  Hourglass,
  Lock,
  Home,
} from "lucide-react";

type Project = {
  client_name: string;
  progress_percent: number;
  status_text: string;
  created_at: string | null;
  updated_at: string | null;
  broker_email: string;
  broker_phone: string | null; // ✅ AJOUT
  drive_folder_url: string | null;
  access_token: string;
  project_type?: string | null;
};

type Step = {
  order_index: number;
  label: string;
  is_completed: boolean;
};

type StatusDef = { label: string; percent: number };

const STATUS_BY_TYPE: Record<string, StatusDef[]> = {
  immo: [
    { label: "Mandat non confirmé", percent: 0 },
    { label: "Mandat signé", percent: 10 },
    { label: "Documents reçus", percent: 25 },
    { label: "Dossier complet", percent: 35 },
    { label: "Visites en cours", percent: 50 },
    { label: "Offre acceptée", percent: 70 },
    { label: "Compromis signé", percent: 80 },
    { label: "Délai de rétractation", percent: 88 },
    { label: "Acte signé", percent: 100 },
  ],
  of: [
    { label: "Documents reçus", percent: 0 },
    { label: "Dossier complet", percent: 15 },
    { label: "Dépôt effectué auprès du fonds de formation", percent: 30 },
    { label: "En attente de validation", percent: 45 },
    { label: "Demande acceptée", percent: 65 },
    { label: "Documents de fin de formation transmis", percent: 80 },
    { label: "Remboursement en cours", percent: 90 },
    { label: "Paiement validé", percent: 100 },
  ],
  other: [
    { label: "Documents reçus", percent: 0 },
    { label: "Dossier complet", percent: 50 },
    { label: "Terminé", percent: 100 },
  ],
};

function clampPct(n: number | null | undefined) {
  const v = typeof n === "number" ? n : 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function normalizeType(t: string | null | undefined) {
  const v = (t ?? "").toLowerCase().trim();
  if (v === "immobilier") return "immo";
  if (v === "formation") return "of";
  if (v === "immo" || v === "of") return v;
  return "other";
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.max(0, Math.floor(diffMs / 60000));
  if (min < 2) return "à l’instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

export default function ClientTrack({ token }: { token: string }) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  void supabase;

  const [project, setProject] = useState<Project | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const run = async () => {
      const cleanToken = String(token ?? "").trim();
      const apiUrl = `/api/track/${encodeURIComponent(cleanToken)}`;

      setLoading(true);
      setNotFound(false);

      if (!cleanToken) {
        setNotFound(true);
        setProject(null);
        setSteps([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(apiUrl, { cache: "no-store" });

        if (res.status === 404) {
          setNotFound(true);
          setProject(null);
          setSteps([]);
          return;
        }

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("Track API error:", json);
          setNotFound(true);
          setProject(null);
          setSteps([]);
          return;
        }

        setProject(json.project as Project);
        setSteps((json.steps as Step[]) ?? []);
      } catch (err) {
        console.error(err);
        setNotFound(true);
        setProject(null);
        setSteps([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  const displaySteps: Step[] = useMemo(() => {
    if (!project) return [];
    if (steps && steps.length > 0) return steps;

    const type = normalizeType(project.project_type);
    const statuses = STATUS_BY_TYPE[type] ?? STATUS_BY_TYPE.other;

    let currentIdx = statuses.findIndex((s) => s.label === (project.status_text ?? ""));
    if (currentIdx < 0) {
      const p = clampPct(project.progress_percent);
      currentIdx = statuses.reduce((best, s, idx) => (s.percent <= p ? idx : best), 0);
    }

    return statuses.map((s, idx) => ({
      order_index: idx + 1,
      label: s.label,
      is_completed: idx <= currentIdx,
    }));
  }, [project, steps]);

  const completedCount = displaySteps.filter((s) => s.is_completed).length;
  const totalCount = displaySteps.length || 0;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`/api/d/${encodeURIComponent(project.access_token)}/upload`, {
        method: "POST",
        body: fd,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Upload failed");

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err?.message ?? "Erreur lors de l'envoi");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const lastUpdate = project?.updated_at || project?.created_at || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex flex-col items-center justify-center px-6">
        <Loader2 className="h-8 w-8 animate-spin text-[#e77e23]" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Récupération de votre dossier…</p>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e77e23]/10 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Lien invalide</h1>
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Ce dossier n’existe pas ou n’est plus accessible.
          </p>
        </div>
      </div>
    );
  }

  const pct = clampPct(project.progress_percent);
  const phone = (project.broker_phone ?? "").trim();
  const phoneHref = phone ? `tel:${encodeURIComponent(normalizePhone(phone))}` : null;

  // Déduire "current" pour le style timeline à partir du premier non terminé (sans changer la logique métier)
  const currentIndex =
    displaySteps.findIndex((s) => !s.is_completed) === -1
      ? Math.max(0, displaySteps.length - 1)
      : Math.max(0, displaySteps.findIndex((s) => !s.is_completed) - 1);

  return (
    <div className="min-h-screen bg-[#f8f7f6] text-slate-900 flex flex-col">
      {/* Header sticky (comme ton design) */}
      <header className="border-b border-[#e77e23]/10 bg-[#f8f7f6]">
  <div className="max-w-2xl mx-auto px-4 py-6 text-center">
    <div className="inline-block px-2 py-1 rounded-md bg-[#e77e23]/10 text-[#e77e23] text-xs font-extrabold uppercase tracking-wider">
      Pro-Pulse
    </div>
    <h1 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">
      Suivi de dossier
    </h1>
  </div>
</header>

      <main className="flex-1 max-w-2xl mx-auto w-full pb-32">
        {/* Status Card */}
        <div className="p-4">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-[#e77e23]/5">
            

            <div className="flex flex-col p-5 gap-4">
              <div>
                <span className="inline-block px-2 py-1 rounded-md bg-[#e77e23]/10 text-[#e77e23] text-xs font-extrabold uppercase tracking-wider mb-2">
                  Statut actuel
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">{project.status_text}</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Suivi de dossier • {project.client_name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-sm font-semibold">Progression globale</p>
                  <p className="text-[#e77e23] text-sm font-extrabold">{pct}%</p>
                </div>

                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e77e23] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-slate-400 text-xs">
                  Étapes {completedCount}/{totalCount} • Mis à jour {timeAgo(lastUpdate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <section className="px-4 py-2">
          <h3 className="text-lg font-extrabold mb-4 text-slate-900">Étapes du dossier</h3>

          <div className="space-y-0 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {displaySteps.map((s, idx) => {
              const isDone = s.is_completed;
              const isCurrent = idx === currentIndex && !displaySteps.every((x) => x.is_completed);
              const isPending = !s.is_completed && !isCurrent;

              return (
                <div key={s.order_index} className="relative flex gap-4 pb-8 items-start">
                  {/* Icon */}
                  {isDone && (
                    <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e77e23] text-white shadow-sm">
                      <Check className="size-4" />
                    </div>
                  )}

                  {isCurrent && (
                    <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-white border-4 border-[#e77e23] text-[#e77e23] shadow-md">
                      <Hourglass className="size-4 animate-pulse" />
                    </div>
                  )}

                  {isPending && (
                    <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 border-2 border-slate-200 text-slate-400">
                      <Lock className="size-4" />
                    </div>
                  )}

                  {/* Text */}
                  <div className="flex flex-col pt-1">
                    <h4
                      className={[
                        "font-extrabold",
                        isCurrent
                          ? "text-[#e77e23]"
                          : isPending
                          ? "text-slate-400"
                          : "text-slate-900",
                      ].join(" ")}
                    >
                      {s.label}
                    </h4>
                    <p
                      className={[
                        "text-sm",
                        isPending ? "text-slate-400" : "text-slate-500",
                      ].join(" ")}
                    >
                      {isDone ? "Validé" : isCurrent ? "En cours" : "À venir"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Reference & Actions */}
        <section className="p-4 mt-4">
          <div className="bg-[#e77e23]/5 border border-[#e77e23]/10 rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-slate-500">Référence dossier</span>
              <span className="text-sm font-mono font-extrabold text-slate-900">
                #{project.access_token}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Conseiller dédié</span>
              <span className="text-sm font-semibold text-slate-900">
                {project.broker_email || "—"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
  {/* Bouton principal upload */}
  <label
    className={`flex-1 flex items-center justify-center gap-2 font-extrabold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
      uploadSuccess
        ? "bg-emerald-500 text-white"
        : "bg-[#e77e23] hover:bg-[#e77e23]/90 text-white"
    }`}
  >
    {uploading ? (
      <Loader2 className="h-5 w-5 animate-spin" />
    ) : uploadSuccess ? (
      <CheckCircle2 size={20} />
    ) : (
      <FileUp size={20} />
    )}

    <span className="text-sm">
      {uploading
        ? "Envoi..."
        : uploadSuccess
        ? "Document reçu !"
        : "Ajouter un document"}
    </span>

    <input
      type="file"
      className="hidden"
      onChange={handleUpload}
      disabled={uploading}
    />
  </label>

  {/* Bulle téléphone */}
  {phoneHref && (
    <a
      href={phoneHref}
      className="flex size-14 items-center justify-center rounded-full bg-white border border-[#e77e23]/20 shadow-sm hover:bg-[#e77e23]/10 transition"
    >
      <Phone className="size-5 text-[#e77e23]" />
    </a>
  )}

  {/* Bulle mail */}
  <a
    href={`mailto:${project.broker_email}?subject=${encodeURIComponent(
      `Question sur mon dossier ${project.client_name}`
    )}`}
    className="flex size-14 items-center justify-center rounded-full bg-white border border-[#e77e23]/20 shadow-sm hover:bg-[#e77e23]/10 transition"
  >
    <MessageCircle className="size-5 text-[#e77e23]" />
  </a>
</div>
        </section>
      </main>

      {/* Bottom bar (simple, visuelle, sans changer navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200">
        <div className="flex max-w-2xl mx-auto px-4 py-2">
          <button
            type="button"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 py-1"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Home className="size-5" />
            <span className="text-[10px] font-semibold leading-none">Accueil</span>
          </button>

          <button
            type="button"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-[#e77e23] py-1 border-t-2 border-[#e77e23] -mt-2"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FileUp className="size-5" />
            <span className="text-[10px] font-semibold leading-none">Dossier</span>
          </button>

          <a
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 py-1"
            href={`mailto:${project.broker_email}`}
          >
            <MessageCircle className="size-5" />
            <span className="text-[10px] font-semibold leading-none">Messages</span>
          </a>

          <button
            type="button"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 py-1"
            onClick={() => alert("Profil client")}
          >
            <Phone className="size-5" />
            <span className="text-[10px] font-semibold leading-none">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}