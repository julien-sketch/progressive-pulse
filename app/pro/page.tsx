"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Project = {
  id: string;
  created_at: string | null;
  client_name: string;
  progress_percent: number | null;
  status_text: string | null;
  access_token: string;
  broker_email: string | null;
  drive_folder_url: string | null;
  updated_at: string | null;
  project_type: string | null; // "immo" | "of"
  owner_user_id: string | null;
};

type StatusDef = {
  label: string;
  percent: number;
};

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
    { label: "Dossier complet", percent: 25 },
    { label: "Dépôt effectué auprès du fonds de formation", percent: 38 },
    { label: "En attente de validation", percent: 50 },
    { label: "Validé", percent: 80 },
    { label: "Financement reçu", percent: 100 },
  ],
  other: [
    { label: "Documents reçus", percent: 0 },
    { label: "Dossier complet", percent: 50 },
    { label: "Terminé", percent: 100 },
  ],
};

function clampPct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalizeType(t: string | null | undefined) {
  const v = (t ?? "").toLowerCase().trim();
  if (v === "immobilier") return "immo";
  if (v === "formation") return "of";
  if (v === "immo" || v === "of") return v;
  return "other";
}

function makeAccessToken(clientName: string) {
  // token simple et stable : slug + random 3 chiffres
  const slug = clientName
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);

  const rnd = Math.floor(100 + Math.random() * 900); // 100-999
  return `${slug || "client"}-${rnd}`;
}

