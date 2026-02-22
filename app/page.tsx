import Image from "next/image";
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, Star } from "lucide-react";

export default function Home() {
  // ✅ On envoie vers /pro (si pas connecté => /login)
  const CTA_LINK = "/pro";

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-950 selection:bg-blue-100">
      {/* Navigation Minimaliste */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <span className="text-xl font-bold tracking-tighter italic">ProgressivePrêt</span>
        <a
          href={CTA_LINK}
          className="text-sm font-semibold bg-zinc-900 text-white px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-all"
        >
          Démarrer maintenant
        </a>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Star size={14} fill="currentColor" />
            <span>Le nouveau standard du courtage</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Divisez vos appels <br />
            <span className="text-zinc-400">clients par deux.</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Offrez à vos emprunteurs une interface de suivi premium et collectez vos documents 2x plus vite. Libérez vos week-ends.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CTA_LINK}
              className="flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-8 text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-zinc-200"
            >
              Commander mon Pack 10 Dossiers
              <ArrowRight size={18} />
            </a>
          </div>

          <p className="mt-4 text-xs font-semibold text-zinc-500">
            Étape 1 : connexion • Étape 2 : achat • Étape 3 : création de dossiers
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-32">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 text-zinc-900">
              <Clock size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Mise à jour en 1 clic</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Mettez à jour la barre de progression directement depuis votre email, sans jamais vous connecter.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 text-zinc-900">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Image de Marque</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Une interface "Apple-style" qui rassure vos clients et justifie vos honoraires de courtage.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 text-zinc-900">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Zéro Friction</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Vos clients n'ont rien à installer. Un lien magique unique, accessible sur mobile en 1 seconde.
            </p>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="max-w-md mx-auto">
          <div className="relative overflow-hidden bg-zinc-950 rounded-[3rem] p-10 text-white shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Image src="/next.svg" alt="Next.js" width={120} height={30} className="invert" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pack Lancement 🚀</h2>
            <p className="text-zinc-400 mb-8 text-sm">Offre limitée aux 5 premiers partenaires</p>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black">390€</span>
              <span className="text-zinc-400">/ 10 dossiers</span>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                "10 Espaces Clients Premium",
                "Mises à jour illimitées",
                "Stockage de documents sécurisé",
                "Support prioritaire WhatsApp",
                "Zéro abonnement mensuel",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 size={16} className="text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={CTA_LINK}
              className="block w-full bg-white text-zinc-950 text-center py-4 rounded-2xl font-bold hover:bg-zinc-100 transition-colors shadow-lg"
            >
              Réserver mes crédits
            </a>

            <p className="mt-4 text-xs font-semibold text-zinc-400">
              Vous serez redirigé vers votre espace pour finaliser l’achat.
            </p>
          </div>
        </section>
      </main>

      <footer className="text-center py-12 border-t border-zinc-100 text-zinc-400 text-[10px] uppercase tracking-[0.2em]">
        © 2026 ProgressivePrêt — Propulsé par ProgressivePulse
      </footer>
    </div>
  );
}