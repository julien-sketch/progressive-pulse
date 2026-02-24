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
  broker_phone: string | null; // ✅ AJOUT
  drive_folder_url: string | null;
  updated_at: string | null;
  project_type: string | null;
  owner_user_id: string | null;
};

type StepDef = { label: string };

const STEPS_BY_TYPE: Record<string, StepDef[]> = {
  immo: [
    { label: "Mandat signé" },
    { label: "Shooting photo réalisé" },
    { label: "Annonce publiée" },
    { label: "Visites en cours" },
    { label: "Offre acceptée" },
    { label: "Compromis signé" },
    { label: "Délai de rétractation" },
    { label: "Acte authentique signé" },
  ],
  of: [
    { label: "Documents reçus" },
    { label: "Dossier complet" },
    { label: "Dépôt effectué auprès du fonds de formation" },
    { label: "En attente de validation" },
    { label: "Demande acceptée" },
    { label: "Documents de fin de formation transmis" },
    { label: "Remboursement en cours" },
    { label: "Paiement validé" },
  ],
  other: [{ label: "Documents reçus" }, { label: "Dossier complet" }, { label: "Terminé" }],
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

function makeAccessToken(clientName: string) {
  const slug = clientName
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);

  const rnd = Math.floor(100 + Math.random() * 900);
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
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // ✅ édition téléphone par dossier
  const [phoneDraftById, setPhoneDraftById] = useState<Record<string, string>>({});
  const [savingPhoneId, setSavingPhoneId] = useState<string | null>(null);

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

    // ✅ IMPORTANT: on inclut broker_phone
    const { data: projectsData, error: projectsErr } = await supabase
      .from("projects")
      .select(
        "id,created_at,client_name,progress_percent,status_text,access_token,broker_email,broker_phone,drive_folder_url,updated_at,project_type,owner_user_id"
      )
      .eq("broker_email", email)
      .order("created_at", { ascending: false });

    if (projectsErr) {
      console.error("projects:", projectsErr);
      setProjects([]);
      setLoading(false);
      return;
    }

    const rows = (projectsData ?? []) as Project[];
    setProjects(rows);

    // ✅ initialise les drafts téléphone depuis la DB
    setPhoneDraftById((prev) => {
      const next = { ...prev };
      for (const p of rows) {
        if (next[p.id] === undefined) next[p.id] = (p.broker_phone ?? "").toString();
      }
      return next;
    });

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
    if (!name) return alert("Renseigne le nom du client.");
    if (!userId || !userEmail) return alert("Utilisateur non chargé.");

    setCreating(true);

    const projectType = normalizeType(typeUi);
    const accessToken = makeAccessToken(name);

    const { error } = await supabase.rpc("create_project_with_credit", {
      p_client_name: name,
      p_project_type: projectType,
      p_access_token: accessToken,
    });

    if (error) {
      console.error("RPC create_project_with_credit error:", error);
      alert(error.message);
      setCreating(false);
      return;
    }

    setClientName("");
    setCreating(false);
    await loadAll();
  };

  const setProjectStep = async (project: Project, stepIndex1Based: number) => {
    if (updatingProjectId) return;
    if (!userId) return alert("Utilisateur non chargé.");

    setUpdatingProjectId(project.id);

    const { error } = await supabase.rpc("set_project_step", {
      p_project_id: project.id,
      p_step_index: stepIndex1Based,
    });

    if (error) {
      console.error("set_project_step error:", error);
      alert(error.message);
    }

    setUpdatingProjectId(null);
    await loadAll();
  };

  // ✅ Sauvegarde téléphone (par dossier)
  const savePhone = async (project: Project) => {
    if (savingPhoneId) return;
    if (!userEmail) return alert("Email utilisateur non chargé.");

    const draft = (phoneDraftById[project.id] ?? "").trim();

    setSavingPhoneId(project.id);

    const { error } = await supabase
      .from("projects")
      .update({ broker_phone: draft || null })
      .eq("id", project.id)
      .eq("broker_email", userEmail); // sécurité: tu ne modifies que tes dossiers

    if (error) {
      console.error("update broker_phone error:", error);
      alert(error.message);
      setSavingPhoneId(null);
      return;
    }

    setSavingPhoneId(null);
    await loadAll();
  };

  const deleteDossier = async (project: Project) => {
    if (deletingProjectId) return;
    if (!userId) return alert("Utilisateur non chargé.");
    if (project.owner_user_id !== userId) return alert("Suppression refusée (owner_user_id).");

    const ok = confirm(
      `Supprimer définitivement le dossier "${project.client_name}" ?\n\nCette action est irréversible.`
    );
    if (!ok) return;

    setDeletingProjectId(project.id);

    const { error: delStepsErr } = await supabase
      .from("project_steps")
      .delete()
      .eq("project_id", project.id);

    if (delStepsErr) {
      console.error("delete project_steps error:", delStepsErr);
      alert(delStepsErr.message);
      setDeletingProjectId(null);
      return;
    }

    const { error: delProjErr } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id)
      .eq("owner_user_id", userId);

    if (delProjErr) {
      console.error("delete project error:", delProjErr);
      alert(delProjErr.message);
      setDeletingProjectId(null);
      return;
    }

    setDeletingProjectId(null);
    await loadAll();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
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
              <a
                href={stripeCheckoutUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold hover:bg-zinc-50 transition"
              >
                Acheter des dossiers
              </a>

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
                  placeholder="ex: Mr ou Mme xxxxx"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <button
                onClick={createDossier}
                disabled={creating}
                className="mt-2 w-full rounded-2xl bg-black text-white px-6 py-4 font-black hover:bg-zinc-800 transition disabled:opacity-40"
              >
                {creating ? "Création..." : "Créer (1 crédit)"}
              </button>

              {credits <= 0 && (
                <div className="text-xs font-semibold text-zinc-500">
                  Plus de crédits : utilise “Acheter des dossiers”.
                </div>
              )}
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
              const stepsDef = STEPS_BY_TYPE[t] ?? STEPS_BY_TYPE.other;

              const progress = clampPct(p.progress_percent);
              const canUpdate = p.owner_user_id === userId;
              const isBusy = updatingProjectId === p.id;
              const isDeleting = deletingProjectId === p.id;

              const statusText = (p.status_text ?? "").trim();
              const idxCurrent = stepsDef.findIndex((s) => s.label === statusText);
              const isFinished = statusText.toLowerCase() === "terminé";

              const currentLabel =
                isFinished ? "Terminé" : idxCurrent >= 0 ? stepsDef[idxCurrent]?.label : statusText || "—";

              const phoneDraft = phoneDraftById[p.id] ?? (p.broker_phone ?? "");

              return (
                <div key={p.id} className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-xl font-black">{p.client_name}</div>
                        <div className="text-xs font-black tracking-widest text-zinc-400">• {t.toUpperCase()}</div>

                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-700">
                          Étape en cours : {currentLabel}
                        </span>
                      </div>

                      <div className="mt-2 text-sm font-semibold text-zinc-600">
                        Progression : {progress}%
                      </div>

                      {!isFinished && idxCurrent === -1 && statusText && (
                        <div className="mt-1 text-xs font-semibold text-amber-600">
                          Attention : status_text ne correspond à aucune étape du template ({statusText})
                        </div>
                      )}

                      {!canUpdate && (
                        <div className="mt-1 text-xs font-semibold text-red-600">
                          owner_user_id manquant ou différent : actions bloquées.
                        </div>
                      )}

                      {/* ✅ CONTACT PRO: téléphone éditable */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <div className="text-xs font-black tracking-widest text-zinc-400">TÉLÉPHONE PRO</div>
                          <input
                            value={phoneDraft}
                            onChange={(e) =>
                              setPhoneDraftById((prev) => ({ ...prev, [p.id]: e.target.value }))
                            }
                            placeholder="ex: 06 12 34 56 78"
                            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-black/10"
                          />
                          <div className="mt-1 text-xs text-zinc-500 font-semibold">
                            Ce numéro apparaîtra côté client (bouton “Appeler mon agent”).
                          </div>
                        </div>

                        <div className="md:col-span-1 flex md:items-end">
                          <button
                            onClick={() => savePhone(p)}
                            disabled={!canUpdate || isDeleting || savingPhoneId === p.id}
                            className="w-full rounded-2xl bg-black text-white px-4 py-3 text-sm font-black hover:bg-zinc-800 transition disabled:opacity-50"
                            title={!canUpdate ? "Action bloquée (owner_user_id)" : ""}
                          >
                            {savingPhoneId === p.id ? "Sauvegarde..." : "Enregistrer"}
                          </button>
                        </div>
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

                      <button
                        onClick={() => deleteDossier(p)}
                        disabled={!canUpdate || isDeleting}
                        className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-black text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                      </button>
                    </div>
                  </div>

                  {/* ✅ Boutons étapes */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {stepsDef.map((s, idx) => {
                      const stepIndex1 = idx + 1;

                      const completed = isFinished ? true : idxCurrent >= 0 ? idx < idxCurrent : false;
                      const isCurrent = !isFinished && idxCurrent >= 0 && idx === idxCurrent;

                      const base = "rounded-full px-4 py-2 text-xs font-black border transition";
                      const disabled = !canUpdate || isBusy || isDeleting ? "opacity-50" : "";

                      const cls = isCurrent
                        ? `${base} bg-black text-white border-black`
                        : completed
                        ? `${base} bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100`
                        : `${base} bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50`;

                      return (
                        <button
                          key={`${p.id}-${s.label}`}
                          onClick={() => setProjectStep(p, stepIndex1)}
                          disabled={!canUpdate || isBusy || isDeleting}
                          className={`${cls} ${disabled}`}
                          title={`Étape ${stepIndex1}`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && <div className="text-sm text-zinc-500">Aucun dossier pour le moment.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}