export default function ProPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const [credits, setCredits] = useState<number>(0);
  const [projects, setProjects] = useState<Project[]>([]);

  // create
  const [typeUi, setTypeUi] = useState<string>("Immobilier");
  const [clientName, setClientName] = useState<string>("");
  const [creating, setCreating] = useState(false);

  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);

  const stripeCheckoutUrl = `https://buy.stripe.com/eVq8wQ3kJ7vWc2x58veIw00?prefilled_email=${encodeURIComponent(
    userEmail || ""
  )}`;

  const loadAll = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) console.error("auth.getUser:", userErr);

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const uid = user.id;
    const email = user.email ?? "";

    setUserId(uid);
    setUserEmail(email);

    // credits
    const { data: walletRow, error: walletErr } = await supabase
      .from("credit_wallets")
      .select("credits")
      .eq("user_id", uid)
      .maybeSingle();

    if (walletErr) {
      console.error("credit_wallets:", walletErr);
      setCredits(0);
    } else {
      setCredits(Number(walletRow?.credits ?? 0));
    }

    // projects
    const { data: projectsData, error: projectsErr } = await supabase
      .from("projects")
      .select(
        "id,created_at,client_name,progress_percent,status_text,access_token,broker_email,drive_folder_url,updated_at,project_type,owner_user_id"
      )
      .eq("broker_email", email)
      .order("created_at", { ascending: false });

    if (projectsErr) {
      console.error("projects:", projectsErr);
      setProjects([]);
      setLoading(false);
      return;
    }

    setProjects((projectsData ?? []) as Project[]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const copyLink = async (token: string) => {
    const url = `${window.location.origin}/track/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Lien copié.");
    } catch {
      prompt("Copie le lien :", url);
    }
  };

  const createDossier = async () => {
    if (creating) return;

    const name = clientName.trim();
    if (!name) {
      alert("Renseigne le nom du client.");
      return;
    }
    if (!userId || !userEmail) {
      alert("Utilisateur non chargé.");
      return;
    }
    if (credits <= 0) {
      alert("Plus de crédits. Achète des dossiers.");
      return;
    }

    setCreating(true);

    const projectType = normalizeType(typeUi);
    const defaults = STATUS_BY_TYPE[projectType] ?? STATUS_BY_TYPE.other;
    const defaultStatus = defaults[0];

    const accessToken = makeAccessToken(name);

    // ✅ INSERT avec TES colonnes uniquement
    const { data: inserted, error: insErr } = await supabase
      .from("projects")
      .insert({
        client_name: name,
        progress_percent: defaultStatus.percent,
        status_text: defaultStatus.label,
        access_token: accessToken,
        broker_email: userEmail,
        drive_folder_url: null,
        project_type: projectType,
        owner_user_id: userId,
      })
      .select(
        "id,created_at,client_name,progress_percent,status_text,access_token,broker_email,drive_folder_url,updated_at,project_type,owner_user_id"
      )
      .single();

    if (insErr) {
      console.error("Erreur création projet:", insErr);
      alert(`Erreur création dossier : ${insErr.message}`);
      setCreating(false);
      return;
    }

    // décrément crédits
    const nextCredits = credits - 1;
    const { error: creditsErr } = await supabase
      .from("credit_wallets")
      .update({ credits: nextCredits, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (creditsErr) {
      console.error("Erreur update crédits:", creditsErr);
      alert("Dossier créé, mais crédits non mis à jour (RLS ?).");
      // On continue, mais tu dois corriger RLS si besoin
    }

    setClientName("");
    setCreating(false);

    // refresh
    await loadAll();
  };

  const setProjectStatus = async (project: Project, status: StatusDef) => {
    if (updatingProjectId) return;

    setUpdatingProjectId(project.id);

    // optimistic UI
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? {
              ...p,
              status_text: status.label,
              progress_percent: clampPct(status.percent),
            }
          : p
      )
    );

    const { error } = await supabase
      .from("projects")
      .update({
        status_text: status.label,
        progress_percent: clampPct(status.percent),
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id);

    if (error) {
      console.error("Erreur update status:", error);
      alert("Impossible de mettre à jour le statut (RLS ?).");
      await loadAll(); // rollback
    }

    setUpdatingProjectId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Dashboard Pro</h1>
            <p className="text-sm text-zinc-500 mt-1">Connecté : {userEmail}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-full bg-black text-white px-6 py-3 font-bold hover:bg-zinc-800 transition"
          >
            Déconnexion
          </button>
        </div>

        {/* TOP GRID */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CREDITS */}
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-8">
            <div className="text-xs font-black tracking-widest text-zinc-400">CRÉDITS</div>

            <div className="mt-4 flex items-end gap-3">
              <div className="text-6xl font-black leading-none">{credits}</div>
              <div className="pb-2 text-zinc-600 font-semibold">dossiers restants</div>
            </div>

            <p className="mt-3 text-sm text-zinc-500 font-semibold">
              1 dossier créé = 1 crédit consommé.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {/* ✅ plus petit */}
              <a
                href={stripeCheckoutUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold hover:bg-zinc-50 transition"
              >
                Acheter des dossiers
              </a>

              {/* ✅ plus petit */}
              <button
                onClick={loadAll}
                className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-4 py-2 text-sm font-bold hover:bg-zinc-800 transition"
              >
                Rafraîchir
              </button>
            </div>
          </div>

          {/* CREATE DOSSIER */}
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-8">
            <div className="text-xs font-black tracking-widest text-zinc-400">CRÉER UN DOSSIER</div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="text-xs font-black tracking-widest text-zinc-400">TYPE</div>
                <select
                  value={typeUi}
                  onChange={(e) => setTypeUi(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-black/10"
                >
                  <option>Immobilier</option>
                  <option>Formation</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <div className="text-xs font-black tracking-widest text-zinc-400">CLIENT</div>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="ex: Nabil / Mme Martin"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <button
                onClick={createDossier}
                disabled={creating || credits <= 0}
                className="mt-2 w-full rounded-2xl bg-black text-white px-6 py-4 font-black hover:bg-zinc-800 transition disabled:opacity-40"
              >
                {creating ? "Création..." : "Créer (1 crédit)"}
              </button>
            </div>
          </div>
        </div>

        {/* DOSSIERS */}
        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white shadow-sm p-8">
          <div className="flex items-center justify-between">
            <div className="text-xs font-black tracking-widest text-zinc-400">DOSSIERS</div>
            <div className="text-sm font-black text-zinc-500">{projects.length}</div>
          </div>

          <div className="mt-6 space-y-6">
            {projects.map((p) => {
              const t = normalizeType(p.project_type);
              const statuses = STATUS_BY_TYPE[t] ?? STATUS_BY_TYPE.other;
              const progress = clampPct(p.progress_percent ?? 0);

              return (
                <div key={p.id} className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-black">{p.client_name}</div>
                        <div className="text-xs font-black tracking-widest text-zinc-400">
                          • {t.toUpperCase()}
                        </div>
                      </div>

                      <div className="mt-1 text-sm font-semibold text-zinc-600">
                        {(p.status_text ?? "—")} — {progress}%
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        Clique sur un bouton pour mettre à jour le dossier.
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => copyLink(p.access_token)}
                        className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold hover:bg-zinc-50 transition"
                      >
                        Copier lien
                      </button>

                      <a
                        href={`/track/${p.access_token}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl bg-black text-white px-4 py-2 text-sm font-bold hover:bg-zinc-800 transition"
                      >
                        Ouvrir
                      </a>
                    </div>
                  </div>

                  {/* BOUTONS STATUTS (= étapes) */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {statuses.map((s) => {
                      const isActive = (p.status_text ?? "") === s.label;
                      const isBusy = updatingProjectId === p.id;

                      return (
                        <button
                          key={`${p.id}-${s.label}`}
                          onClick={() => setProjectStatus(p, s)}
                          disabled={isBusy}
                          className={`rounded-full px-4 py-2 text-xs font-black border transition ${
                            isActive
                              ? "bg-black text-white border-black"
                              : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                          } ${isBusy ? "opacity-50" : ""}`}
                          title={`${s.percent}%`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && (
              <div className="text-sm text-zinc-500">Aucun dossier pour le moment.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}