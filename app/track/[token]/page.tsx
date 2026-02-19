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

export default function ClientTrackPage({ params }: { params: { token: string } }) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetch(`/api/track/${params.token}`, {
          cache: "no-store",
        });

        if (res.status === 404) {
          setNotFound(true);
          setProject(null);
          return;
        }

        const json = await res.json();

        if (!res.ok) {
          console.error("Track API error:", json);
          setNotFound(true);
          setProject(null);
          return;
        }

        setProject(json.project);
      } catch (err) {
        console.error(err);
        setNotFound(true);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.token]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    setUploading(true);
    setUploadSuccess(false);

    const fileExt = file.name.split(".").pop() || "bin";

    const safeClientName = project.client_name
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
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F7]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-2xl font-bold">Lien invalide</h1>
          <p className="mt-2 text-gray-500">
            Ce dossier n’existe pas ou n’est plus accessible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] px-6 pt-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-3xl font-bold">ProgressivePrêt</h1>
        <p className="mt-2 text-center text-gray-500">
          Suivi de dossier • {project.client_name}
        </p>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="text-xl font-semibold">{project.status_text}</h2>

          <div className="mt-6 h-4 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-green-400 transition-all"
              style={{ width: `${project.progress_percent}%` }}
            />
          </div>

          <div className="mt-2 text-sm text-blue-600">
            {project.progress_percent}%
          </div>

          <div className="mt-8 space-y-4">
            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-black p-4 text-white">
              {uploading ? (
                <Loader2 className="animate-spin" />
              ) : uploadSuccess ? (
                <CheckCircle2 />
              ) : (
                <FileUp />
              )}
              <span>
                {uploading
                  ? "Envoi..."
                  : uploadSuccess
                  ? "Document reçu"
                  : "Ajouter un document"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
              />
            </label>

            <a
              href={`mailto:${project.broker_email}`}
              className="flex items-center justify-center gap-3 rounded-2xl border p-4"
            >
              <MessageCircle />
              Contacter mon courtier
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
