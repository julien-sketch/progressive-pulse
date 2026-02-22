"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Project = {
  id: string;
  client_name: string;
  status_text: string | null;
  progress_percent: number | null;
  access_token: string;
  project_type: string | null;
  created_at?: string | null;
};

type StepRow = {
  id?: string;
  project_id: string;
  order_index: number | null;
  is_completed: boolean | null;
  label?: string | null; // ton champ attendu
  name?: string | null;  // fallback possible
  title?: string | null; // fallback possible
};

type Step = {
  project_id: string;
  order_index: number;
  label: string;
  is_completed: boolean;
};

const DEFAULT_STEPS: Array<{ label: string }> = [
  { label: "Pièce d’identité" },
  { label: "Justificatif de domicile" },
  { label: "Situation professionnelle" },
  { label: "Revenus" },
  { label: "Relevés bancaires" },
  { label: "Charges & crédits" },
  { label: "Épargne & apport" },
  { label: "Documents spécifiques" },
];

function pct(n: number | null | undefined) {
  const v = typeof n === "number" ? n : 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

export default function ProPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const [credits, setCredits] = useState<number>(0);

  const [projects, setProjects] = useState<Project[]>([]);
  const [stepsMap, setStepsMap] = useState<Record<string, Step[]>>({});

  // create dossier
  const [type, setType] = useState<string>("Immobilier");
  const [clientName, setClientName] = useState<string>("");
  const [dossierName, setDossierName] = useState<string>("");
  const [creating, setCreating] = useState(false);

  const loadAll = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) console.error("auth.getUser error:", userErr);

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const uid = user.id;
    const email = user.email ?? "";

    setUserId(uid);
    setUserEmail(email);

    // ============================
    // 1) CREDITS depuis credit_wallets
    // ============================
    const { data: walletRow, error: walletErr } = await supabase
      .from("credit_wallets")
      .select("credits")
      .eq("user_id", uid)
      .maybeSingle();

    if (walletErr) {
      console.error("Erreur credit_wallets:", walletErr);
      setCredits(0);
    } else {
      setCredits(Number(walletRow?.credits ?? 0));
    }

    // ============================
    // 2) PROJETS
    // ============================
    const { data: projectsData, error: projectsErr } = await supabase
      .from("projects")
      .select("id, client_name, status_text, progress_percent, access_token, project_type, created_at")
      .eq("broker_email", email)
      .order("created_at", { ascending: false });

    if (projectsErr) {
      console.error("Erreur projects:", projectsErr);
      setProjects([]);
      setStepsMap({});
      setLoading(false);
      return;
    }

    const list = (projectsData ?? []) as Project[];
    setProjects(list);

    // ============================
    // 3) ETAPES
    // ============================
    if (list.length === 0) {
      setStepsMap({});
      setLoading(false);
      return;
    }

    const projectIds = list.map((p) => p.id);

    // IMPORTANT: on récupère aussi name/title au cas où label n’existe pas
    const { data: stepsData, error: stepsErr } = await supabase
      .from("steps")
      .select("id, project_id, order_index, is_completed, label, name, title")
      .in("project_id", projectIds)
      .order("order_index", { ascending: true });

    if (stepsErr) {
      console.error("Erreur steps:", stepsErr);
      setStepsMap({});
      setLoading(false);
      return;
    }

    const map: Record<string, Step[]> = {};
    (stepsData ?? []).forEach((s: StepRow) => {
      const pid = s.project_id;
      const order = typeof s.order_index === "number" ? s.order_index : 0;

      const lbl =
        (s.label ?? s.name ?? s.title ?? "").trim() ||
        `Étape ${order}`;

      const step: Step = {
        project_id: pid,
        order_index: order,
        label: lbl,
        is_completed: !!s.is_completed,
      };

      if (!map[pid]) map[pid] = [];
      map[pid].push(step);
    });

    setStepsMap(map);
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

    const trimmedClient = clientName.trim();
    if (!trimmedClient) {
      alert("Renseigne le nom du client.");
      return;
    }

    if (!userId) {
      alert("Utilisateur non chargé.");
      return;
    }

    if (credits <= 0) {
      alert("Plus de crédits. Achète des dossiers.");
      return;
    }

    setCreating(true);

    // 1) Créer le projet
    const { data: inserted, error: insErr } = await supabase
      .from("projects")
      .insert({
        client_name: trimmedClient,
        project_type: type,
        dossier_name: dossierName.trim() || null,
        status_text: "Dossier en cours",
        progress_percent: 0,
        broker_email: userEmail,
        drive_folder_url: null,
      })
      .select("id, client_name, status_text, progress_percent, access_token, project_type, created_at")
      .single();

    if (insErr) {
      console.error("Erreur création projet:", insErr);
      alert("Erreur création dossier.");
      setCreating(false);
      return;
    }

    const newProject = inserted as Project;

    // 2) Créer les étapes (si tu n’as pas de trigger DB)
    const stepsPayload = DEFAULT_STEPS.map((st, idx) => ({
      project_id: newProject.id,
      order_index: idx + 1,
      label: st.label,
      is_completed: false,
    }));

    const { error: stepsCreateErr } = await supabase.from("steps").insert(stepsPayload);
    if (stepsCreateErr) {
      console.error("Erreur insert steps:", stepsCreateErr);
      // on continue : le dossier existe
    }

    // 3) Décrémenter les crédits dans credit_wallets
    const nextCredits = credits - 1;

    const { error: creditsErr } = await supabase
      .from("credit_wallets")
      .update({
        credits: nextCredits,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (creditsErr) {
      console.error("Erreur décrément credits:", creditsErr);
      // dossier OK, crédits pas à jour → à corriger côté DB/RLS
    }

    setClientName("");
    setDossierName("");
    setCreating(false);

    await loadAll();
  };

  const stripeCheckoutUrl = `https://buy.stripe.com/eVq8wQ3kJ7vWc2x58veIw00?prefilled_email=${encodeURIComponent(
    userEmail || ""
  )}`;

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
            <div className="text-xs font-black tracking-widest text-zinc-400">
              CRÉDITS
            </div>

            <div className="mt-4 flex items-end gap-3">
              <div className="text-6xl font-black leading-none">{credits}</div>
              <div className="pb-2 text-zinc-600 font-semibold">
                dossiers restants
              </div>
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
            <div className="text-xs font-black tracking-widest text-zinc-400">
              CRÉER UN DOSSIER
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="text-xs font-black tracking-widest text-zinc-400">
                  TYPE
                </div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-black/10"
                >
                  <option>Immobilier</option>
                  <option>Crédit conso</option>
                  <option>Assurance</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <div className="text-xs font-black tracking-widest text-zinc-400">
                  CLIENT
                </div>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="ex: Nabil / Mme Martin"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <div className="text-xs font-black tracking-widest text-zinc-400">
                  NOM DOSSIER (OPTIONNEL)
                </div>
                <input
                  value={dossierName}
                  onChange={(e) => setDossierName(e.target.value)}
                  placeholder="ex: Appart Lyon"
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
            <div className="text-xs font-black tracking-widest text-zinc-400">
              DOSSIERS
            </div>
            <div className="text-sm font-black text-zinc-500">{projects.length}</div>
          </div>

          <div className="mt-6 space-y-6">
            {projects.map((p) => {
              const steps = stepsMap[p.id] || [];
              const progress = pct(p.progress_percent);

              return (
                <div
                  key={p.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-black">{p.client_name}</div>
                        <div className="text-xs font-black tracking-widest text-zinc-400">
                          • {p.project_type ?? "OF"}
                        </div>
                      </div>

                      <div className="mt-1 text-sm font-semibold text-zinc-600">
                        {(p.status_text ?? "Dossier en cours")} — {progress}%
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

                  {/* ÉTAPES (labels) */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {steps.length === 0 ? (
                      <div className="text-sm text-zinc-500">
                        Aucune étape affichée. (RLS ou données steps absentes)
                      </div>
                    ) : (
                      steps.map((s) => (
                        <div
                          key={`${p.id}-${s.order_index}-${s.label}`}
                          className={`rounded-full px-4 py-2 text-xs font-black border ${
                            s.is_completed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-white text-zinc-700 border-zinc-200"
                          }`}
                          title={`Étape ${s.order_index}`}
                        >
                          {s.label}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && (
              <div className="text-sm text-zinc-500">
                Aucun dossier pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}