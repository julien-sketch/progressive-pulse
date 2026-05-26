"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function CheckoutPage() {
  const [message, setMessage] = useState("Vérification de votre session...");

  useEffect(() => {
    async function startCheckout() {
      const supabase = getSupabaseBrowser();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");

      if (!session?.user) {
        window.location.href = `/login?redirect=${encodeURIComponent(
          `/checkout?plan=${plan || ""}`
        )}`;
        return;
      }

      if (!plan) {
        setMessage("Plan invalide.");
        return;
      }

      setMessage("Redirection vers le paiement sécurisé...");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const text = await res.text();

let data: any = {};
try {
  data = text ? JSON.parse(text) : {};
} catch {
  data = { error: text || "Erreur serveur inconnue." };
}

      if (!res.ok || !data.url) {
        setMessage(data.error || "Erreur lors de la création du paiement.");
        return;
      }

      window.location.href = data.url;
    }

    startCheckout();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-900">{message}</p>
      </div>
    </main>
  );
}