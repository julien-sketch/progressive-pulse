export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f7f6] text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[#e77e23]/10 bg-[#f8f7f6]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#e77e23] text-white font-extrabold">
              P
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight">Progressive Pulse</div>
              <div className="text-[11px] font-semibold text-slate-500">Suivi de dossiers</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-2xl bg-[#e77e23] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#e77e23]/90 transition"
            >
              Essai / Connexion
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 pt-16 pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.05fr_.95fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e77e23]/15 bg-white px-4 py-2">
                <span className="size-2 rounded-full bg-[#e77e23]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  Transparence client instantanée
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight leading-tight md:text-5xl">
                Offrez une{" "}
                <span className="text-[#e77e23]">visibilité totale</span> à vos clients.
              </h1>

              <p className="mt-5 max-w-xl text-lg font-semibold text-slate-600">
                Moins de relances. Moins d’appels. Plus de confiance.
                Progressive Pulse transforme chaque dossier en expérience pro.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#e77e23] px-7 py-4 text-sm font-extrabold text-white hover:bg-[#e77e23]/90 transition"
                >
                  Démo
                </a>

                <a
                  href="#tarifs"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-extrabold text-slate-800 hover:bg-slate-50 transition"
                >
                  Voir les tarifs
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-2">
                  {["A", "M", "L", "S"].map((c) => (
                    <div
                      key={c}
                      className="flex size-8 items-center justify-center rounded-full border-2 border-[#f8f7f6] bg-white text-xs font-extrabold text-slate-700 shadow-sm"
                    >
                      {c}
                    </div>
                  ))}
                </div>
                <div className="text-sm font-extrabold text-slate-700">
                  +50 pros utilisent Progressive Pulse
                </div>
                
              </div>
            </div>

            {/* Mockup card */}
            <div className="rounded-3xl border border-[#e77e23]/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Exemple dossier client
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                  En cours
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-[#f8f7f6] p-4">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold">Référence #FR-992834-X</div>
                  <div className="text-sm font-extrabold text-[#e77e23]">65%</div>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white">
                  <div className="h-full w-[65%] rounded-full bg-[#e77e23]" />
                </div>
                <div className="mt-3 text-sm font-semibold text-slate-600">
                  Statut : <span className="font-extrabold">Analyse en cours</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs font-extrabold text-slate-400">Étape</div>
                    <div className="mt-1 text-sm font-extrabold">3 / 4</div>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs font-extrabold text-slate-400">Mise à jour</div>
                    <div className="mt-1 text-sm font-extrabold">il y a 2h</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { t: "Reçu", ok: true },
                  { t: "Vérif.", ok: true },
                  { t: "Analyse", ok: true },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="rounded-2xl border border-slate-200 bg-white p-3 text-center"
                  >
                    <div className="text-xs font-extrabold text-slate-500">{x.t}</div>
                    <div className="mt-1 text-xs font-extrabold text-emerald-700">OK</div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Le client suit l’avancement sans t’appeler.
              </p>
            </div>
          </div>

          {/* Logos */}
          <div className="mt-12 border-t border-[#e77e23]/10 pt-10">
            <div className="text-center text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Utilisé par des professionnels (courtiers, immo, OF, freelances…)
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {["Courtier", "Immobilier", "Organisme de formation", "Artisan", "Freelance", "Agence"].map((l) => (
                <div
                  key={l}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-600"
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefices" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Valorisez votre relation client.
            </h2>
            <p className="mt-4 text-slate-600 font-semibold">
              Un client informé est un client serein. Et un client serein recommande.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Réduction des appels",
                desc:
                  "Le client voit l’avancement. Tu reprends ton temps et ta concentration.",
              },
              {
                title: "Satisfaction client",
                desc:
                  "Une expérience claire et pro. Moins de stress, plus de confiance.",
              },
              {
                title: "Image de marque",
                desc:
                  "Tu passes en mode structuré. Tes clients sentent la différence.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-slate-200 bg-[#f8f7f6] p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-[#e77e23]/10 text-[#e77e23] font-extrabold">
                    ✓
                  </div>
                  <div className="text-lg font-extrabold">{c.title}</div>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO / FEATURES LIST (comme la page modèle) */}
      <section id="demo" className="px-6 py-16 bg-[#f8f7f6]">
        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-[.95fr_1.05fr] md:items-start">
          {/* left "screenshot" placeholder */}
          <div className="rounded-3xl border border-[#e77e23]/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Aperçu interface
            </div>
            <div className="mt-5 h-64 w-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center">
              <div className="text-sm font-extrabold text-slate-500">
                (capture produit à ajouter)
              </div>
            </div>
            <p className="mt-5 text-sm font-semibold text-slate-600">
              Ta page client ressemble à une app. Simple. Pro. Lisible.
            </p>
          </div>

          {/* right list */}
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">
              Simple à mettre en place. Redoutable au quotidien.
            </h3>
            <p className="mt-4 text-slate-600 font-semibold max-w-xl">
              Tu crées un dossier, tu envoies un lien, tu mets à jour les étapes. Le client suit.
            </p>

            <div className="mt-10 space-y-4">
              {[
                {
                  title: "Barre de progression automatique",
                  desc: "Chaque mise à jour d’étape ajuste le statut et le %.",
                },
                {
                  title: "Collecte de documents",
                  desc: "Le client dépose ses fichiers directement sur son dossier.",
                },
                {
                  title: "Contact direct & feedback",
                  desc: "Le client contacte le pro sans friction (mail / téléphone).",
                },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-[#e77e23]/10 text-[#e77e23] font-extrabold">
                      ●
                    </div>
                    <div>
                      <div className="text-lg font-extrabold">{x.title}</div>
                      <p className="mt-2 text-sm font-semibold text-slate-600">{x.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* quote */}
            <div className="mt-10 rounded-3xl border border-[#e77e23]/15 bg-white p-6">
              <p className="text-sm font-semibold text-slate-700">
                “Depuis qu’on envoie le lien de suivi, les clients arrêtent de relancer.
                Ils voient l’avancement. Ça change tout.”
              </p>
              <div className="mt-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                — Dimitri - Courtier
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section id="tarifs" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Tarifs simples.</h2>
            <p className="mt-4 text-slate-600 font-semibold">
              Tu paies que ce que tu consommes. 1 dossier créé = 1 crédit. Pas d’usine à gaz.
            </p>
          </div>

          <section id="tarifs" className="bg-white px-6 py-16">
  <div className="mx-auto max-w-6xl">
    <div className="max-w-2xl">
      <h2 className="text-3xl font-extrabold tracking-tight">Tarif de lancement.</h2>
      <p className="mt-4 text-slate-600 font-semibold">
        Offre limitée aux 5 premiers partenaires. Zéro abonnement mensuel, tu payes uniquement tes crédits.
      </p>
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-[1fr_420px] md:items-start">
      {/* Col gauche: rappel / ROI */}
      <div className="rounded-3xl border border-slate-200 bg-[#f8f7f6] p-8">
        <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Pourquoi ce pack
        </div>

        <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
          <li className="flex items-start gap-3">
            <span className="mt-1 size-2 rounded-full bg-[#e77e23]" />
            Une expérience client claire = moins de relances.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 size-2 rounded-full bg-[#e77e23]" />
            Une image structurée = plus de confiance.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 size-2 rounded-full bg-[#e77e23]" />
            10 dossiers = tu testes “en conditions réelles” sans abonnement.
          </li>
        </ul>

        <div className="mt-8 rounded-2xl border border-[#e77e23]/15 bg-white p-5">
          <div className="text-sm font-extrabold">Conseil simple</div>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Mets Progressive Pulse sur 10 dossiers actifs. Tu verras immédiatement la baisse de sollicitations.
          </p>
        </div>
      </div>

      {/* Col droite: Carte Pack */}
      <div className="rounded-[2rem] border border-[#e77e23]/15 bg-[#f8f7f6] p-6 shadow-sm">
        <div className="rounded-[1.75rem] bg-white p-7 border border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-extrabold tracking-tight">
                Pack Lancement <span className="align-middle">🚀</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-500">
                Offre limitée aux 5 premiers partenaires
              </div>
            </div>
            <div className="rounded-full bg-[#e77e23]/10 px-3 py-1 text-xs font-extrabold text-[#e77e23]">
              Early
            </div>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <div className="text-5xl font-extrabold tracking-tight">390€</div>
            <div className="pb-2 text-sm font-extrabold text-slate-600">/ 10 dossiers</div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              "10 Espaces Clients Premium",
              "Mises à jour illimitées",
              "Stockage de documents sécurisé",
              "Zéro abonnement mensuel",
            ].map((x) => (
              <div key={x} className="flex items-center gap-3">
                <div className="flex size-6 items-center justify-center rounded-full bg-[#e77e23]/10">
                  <span className="text-[#e77e23] font-extrabold">✓</span>
                </div>
                <div className="text-sm font-semibold text-slate-700">{x}</div>
              </div>
            ))}
          </div>

          <a
            href="/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#e77e23] px-6 py-4 text-sm font-extrabold text-white hover:bg-[#e77e23]/90 transition"
          >
            Réserver mes crédits
          </a>

          <p className="mt-4 text-xs font-semibold text-slate-500">
            Vous serez redirigé vers votre espace pour finaliser l’achat.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20 bg-[#e77e23] text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight">Prêt à transformer votre relation client ?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold opacity-95">
            Donne à tes clients une visibilité claire. Réduis les relances. Monte en gamme.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/login"
              className="rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-[#e77e23] hover:bg-slate-100 transition"
            >
              Commencer maintenant
            </a>
            <a
              href="/demo"
              className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-extrabold text-white hover:bg-white/15 transition"
            >
              Découvrir la démo
            </a>
          </div>

          <div className="mt-8 text-xs font-extrabold uppercase tracking-widest opacity-90">
            Progressive Pulse • Suivi client structuré
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f8f7f6] px-6 py-14">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-sm font-extrabold">Progressive Pulse</div>
            <p className="mt-3 text-sm font-semibold text-slate-600">
              Le suivi de dossiers qui réduit les relances et renforce la confiance client.
            </p>
          </div>

          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Produit</div>
            <div className="mt-3 space-y-2">
              <a className="block text-sm font-semibold text-slate-600 hover:text-slate-900" href="#benefices">
                Bénéfices
              </a>
              <a className="block text-sm font-semibold text-slate-600 hover:text-slate-900" href="/demo">
                Démo
              </a>
              <a className="block text-sm font-semibold text-slate-600 hover:text-slate-900" href="#tarifs">
                Tarifs
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Accès</div>
            <div className="mt-3 space-y-2">
              <a className="block text-sm font-semibold text-slate-600 hover:text-slate-900" href="/login">
                Connexion
              </a>
              <a className="block text-sm font-semibold text-slate-600 hover:text-slate-900" href="/pro">
                Dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-[#e77e23]/10 pt-8 text-center text-xs font-semibold text-slate-400">
          © {new Date().getFullYear()} Progressive Pulse
        </div>
      </footer>
    </main>
  );
}