"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Wallet = { credits: number };
type ProjectRow = {
  id: string;
  client_name: string;
  progress_percent: number;
  status_text: string;
  access_token: string;
  project_type: string;
  created_at: string | null;
};

export default function ProDashboardPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [loading, setLoading] = useState(true);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  // create form
  const [projectType, setProjectType] = useState<"immo" | "of">("immo");
  const [clientName, setClientName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://progressive-pulse-snowy.vercel.app";

  const refresh = async () => {
    setMsg(null);
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
      setUserEmail(null);
      setCredits(0);
      setProjects([]);
      setLoading(false);
      return;
    }

    setUserEmail(session.user.email ?? null);

    const { data: w } = await supabase
      .from("credit_wallets")
      .select("credits")
      .eq("user_id", session.user.id)
      .maybeSingle();

    setCredits((w as Wallet | null)?.credits ?? 0);

    const { data: list } = await supabase
      .from("projects")
      .select("id, client_name, progress_percent, status_text, access_token, project_type, created_at")
      .order("created_at", { ascending: false });

    setProjects((list as ProjectRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!clientName.trim()) {
      setMsg("Nom client obligatoire.");
      return;
    }

    setCreating(true);
    const { data, error } = await supabase.rpc("create_project_with_steps", {
      p_client_name: clientName.trim(),
      p_project_type: projectType,
      p_property_name: propertyName.trim() || null,
    });

    setCreating(false);

    if (error) {
      // "No credits left" remonte ici
      setMsg("Erreur : " + error.message);
      return;
    }

    const row = Array.isArray(data) ? data[0] : null;
    if (row?.access_token) {
      setMsg("Dossier créé ✅");
      setClientName("");
      setPropertyName("");
      await refresh();
      // option: ouvrir directement le lien client
      // window.open(`${origin}/track/${row.access_token}`, "_blank");
    } else {
      setMsg("Création OK, mais token introuvable.");
      await refresh();
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setMsg("Lien copié ✅");
    setTimeout(() => setMsg(null), 2000);
  };

  const updateStep = async (token: string, stepIndex: number) => {
    // route publique existante chez toi (service role)
    const url = `${origin}/api/immo/update-step?token=${encodeURIComponent(token)}&step=${stepIndex}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      setMsg("Erreur update étape.");
      return;
    }
    setMsg("Étape mise à jour ✅");
    await refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-bold text-zinc-600">
        Chargement...
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!userEmail) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Dashboard Pro</h1>
            <p className="mt-1 text-sm font-semibold text-zinc-500">
              Connecté : {userEmail}
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-2xl bg-black px-4 py-3 font-black text-white hover:bg-zinc-800 transition"
          >
            Déconnexion
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Crédits
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black">{credits}</span>
              <span className="text-sm font-bold text-zinc-500">dossiers restants</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-zinc-500">
              1 dossier créé = 1 crédit consommé.
            </p>

            <div className="mt-4 flex gap-2">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-black text-zinc-800 hover:bg-zinc-50 transition"
              >
                Acheter des dossiers
              </a>
              <button
                onClick={refresh}
                className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-3 font-black text-white hover:bg-black transition"
              >
                Rafraîchir
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Créer un dossier
            </p>

            <form onSubmit={createProject} className="mt-4 space-y-3">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
                  Type
                </label>
                <select
                  className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-3 outline-none"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as any)}
                >
                  <option value="immo">Immobilier</option>
                  <option value="of">Organisme de formation</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
                  Client
                </label>
                <input
                  className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-3 outline-none"
                  placeholder="ex: Nabil / Mme Martin"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400">
                  Nom dossier (optionnel)
                </label>
                <input
                  className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-3 outline-none"
                  placeholder={projectType === "immo" ? "ex: Appart Lyon" : "ex: Formation Excel"}
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                />
              </div>

              <button
                disabled={creating}
                className="w-full rounded-2xl bg-black p-3 font-black text-white hover:bg-zinc-800 disabled:opacity-60 transition"
              >
                {creating ? "Création..." : "Créer (1 crédit)"}
              </button>
            </form>
          </div>
        </div>

        {msg && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 font-bold text-emerald-800">
            {msg}
          </div>
        )}

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Dossiers
            </p>
            <span className="text-sm font-black text-zinc-500">{projects.length}</span>
          </div>

          <div className="mt-4 space-y-3">
            {projects.map((p) => {
              const trackUrl = `${origin}/track/${p.access_token}`;
              return (
                <div key={p.id} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-black text-zinc-900">
                        {p.client_name}{" "}
                        <span className="text-xs font-black text-zinc-500">
                          • {p.project_type === "of" ? "OF" : "IMMO"}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-semibold text-zinc-600">
                        {p.status_text} — {p.progress_percent}%
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copy(trackUrl)}
                        className="rounded-xl bg-white border border-zinc-200 px-3 py-2 font-black text-sm hover:bg-zinc-100"
                      >
                        Copier lien
                      </button>
                      <a
                        href={trackUrl}
                        target="_blank"
                        className="rounded-xl bg-black px-3 py-2 font-black text-sm text-white hover:bg-zinc-800"
                      >
                        Ouvrir
                      </a>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[1,2,3,4,5,6,7,8].map((n) => (
                      <button
                        key={n}
                        onClick={() => updateStep(p.access_token, n)}
                        className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-black hover:bg-zinc-100"
                      >
                        Étape {n}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && (
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm font-semibold text-zinc-600">
                Aucun dossier pour l’instant.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}