"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function normalizePhoneForStore(v: string) {
  // On stocke lisible. On nettoie juste les espaces doubles.
  return v.replace(/\s+/g, " ").trim();
}

export default function ProjectContactEditor(props: {
  projectId: string;
  initialEmail: string | null;
  initialPhone: string | null;
}) {
  const supabase = getSupabaseBrowser();

  const [email, setEmail] = useState(props.initialEmail ?? "");
  const [phone, setPhone] = useState(props.initialPhone ?? "");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setOk(null);
    setErr(null);

    const cleanEmail = email.trim();
    const cleanPhone = normalizePhoneForStore(phone);

    const { error } = await supabase
      .from("projects")
      .update({
        broker_email: cleanEmail || null,
        broker_phone: cleanPhone || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", props.projectId);

    if (error) {
      setErr(error.message);
      setSaving(false);
      return;
    }

    setOk("Enregistré");
    setSaving(false);
    setTimeout(() => setOk(null), 2500);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-3 text-sm font-black uppercase tracking-widest text-gray-400">
        Contact client
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-gray-600">Email du pro (visible client)</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: agent@domaine.fr"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600">Téléphone du pro (visible client)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="ex: 06 12 34 56 78"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none focus:border-black"
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="mt-2 w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>

        {ok ? <div className="text-sm font-bold text-green-600">{ok}</div> : null}
        {err ? <div className="text-sm font-bold text-red-600">{err}</div> : null}
      </div>
    </div>
  );
}