"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Project = {
  id: string;
  client_name: string;
  progress_percent: number;
  status_text: string;
  access_token: string;
};

type Step = {
  order_index: number;
  label: string;
  is_completed: boolean;
  // NOTE: ton code utilise step.project_id plus bas,
  // donc on le déclare pour éviter les surprises TypeScript.
  project_id: string;
};

export default function ProPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stepsMap, setStepsMap] = useState<Record<string, Step[]>>({});
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserEmail(user.email ?? "");

      // 🔹 récupérer les projets du pro
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("broker_email", user.email);

      if (projectsError) {
        console.error("Erreur chargement projects:", projectsError);
        setLoading(false);
        return;
      }

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        setStepsMap({});
        setLoading(false);
        return;
      }

      setProjects(projectsData);

      // 🔹 récupérer les étapes pour chaque projet
      const projectIds = projectsData.map((p) => p.id);

      const { data: stepsData, error: stepsError } = await supabase
        .from("steps")
        .select("*")
        .in("project_id", projectIds)
        .order("order_index", { ascending: true });

      if (stepsError) {
        console.error("Erreur chargement steps:", stepsError);
        setStepsMap({});
        setLoading(false);
        return;
      }

      if (stepsData) {
        const map: Record<string, Step[]> = {};
        stepsData.forEach((step: Step) => {
          const pid = step.project_id;
          if (!map[pid]) map[pid] = [];
          map[pid].push(step);
        });
        setStepsMap(map);
      }

      setLoading(false);
    };

    load();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  const stripeCheckoutUrl = `https://buy.stripe.com/eVq8wQ3kJ7vWc2x58veIw00?prefilled_email=${encodeURIComponent(
    userEmail || ""
  )}`;

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-black">Mes dossiers</h1>

        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-3xl bg-white p-6 shadow border border-zinc-100"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-bold text-lg">{project.client_name}</h2>
                <p className="text-sm text-zinc-500">{project.status_text}</p>
              </div>

              <a
                href={`/track/${project.access_token}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold underline"
              >
                Voir lien client
              </a>
            </div>

            {/* 🔹 LISTE DES ETAPES */}
            <div className="space-y-2">
              {(stepsMap[project.id] || []).map((step) => (
                <div
                  key={step.order_index}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold ${
                    step.is_completed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-50 text-zinc-700"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full ${
                      step.is_completed ? "bg-emerald-500" : "bg-zinc-300"
                    }`}
                  />
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 🔹 BOUTON ACHAT PACK */}
        <div className="mt-10 text-center">
          <a
            href={stripeCheckoutUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-2xl bg-black text-white px-6 py-3 font-bold hover:bg-zinc-800 transition"
          >
            Acheter des dossiers
          </a>
        </div>
      </div>
    </div>
  );
}