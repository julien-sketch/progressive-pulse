"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Profile = {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  profession: string | null;
};

type Project = {
  id: string;
  created_at: string | null;
  client_name: string;
  project_title: string | null;
  progress_percent: number | null;
  status_text: string | null;
  access_token: string;
  broker_email: string | null;
  broker_phone: string | null;
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
  courtier: [
    { label: "Documents reçus" },
    { label: "Dossier complet" },
    { label: "Étude / Analyse" },
    { label: "Dépôt banque" },
    { label: "Accord de principe" },
    { label: "Édition offre" },
    { label: "Signature" },
    { label: "Déblocage fonds" },
  ],
  artisan: [
    { label: "Devis envoyé" },
    { label: "Devis accepté" },
    { label: "Commande matériel" },
    { label: "Travaux en cours" },
    { label: "Travaux terminés" },
    { label: "Visite fin de travaux" },
    { label: "Facture envoyée" },
    { label: "Terminé" },
  ],
  freelance: [
    { label: "Devis envoyé" },
    { label: "Devis accepté" },
    { label: "Travail en cours" },
    { label: "Première version livrée" },
    { label: "Ajustements en cours" },
    { label: "Facture envoyée" },
    { label: "Projet terminé" },
  ],
  other: [
    { label: "Documents reçus" },
    { label: "Dossier complet" },
    { label: "Terminé" },
  ],
};

const PROFESSION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "courtier", label: "Courtier" },
  { value: "immo", label: "Agent immobilier" },
  { value: "of", label: "Organisme de formation" },
  { value: "artisan", label: "Artisan" },
  { value: "freelance", label: "Freelance" },
  { value: "other", label: "Autre" },
];

