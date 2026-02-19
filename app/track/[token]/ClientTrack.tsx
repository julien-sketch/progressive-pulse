"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { FileUp, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";

type Project = {
  client_name: string;
  progress_percent: number;
  status_text: string;
  created_at: string | null;
  broker_email: string;
  drive_folder_url: string | null;
  access_token: string;
};

type DebugInfo = {
  tokenProp: string;
  apiUrl: string;
  status: number | null;
  json: any;
  step: "idle" | "fetching" | "done";
};

export default function ClientTrack({ token }: { token: string }) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [debug, setDebug] = useState<DebugInfo>({
    tokenProp: token,
    apiUrl: "",
    status: null,
    json: null,
    step: "idle",
  });

  useEffect(() => {
    const run = async () => {
      const cleanToken = String(token ?? "").trim();
      const apiUrl = `/api/track/${encodeURIComponent(cleanToken)}`;

      setDebug((d) => ({
        ...d,
        tokenProp: cleanToken,
        apiUrl,
        status: null,
        json: null,
        step: "fetching",
      }));

      setLoading(true);
      setNotFound(false);

      if (!cleanToken) {
        setDebug((d) => ({
          ...d,
          status: 400,
          json: { error: "Token is empty in ClientTrack prop" },
          step: "done",
        }));
        setNotFound(true);
        setProject(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(apiUrl, { cache: "no-store" });
        const json = await res.json().catch(() => ({ error: "Invalid JSON" }));

        setDebug((d) => ({
          ...d,
          status: res.status,
          json,
          step: "done",
        }));

        if (res.status === 404) {
          setNotFound(true);
          setProject(null);
          return;
        }

        if (!res.ok) {
          setNotFound(true);
          setProject(null);
          return;
        }

        setProject(json.project as Project);
      } catch (err: any) {
        setDebug((d) => ({
          ...d,
          status: 0,
          json: { error: "Fetch failed", details: String(err?.message ?? err) },
          step: "done",
        }));
        setNotFound(true);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    setUploading(true);
    setUploadSuccess(false);

    const fileExt = file.name.split(".").pop() || "bin";
    const safeClientName = String(project.client_name || "client")
      .trim()
      .replace(/[\/\\?#%*:|"<>]/g, "-");
    const fileName = `${safeClientName}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("client-documents")
      .upload(fileName, file, { upsert: false });

    setUploading(false);

    if (error) {
      alert("Erreur lors de l'envoi : " + error.message);
      return;
    }

    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 5000);
  };

  // 🔎 Bandeau debug visible (tu pourras le retirer après)
  const DebugBanner = () => (
    <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-xs text-yellow-900">
      <div className="font-bold">DEBUG TRACK</div>
      <div className="mt-2 space-y-1">
        <div>
          <span className="font-semibold">tokenProp:</span> {String(debug.tokenProp)}
        </div>
        <div>
          <span className="font-semibold">apiUrl:</span> {debug.apiUrl}
        </div>
        <div>
          <span className="font-semibold">status:</span> {String(debug.status)}
        </div>
        <div className="mt-2">
          <span className="font-semibold">json:</span>
          <pre className="mt-1 max-h-48 overflow-auto rounded-lg bg-white p-2 text-[11px]">
            {JSON.stringify(debug.json, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F5F5F7] px-6">
        <div className="w-full max-w-md">
          <DebugBanner />
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-4 text-sm font-medium text-gray-500">
              Récupération de votre dossier...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F5F5F7] px-6">
        <div className="w-full max-w-md">
          <DebugBanner />
          <div className="mx-auto w-full overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/80 p-8 text-center shadow-2xl shadow-gray-200/50 backdrop-blur-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-black">Lien invalide</h1>
            <p className="mt-3 text-sm font-medium text-gray-500">
              Ce dossier n’existe pas ou n’est plus accessible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] px-6 pb-12 pt-16 font-sans text-gray-900">
      <div className="mx-auto max-w-md">
        <DebugBanner />

        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black">ProgressivePrêt</h1>
          <p className="mt-2 font-medium text-gray-500">
            Suivi de dossier • {project.client_name}
          </p>
        </header>

        <main className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/80 p-8 shadow-2xl shadow-gray-200/50 backdrop-blur-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-gray-800">
              {project.status_text}
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-400">
              Dernière actualisation :{" "}
              {project.created_at ? new Date(project.created_at).toLocaleDateString("fr-FR") : "-"}
            </p>
          </div>

          <div className="relative mb-4 h-5 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-emerald-400 to-green-400 transition-all duration-1000 ease-out"
              style={{ width: `${project.progress_percent}%` }}
            />
          </div>

          <div className="flex justify-between px-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Signature</span>
            <span className="text-blue-500">{project.progress_percent}%</span>
            <span>Remise des clés</span>
          </div>

          <div className="mt-12 space-y-4">
            <label
              className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl p-4 font-bold transition-all active:scale-95 shadow-lg ${
                uploadSuccess ? "bg-green-500 text-white" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : uploadSuccess ? (
                <CheckCircle2 size={20} />
              ) : (
                <FileUp size={20} />
              )}

              <span>{uploading ? "Envoi..." : uploadSuccess ? "Document reçu !" : "Ajouter un document"}</span>

              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>

            <a
              href={`mailto:${project.broker_email}?subject=${encodeURIComponent(
                `Question sur mon dossier ${project.client_name}`
              )}`}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
            >
              <MessageCircle size={20} />
              Contacter mon courtier
            </a>
          </div>
        </main>

        <footer className="mt-16 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
            Propulsé par ProgressivePulse
          </p>
        </footer>
      </div>
    </div>
  );
}
