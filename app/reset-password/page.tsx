"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const supabase = getSupabaseBrowser();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (password.length < 6) {
      alert("Mot de passe trop court (min 6 caractères)");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Mot de passe mis à jour !");
    router.push("/pro");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-zinc-100">
        <h1 className="text-2xl font-black text-center">
          Nouveau mot de passe
        </h1>

        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full rounded-2xl border border-zinc-200 px-4 py-3 font-semibold"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-black text-white py-3 font-black hover:bg-zinc-800 transition"
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </div>
    </div>
  );
}