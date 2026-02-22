export default function StripeCancelPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 pt-20 text-zinc-900">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl border border-zinc-100 text-center">
        <h1 className="text-2xl font-black tracking-tight">Paiement annulé</h1>
        <p className="mt-3 text-sm font-semibold text-zinc-600">
          Aucun débit n’a été effectué.
        </p>

        <div className="mt-6 space-y-3">
          <a
            href="/pro"
            className="block w-full rounded-2xl bg-black p-4 font-black text-white hover:bg-zinc-800 transition"
          >
            Retour au dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
