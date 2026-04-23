export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        <div className="absolute -top-48 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(15,23,42,0.10),transparent_60%)] opacity-30 blur-3xl" />
        <div className="absolute -left-40 top-1/2 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.12),transparent_60%)] opacity-25 blur-3xl" />
      </div>

      <div className="bg-slate-900 px-4 py-2.5 text-center text-xs font-extrabold tracking-wide text-white">
        🎁 Créez votre compte et testez Progressive Pulse avec 1 dossier offert — sans carte bancaire
      </div>

      <header className="sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white/88 backdrop-blur-md">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 font-extrabold text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)]">
                  P
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-extrabold tracking-tight">
                    Progressive Pulse
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Suivi client partageable
                  </div>
                </div>
              </div>

              <nav className="hidden items-center gap-6 md:flex">
                {[
                  ["Comment ça marche", "#how"],
                  ["Pour qui", "#for"],
                  ["Pourquoi", "#why"],
                  ["Cas d’usage", "#use-cases"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <a
                  href="/login"
                  className="hidden text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 sm:inline"
                >
                  Connexion
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5"
                >
                  🎁 1 dossier offert
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="flex min-h-[88vh] items-center px-6 pb-24 pt-14">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Suivi client sans compte à créer
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-[60px]">
                Le suivi client simple
                <br />
                pour les professionnels
                <br />
                <span className="text-slate-500">
                  qui gèrent des dossiers.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-500">
                Progressive Pulse permet de partager à vos clients un suivi clair
                via un simple lien. Aucun compte client à créer. Moins de
                relances. Plus de confiance. 1 dossier offert à l’inscription.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/signup"
                  className="rounded-2xl bg-slate-900 px-8 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5"
                >
                  🎁 Créer mon compte — 1 dossier offert
                </a>
                <a
                  href="#use-cases"
                  className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
                >
                  Voir les cas d’usage
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                {[
                  "Aucun compte client requis",
                  "Aucun abonnement",
                  "Crédits sans expiration",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"
                  >
                    <span className="text-emerald-500">✓</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-5">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      Expérience client
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      Ce que reçoit votre client
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600">
                    Sans compte
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">
                        Dossier client
                      </div>
                      <div className="mt-0.5 text-xs font-semibold text-slate-400">
                        Client : Sophie Martin
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-extrabold text-white">
                      En cours
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="mb-2 flex justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Avancement
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        50%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-1/2 rounded-full bg-slate-900" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      "Prise en charge",
                      "Documents reçus",
                      "Analyse en cours",
                      "Validation finale",
                    ].map((label, i) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                      >
                        <div
                          className={`flex size-6 items-center justify-center rounded-full text-[10px] font-extrabold ${
                            i < 2
                              ? "bg-slate-900 text-white"
                              : i === 2
                              ? "border-2 border-slate-700 bg-white text-slate-900"
                              : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {i < 2 ? "✓" : ""}
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            i < 2
                              ? "text-slate-400 line-through"
                              : i === 2
                              ? "font-extrabold text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {label}
                        </span>
                        {i === 2 && (
                          <span className="ml-auto text-[10px] font-extrabold text-slate-500">
                            En cours
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-center text-xs font-semibold text-slate-400">
                  Clair pour le client. Léger pour vous.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-6 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { num: "0 compte", label: "côté client" },
            { num: "1 lien", label: "à envoyer" },
            { num: "10 sec", label: "pour démarrer" },
            { num: "1 dossier offert", label: "à l’inscription" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">
                {stat.num}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-500">
                Le vrai problème
              </span>
            </div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Quand le client ne voit rien,
              <br />
              il relance.
            </h2>
            <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-slate-500">
              Le manque de visibilité crée des appels inutiles, use la confiance
              et vous fait paraître moins structuré que vous ne l’êtes
              réellement.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: "Les clients demandent des nouvelles",
                desc: "Pas parce qu’ils sont compliqués. Parce qu’ils n’ont aucune visibilité.",
              },
              {
                title: "Le flou abîme la confiance",
                desc: "Quand le client ne voit rien, il imagine le pire : retard, oubli, manque de suivi.",
              },
              {
                title: "Les relances volent du temps",
                desc: "Chaque appel ou message inutile vous coupe dans vos vraies priorités.",
              },
              {
                title: "Vous pouvez être bon sans paraître structuré",
                desc: "Sans suivi visible, même un bon professionnel paraît moins solide qu’il ne l’est.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)]"
              >
                <div className="mb-1 text-sm font-extrabold text-slate-900">
                  {item.title}
                </div>
                <p className="text-sm font-semibold leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Comment ça marche
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              3 étapes pour rendre vos dossiers
              <br />
              lisibles côté client.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Créer",
                desc: "Vous créez un dossier en quelques secondes.",
              },
              {
                num: "02",
                title: "Partager",
                desc: "Vous envoyez un lien unique à votre client.",
              },
              {
                num: "03",
                title: "Rassurer",
                desc: "Le client suit l’avancement sans vous relancer.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 shadow-[0_4px_24px_rgba(15,23,42,0.04)]"
              >
                <div className="absolute bottom-2 right-3 select-none text-[80px] font-extrabold leading-none text-slate-100">
                  {item.num}
                </div>
                <div className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  {item.num}
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm font-semibold leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="for" className="bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Pour qui
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Conçu pour les professionnels
              <br />
              qui gèrent des dossiers clients.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <a
              href="https://agents-immobiliers.progressive-pulse.fr"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1"
            >
              <div className="mb-3 text-sm font-extrabold text-slate-900">
                Agents immobiliers / mandataires
              </div>
              <p className="text-sm font-semibold leading-7 text-slate-500">
                Donnez à vos clients une vraie visibilité sur leur vente, du
                mandat à l’acte, sans relances inutiles.
              </p>
              <div className="mt-6 text-sm font-extrabold text-slate-900">
                Voir la page dédiée →
              </div>
            </a>

            <a
              href="https://organismes-formations.progressive-pulse.fr"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1"
            >
              <div className="mb-3 text-sm font-extrabold text-slate-900">
                Organismes de formation
              </div>
              <p className="text-sm font-semibold leading-7 text-slate-500">
                Rendez vos dossiers plus lisibles pour vos clients, des pièces
                demandées jusqu’à la validation et au paiement.
              </p>
              <div className="mt-6 text-sm font-extrabold text-slate-900">
                Voir la page dédiée →
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id="use-cases" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                Pourquoi c’est utile
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Pas un outil de gestion interne de plus.
              <br />
              Un outil de clarté côté client.
            </h2>
            <p className="mt-4 mx-auto max-w-2xl font-semibold leading-relaxed text-slate-500">
              Les outils classiques gèrent votre activité en interne.
              Progressive Pulse rend votre suivi compréhensible pour votre
              client final.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: "Le client voit l’avancement",
                desc: "Une progression claire, consultable à tout moment.",
              },
              {
                title: "Aucun compte à créer",
                desc: "Le client ouvre simplement un lien. Zéro mot de passe. Zéro friction.",
              },
              {
                title: "Moins de relances inutiles",
                desc: "Vous réduisez les appels de statut et gardez votre temps pour traiter les vrais sujets.",
              },
              {
                title: "Une image plus professionnelle",
                desc: "Vous donnez une expérience plus claire et plus rassurante, sans complexité.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6"
              >
                <div className="mb-1 text-sm font-extrabold text-slate-900">
                  {item.title}
                </div>
                <p className="text-sm font-semibold leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-28 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Faites comprendre à vos clients
            <br />
            que leur dossier avance.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-semibold leading-relaxed text-slate-300">
            Un lien. Une progression claire. Moins de relances. Plus de
            confiance. Commencez gratuitement avec 1 dossier offert à
            l’inscription.
          </p>
          <div className="mb-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className="rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-slate-900 transition hover:bg-slate-100"
            >
              🎁 Créer mon compte — 1 dossier offert
            </a>
            <a
              href="#for"
              className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-extrabold text-white transition hover:bg-white/10"
            >
              Voir les cas d’usage
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              "1 dossier offert sans CB",
              "Aucun abonnement",
              "Aucun compte client requis",
            ].map((item) => (
              <span key={item} className="text-xs font-semibold opacity-80">
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}