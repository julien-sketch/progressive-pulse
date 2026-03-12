export const metadata = {
  title: "Politique de cookies | Progressive Pulse",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-lg md:p-12">

          <h1 className="text-3xl font-extrabold">
            Politique de cookies
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Dernière mise à jour : 12 mars 2026
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">

            <section>
              <h2 className="text-xl font-bold">1 — Qu’est-ce qu’un cookie ?</h2>
              <p>
                Un cookie est un petit fichier texte déposé sur votre appareil
                lors de la consultation d’un site internet.
              </p>
              <p>
                Les cookies permettent notamment d’assurer le fonctionnement
                technique du site et d’améliorer l’expérience utilisateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">2 — Cookies utilisés</h2>

              <p>La plateforme Progressive Pulse utilise plusieurs types de cookies :</p>

              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>cookies nécessaires au fonctionnement du site</li>
                <li>cookies de sécurité</li>
                <li>cookies de session utilisateur</li>
              </ul>

              <p className="mt-3">
                Ces cookies sont indispensables pour permettre l’accès au service
                et ne peuvent pas être désactivés.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">3 — Cookies tiers</h2>

              <p>
                Certains services tiers utilisés par la plateforme peuvent
                déposer des cookies :
              </p>

              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Stripe (paiement sécurisé)</li>
                <li>Supabase (authentification)</li>
                <li>hébergement technique</li>
              </ul>

              <p className="mt-3">
                Ces cookies sont nécessaires au fonctionnement du service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">4 — Gestion des cookies</h2>

              <p>
                Lors de votre première visite sur le site, un bandeau vous informe
                de l’utilisation des cookies.
              </p>

              <p>
                Vous pouvez accepter ou refuser les cookies non essentiels.
              </p>

              <p>
                Vous pouvez également configurer votre navigateur pour bloquer
                les cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">5 — Contact</h2>

              <p>
                Pour toute question concernant les cookies :
              </p>

              <p className="mt-2 font-semibold">
                support@picqtures.fr
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}