import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
          <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xl border border-zinc-100 font-bold text-zinc-700">
            Connexion en cours...
          </div>
        </div>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}