function clampPct(n: number | null | undefined) {
  const v = typeof n === "number" ? n : 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function normalizeType(t: string | null | undefined) {
  const v = (t ?? "").toLowerCase().trim();

  if (v === "immobilier") return "immo";
  if (v === "formation") return "of";
  if (v === "artisan" || v === "artisans") return "artisan";

  if (
    v === "freelance" ||
    v === "freelancer" ||
    v === "freelances" ||
    v === "free-lance"
  ) {
    return "freelance";
  }

  if (v === "immo" || v === "of" || v === "courtier" || v === "artisan" || v === "freelance") {
    return v;
  }

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

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [clientName, setClientName] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState<string>("");

  const [creating, setCreating] = useState(false);
  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const stripeCheckoutPack5 = `https://buy.stripe.com/dRm14obRfdUkfeJ8kHeIw04?prefilled_email=${encodeURIComponent(
  userEmail || ""
  )}`;

  const stripeCheckoutPack15 = `https://buy.stripe.com/6oU5kE4oN5nO2rX9oLeIw03?prefilled_email=${encodeURIComponent(
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

    setProfileLoading(true);

    const { data: prof, error: profErr } = await supabase
      .from("profiles")
      .select("user_id,email,first_name,last_name,phone,profession")
      .eq("user_id", uid)
      .maybeSingle();

    setProfileLoading(false);

    if (profErr) {
      console.error("profiles:", profErr);
      setProfile(null);
    } else {
      setProfile((prof ?? null) as Profile | null);
    }

    const { data: projectsData, error: projectsErr } = await supabase
      .from("projects")
      .select(
        "id,created_at,client_name,project_title,progress_percent,status_text,access_token,broker_email,broker_phone,drive_folder_url,updated_at,project_type,owner_user_id"
      )
      .eq("owner_user_id", uid)
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

  const profileOk =
    !!profile &&
    normalizeType(profile.profession) !== "other" &&
    !!(profile.phone && profile.phone.trim().length >= 6);

  const createDossier = async () => {
    if (creating) return;
    if (!profileOk) {
      return alert(
        "Profil incomplet : téléphone ou métier manquant. Reconnecte-toi avec un compte correctement créé ou mets à jour le profil en base."
      );
    }

    const name = clientName.trim();
    if (!name) return alert("Renseigne le nom du client.");

    setCreating(true);

    const accessToken = makeAccessToken(name);

    const { error } = await supabase.rpc("create_project_with_credit", {
      p_client_name: name,
      p_access_token: accessToken,
      p_project_title: projectTitle.trim() || null,
    });

    setCreating(false);

    if (error) {
      console.error("RPC create_project_with_credit error:", error);
      alert(error.message);
      return;
    }

    setClientName("");
    setProjectTitle("");
    await loadAll();
  };

  const setProjectStep = async (project: Project, stepIndex1Based: number) => {
    if (updatingProjectId) return;
    setUpdatingProjectId(project.id);

    const { error } = await supabase.rpc("set_project_step", {
      p_project_id: project.id,
      p_step_index: stepIndex1Based,
    });

    setUpdatingProjectId(null);

    if (error) {
      console.error("set_project_step error:", error);
      alert(error.message);
      return;
    }

    await loadAll();
  };

  const deleteDossier = async (project: Project) => {
    if (deletingProjectId) return;
    if (project.owner_user_id !== userId) {
      return alert("Suppression refusée (owner_user_id).");
    }

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="text-sm font-semibold text-slate-600">Chargement…</div>
        </div>
      </div>
    );
  }

  const metierLabel =
    PROFESSION_OPTIONS.find((o) => o.value === normalizeType(profile?.profession))?.label ??
    normalizeType(profile?.profession);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-8 text-slate-900">
      <div aria-hidden className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.18),transparent_60%)] opacity-30 blur-3xl" />
        <div className="absolute top-24 -left-44 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.12),transparent_60%)] opacity-20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-700 ring-1 ring-indigo-100">
              Progressive Pulse
            </div>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Dashboard Pro</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Connecté : {userEmail}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Métier : {profileLoading ? "…" : metierLabel || "—"} · Téléphone :{" "}
              {profileLoading ? "…" : profile?.phone || "—"}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-2xl bg-slate-900 px-6 py-3 font-extrabold text-white transition hover:bg-slate-800"
          >
            Déconnexion
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold tracking-widest text-slate-400">
                  DOSSIERS
                </div>
                <button
                  onClick={loadAll}
                  className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-extrabold transition hover:bg-slate-50"
                >
                  Rafraîchir
                </button>
              </div>

              <div className="mt-4 flex items-end gap-3">
                <div className="text-6xl font-extrabold leading-none">{projects.length}</div>
                <div className="pb-2 font-semibold text-slate-600">
                  dossiers en cours / créés
                </div>
              </div>

              {!profileOk && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 font-bold text-amber-900">
                  Profil incomplet : métier et téléphone obligatoires. Cette situation
                  concerne surtout les anciens comptes créés avant la nouvelle inscription.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="text-xs font-extrabold tracking-widest text-slate-400">
                CRÉER UN DOSSIER
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs font-extrabold tracking-widest text-slate-400">
                    CLIENT
                  </div>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="ex: Mr ou Mme X"
                    className="mt-2 w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 font-semibold outline-none transition-all focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <div className="text-xs font-extrabold tracking-widest text-slate-400">
                    NOM DU DOSSIER (FACULTATIF)
                  </div>
                  <input
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="ex: Achat résidence principale"
                    className="mt-2 w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 font-semibold outline-none transition-all focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <button
                onClick={createDossier}
                disabled={creating || !profileOk}
                className="mt-5 w-full rounded-2xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] px-6 py-4 font-extrabold text-white shadow-[0_12px_28px_rgba(79,70,229,0.22)] transition disabled:opacity-40 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)] active:translate-y-[1px]"
                title={!profileOk ? "Profil incomplet" : ""}
              >
                {creating ? "Création..." : "Créer (1 crédit)"}
              </button>

              <p className="mt-3 text-sm font-semibold text-slate-500">
                1 dossier créé = 1 crédit consommé.
              </p>
            </div>

            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold tracking-widest text-slate-400">
                  LISTE DES DOSSIERS
                </div>
                <div className="text-sm font-extrabold text-slate-500">{projects.length}</div>
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

                  return (
                    <div key={p.id} className="rounded-3xl border border-[#E2E8F0] bg-white p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-xl font-extrabold">{p.client_name}</div>

                            {p.project_title && (
                              <span className="text-xs font-extrabold text-slate-500">
                                • {p.project_title}
                              </span>
                            )}

                            <div className="text-xs font-extrabold tracking-widest text-slate-400">
                              • {t.toUpperCase()}
                            </div>

                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 ring-1 ring-indigo-100">
                              Étape en cours : {currentLabel}
                            </span>
                          </div>

                          <div className="mt-2 text-sm font-semibold text-slate-600">
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
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => copyLink(p.access_token)}
                            className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-extrabold transition hover:bg-slate-50"
                          >
                            Copier lien
                          </button>

                          <a
                            href={`/track/${p.access_token}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-slate-800"
                          >
                            Ouvrir
                          </a>

                          <button
                            onClick={() => deleteDossier(p)}
                            disabled={!canUpdate || isDeleting}
                            className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-extrabold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {isDeleting ? "Suppression..." : "Supprimer"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {stepsDef.map((s, idx) => {
                          const stepIndex1 = idx + 1;
                          const completed = isFinished ? true : idxCurrent >= 0 ? idx < idxCurrent : false;
                          const isCurrent = !isFinished && idxCurrent >= 0 && idx === idxCurrent;

                          const base = "rounded-full px-4 py-2 text-xs font-extrabold border transition";
                          const disabled = !canUpdate || isBusy || isDeleting ? "opacity-50" : "";

                          const cls = isCurrent
                            ? `${base} border-indigo-600 bg-indigo-600 text-white`
                            : completed
                            ? `${base} border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100`
                            : `${base} border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50`;

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

                {projects.length === 0 && (
                  <div className="text-sm font-semibold text-slate-500">
                    Aucun dossier pour le moment.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="text-xs font-extrabold tracking-widest text-slate-400">
                CRÉDITS
              </div>

              <div className="mt-3 flex items-end gap-3">
                <div className="text-5xl font-extrabold leading-none">{credits}</div>
                <div className="pb-2 font-semibold text-slate-600">restants</div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">

                <a
                href={stripeCheckoutPack5}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-extrabold transition hover:bg-slate-50"
                >
                Acheter 5 dossiers — 69€
                </a>

                <a
                href={stripeCheckoutPack15}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] px-4 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(79,70,229,0.18)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.24)] active:translate-y-[1px]"
                >
                Acheter 15 dossiers — 149€
                </a>

                </div>

                <p className="mt-3 text-xs font-semibold text-slate-500">
                Les crédits n’expirent jamais.
                </p>
              </div>
          </aside>
        </div>
      </div>
    </div>
  );
}