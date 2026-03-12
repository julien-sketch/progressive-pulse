"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem("cookie-consent", "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-3xl -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
      <p className="text-sm text-slate-700">
        Ce site utilise des cookies pour assurer le bon fonctionnement du service.
        Consultez notre{" "}
        <Link href="/cookies" className="font-bold text-indigo-600">
          politique de cookies
        </Link>.
      </p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={accept}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-white font-semibold"
        >
          Accepter
        </button>

        <button
          onClick={refuse}
          className="rounded-xl border px-4 py-2 font-semibold"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}