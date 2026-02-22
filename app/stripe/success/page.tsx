export default function StripeSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 pt-20 text-zinc-900">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl border border-zinc-100 text-center">
        <h1 className="text-2xl font-black tracking-tight">Paiement validé ✅</h1>

        <p className="mt-3 text-sm font-semibold text-zinc-600">
          Vos crédits sont en cours d’activation.
          <br />
          Retournez sur votre dashboard pour les voir.
        </p>

        <div className="mt-6 space-y-3">
          <a
            href="/pro"
            className="block w-full rounded-2xl bg-black p-4 font-black text-white hover:bg-zinc-800 transition"
          >
            Retour au dashboard
          </a>

          <a
            href="/login"
            className="block w-full rounded-2xl border border-zinc-200 bg-white p-4 font-black text-zinc-800 hover:bg-zinc-50 transition"
          >
            Me reconnecter
          </a>
        </div>

        <p className="mt-6 text-xs font-semibold text-zinc-400">
          Si vous ne voyez pas les crédits immédiatement : rafraîchissez la page /pro.
        </p>
      </div>
    </div>
  );
}