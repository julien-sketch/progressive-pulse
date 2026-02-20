"use client";

import { useState } from "react";
import { Link as LinkIcon, CheckCircle2, Loader2, PlusCircle } from "lucide-react";

type ProjectType = "immo" | "of";

export default function AdminPage() {
  const [clientName, setClientName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [brokerEmail, setBrokerEmail] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("immo");

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setToken("");

    try {
      const res = await fetch("/api/admin/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          client_name: clientName,
          broker_email: brokerEmail,
          property_name: propertyName,
          project_type: projectType,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage("Erreur : " + (json?.error || "Impossible de créer le dossier"));
        return;
      }

      setToken(json.token);
      setMessage("Le dossier a été créé avec succès !");
    } finally {
      setLoading(false);
    }
  };

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://progressive-pulse-snowy.vercel.app";

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans text-zinc-900">
      <div className="mx-auto max-w-md pt-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
            <PlusCircle size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Nouvel accès client</h1>
        </div>

        <form
          onSubmit={createProject}
          className="space-y-4 rounded-[2.5rem] bg-white p-8 shadow-xl shadow-zinc-200/50 border border-white"
        >
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">
              Type de projet
            </label>
            <select
              className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
            >
              <option value="immo">Immobilier</option>
              <option value="of">Organisme de formation</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">
              Nom du client
            </label>
            <input
              required
              value={clientName}
              className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
              placeholder="ex: Julien VRC / Stagiaire / Entreprise"
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">
              Nom du dossier (optionnel)
            </label>
            <input
              value={propertyName}
              className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
              placeholder={
                projectType === "immo"
                  ? "ex: Appart Rue Victor Hugo"
                  : "ex: Formation Excel - Mars 2026"
              }
              onChange={(e) => setPropertyName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">
              Email du pro (agent / OF)
            </label>
            <input
              required
              type="email"
              value={brokerEmail}
              className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all"
              placeholder="ex: contact@pro.fr"
              onChange={(e) => setBrokerEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black p-4 font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Générer le lien de suivi"}
          </button>
        </form>

        {message && <div className="mt-6 text-sm font-bold text-zinc-700">{message}</div>}

        {token && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-[2rem] bg-emerald-50 p-6 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 mb-4">
                <CheckCircle2 size={18} />
                <span className="font-bold text-sm">Lien prêt</span>
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600/50 mb-2">
                Lien pour le client
              </p>

              <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-emerald-200 shadow-sm">
                <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-emerald-800">
                  {origin}/track/{token}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`${origin}/track/${token}`)}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  type="button"
                  aria-label="Copier le lien"
                >
                  <LinkIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}