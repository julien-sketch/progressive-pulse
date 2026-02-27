import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Subtle background glow */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-3xl opacity-35 bg-[radial-gradient(circle,rgba(79,70,229,0.18),transparent_60%)]" />
        <div className="absolute top-32 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-25 bg-[radial-gradient(circle,rgba(13,148,136,0.14),transparent_60%)]" />
        <div className="absolute -bottom-60 right-[-120px] h-[560px] w-[560px] rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle,rgba(124,58,237,0.12),transparent_60%)]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white/70 backdrop-blur-md shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between px-5 py-3">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.22)]">
                  P
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-extrabold tracking-tight">
                    Progressive Pulse
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Suivi de dossiers
                  </div>
                </div>
              </div>

              {/* Links */}
              <nav className="hidden md:flex items-center gap-7">
                <a
                  href="#benefices"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Bénéfices
                </a>
                <a
                  href="#demo"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Démo
                </a>
                <a
                  href="#tarifs"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Tarifs
                </a>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <a
                  href="/login"
                  className="hidden sm:inline text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Connexion
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-extrabold text-white
                             bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)]
                             shadow-[0_10px_24px_rgba(79,70,229,0.22)]
                             transition-all duration-200 ease-out
                             hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)]
                             active:translate-y-[1px]"
                >
                  Essayer
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-[92vh] flex items-center justify-center px-6">
        <div className="w-full max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 shadow-sm">
              <span className="size-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Transparence client instantanée
              </span>
              <span className="ml-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-extrabold text-orange-700 ring-1 ring-orange-100">
                Nouveau
              </span>
            </div>

            <h1 className="mt-10 text-5xl md:text-6xl font-extrabold tracking-[-0.02em] leading-[1.06]">
              Offrez une <span className="text-indigo-700">visibilité totale</span> à
              vos clients.
            </h1>

            <p className="mt-8 text-xl font-semibold text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Moins de relances. Moins d’appels. Plus de confiance. Progressive Pulse
              transforme chaque dossier en expérience pro.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/demo"
                className="rounded-2xl px-10 py-5 text-base font-extrabold text-white
                           bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)]
                           shadow-[0_12px_28px_rgba(79,70,229,0.22)]
                           transition-all duration-200 ease-out
                           hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)]"
              >
                Démo
              </a>

              <a
                href="#tarifs"
                className="rounded-2xl border border-[#E2E8F0] bg-white px-10 py-5 text-base font-extrabold text-slate-800
                           hover:bg-slate-50 transition"
              >
                Voir les tarifs
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                {["A", "M", "L", "S"].map((c) => (
                  <div
                    key={c}
                    className="flex size-9 items-center justify-center rounded-full border-2 border-[#F8FAFC] bg-white text-sm font-extrabold text-slate-700 shadow-sm"
                  >
                    {c}
                  </div>
                ))}
              </div>

              <div className="text-base font-extrabold text-slate-700">
                +50 pros utilisent Progressive Pulse
              </div>
            </div>
          </div>

          {/* Visual hero mockup */}
          <div className="mt-16 sm:mt-20 relative">
            <div className="mx-auto max-w-5xl relative">
              {/* Floating status chips */}
              <div className="pp-float absolute left-6 top-8 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-slate-700 ring-1 ring-[#E2E8F0] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <span className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />
                Terminé
              </div>
              <div className="pp-float [animation-delay:250ms] absolute right-10 top-10 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-slate-700 ring-1 ring-[#E2E8F0] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <span className="mr-2 inline-block size-2 rounded-full bg-indigo-600" />
                En cours
              </div>
              <div className="pp-float [animation-delay:500ms] absolute left-10 bottom-10 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-slate-700 ring-1 ring-[#E2E8F0] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <span className="mr-2 inline-block size-2 rounded-full bg-amber-500" />
                Documents reçus
              </div>

              {/* Mockup */}
              <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.10)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    dashboard.progressivepulse.app
                  </div>
                  <div className="h-7 w-16 rounded-lg bg-slate-100 ring-1 ring-[#E2E8F0]" />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-2xl border border-[#E2E8F0] bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold">Dossiers</div>
                      <div className="text-xs font-semibold text-slate-500">
                        Aujourd’hui
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {[
                        { name: "SCI Martin", value: 68 },
                        { name: "Dossier Pereira", value: 38 },
                        { name: "Dossier Nguyen", value: 100 },
                      ].map((d) => (
                        <div
                          key={d.name}
                          className="group rounded-2xl border border-[#E2E8F0] bg-white p-3 transition
                                     hover:shadow-[0_16px_30px_rgba(15,23,42,0.06)]"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-extrabold text-slate-800">
                              {d.name}
                            </div>
                            <div className="text-xs font-semibold text-slate-500 tabular-nums">
                              {d.value}%
                            </div>
                          </div>

                          <div className="mt-2 h-2 w-full rounded-full bg-slate-100 ring-1 ring-[#E2E8F0] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all duration-500 group-hover:brightness-110"
                              style={{ width: `${d.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E2E8F0] bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold">Vue client</div>
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                        Lien public
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                        <div className="text-xs font-semibold text-slate-500">
                          Statut actuel
                        </div>
                        <div className="mt-2 text-sm font-extrabold">
                          En attente de validation
                        </div>

                        <div className="mt-4 group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-600">
                              Progression
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              68%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 ring-1 ring-[#E2E8F0] overflow-hidden">
                            <div className="h-full w-[68%] rounded-full bg-indigo-600 transition-all duration-500 group-hover:w-[72%]" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                        <div className="text-xs font-semibold text-slate-500">
                          Prochaine étape
                        </div>
                        <div className="mt-2 text-sm font-extrabold">
                          Dépôt effectué
                        </div>

                        <div className="mt-4 group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-600">
                              Avancement
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              38%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 ring-1 ring-[#E2E8F0] overflow-hidden">
                            <div className="h-full w-[38%] rounded-full bg-indigo-600 transition-all duration-500 group-hover:w-[45%]" />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-2 rounded-2xl border border-[#E2E8F0] bg-white p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-slate-500">
                            Barre de confiance
                          </div>
                          <div className="text-xs font-semibold text-slate-500">
                            hover
                          </div>
                        </div>
                        <div className="mt-3 group">
                          <div className="h-2 w-full rounded-full bg-slate-100 ring-1 ring-[#E2E8F0] overflow-hidden">
                            <div className="h-full w-[66%] rounded-full bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)] transition-all duration-500 group-hover:w-[72%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px]
                           bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.12),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(13,148,136,0.10),transparent_55%)]
                           blur-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefices" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Valorisez votre relation client.
            </h2>
            <p className="mt-5 text-slate-600 font-semibold leading-relaxed">
              Un client informé est un client serein. Et un client serein recommande.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Réduction des appels",
                desc: "Le client voit l’avancement. Tu reprends ton temps et ta concentration.",
              },
              {
                title: "Satisfaction client",
                desc: "Une expérience claire et pro. Moins de stress, plus de confiance.",
              },
              {
                title: "Image de marque",
                desc: "Tu passes en mode structuré. Tes clients sentent la différence.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-7
                           shadow-[0_20px_60px_rgba(15,23,42,0.06)]
                           transition-all duration-200 ease-out
                           hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.09)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-700 font-extrabold ring-1 ring-indigo-200">
                    ✓
                  </div>
                  <div className="text-lg font-extrabold">{c.title}</div>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-600 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="px-6 py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-[.95fr_1.05fr] md:items-start">
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Aperçu interface
            </div>

            <div className="mt-7 mx-auto max-w-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <Image
                src="/images/mockup-demo.png"
                alt="Interface Progressive Pulse"
                width={600}
                height={900}
                className="w-full h-auto"
              />
            </div>

            <p className="mt-6 text-sm font-semibold text-slate-600 leading-relaxed">
              Ta page client ressemble à une app. Simple. Pro. Lisible.
            </p>

            <div className="mt-8">
              <a
                href="/demo"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4 text-sm font-extrabold text-slate-800 hover:bg-slate-50 transition"
              >
                Ouvrir la démo
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Simple à mettre en place. <span className="text-indigo-700">Redoutable</span> au quotidien.
            </h3>
            <p className="mt-5 text-slate-600 font-semibold max-w-xl leading-relaxed">
              Tu crées un dossier, tu envoies un lien, tu mets à jour les étapes. Le client suit.
            </p>

            <div className="mt-12 space-y-5">
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
                  className="rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-700 font-extrabold ring-1 ring-indigo-200">
                      ●
                    </div>
                    <div>
                      <div className="text-lg font-extrabold">{x.title}</div>
                      <p className="mt-2 text-sm font-semibold text-slate-600 leading-relaxed">
                        {x.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-3xl border border-indigo-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                “Depuis qu’on envoie le lien de suivi, les clients arrêtent de relancer. Ils voient l’avancement. Ça change tout.”
              </p>
              <div className="mt-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                — Dimitri - Courtier
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tarif de lancement.
            </h2>
            <p className="mt-5 text-slate-600 font-semibold leading-relaxed">
              Zéro abonnement mensuel. Tu payes uniquement tes crédits.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 md:items-start">
            <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="text-sm font-extrabold">Single</div>
              <div className="mt-2 text-sm font-semibold text-slate-600">
                1 dossier unique — pour tester
              </div>
              <div className="mt-7 flex items-end gap-2">
                <div className="text-5xl font-extrabold tracking-tight">49€</div>
                <div className="pb-2 text-sm font-extrabold text-slate-600">HT</div>
              </div>

              <div className="mt-7 space-y-3 text-sm font-semibold text-slate-700">
                {[
                  "Accès client illimité",
                  "Barre de progression dynamique",
                  "Stockage sécurisé",
                  "Support pro",
                ].map((x) => (
                  <div key={x} className="flex items-center gap-3">
                    <span className="mt-0.5 size-2 rounded-full bg-indigo-600" />
                    {x}
                  </div>
                ))}
              </div>

              <a
                href="/login"
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 text-sm font-extrabold text-slate-800 hover:bg-slate-50 transition"
              >
                Tester maintenant
              </a>
            </div>

            <div className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-7 shadow-[0_28px_90px_rgba(15,23,42,0.10)]">
              <div className="rounded-3xl bg-white p-7 border border-[#E2E8F0]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-2xl font-extrabold tracking-tight">
                      Pack Lancement
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-500">
                      10 dossiers — recommandé
                    </div>
                  </div>
                  <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 ring-1 ring-indigo-100">
                    Économisez 100€
                  </div>
                </div>

                <div className="mt-7 flex items-end gap-3">
                  <div className="text-5xl font-extrabold tracking-tight">290€</div>
                  <div className="pb-2 text-sm font-extrabold text-slate-600">HT</div>
                  <div className="pb-2 text-sm font-extrabold text-slate-400 line-through">
                    390€
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4">
                  <div className="text-sm font-extrabold text-slate-900">
                    Offre limitée — Pack “valeur”
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-600 leading-relaxed">
                    Moins de relances + une image plus pro = du temps gagné.
                  </p>
                </div>

                <div className="mt-7 space-y-3 text-sm font-semibold text-slate-700">
                  {[
                    "10 Espaces Clients Premium",
                    "Mises à jour illimitées",
                    "Stockage de documents sécurisé",
                    "Support prioritaire",
                  ].map((x) => (
                    <div key={x} className="flex items-center gap-3">
                      <span className="mt-0.5 size-2 rounded-full bg-indigo-600" />
                      {x}
                    </div>
                  ))}
                </div>

                <a
                  href="/login"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-extrabold text-white
                             bg-[linear-gradient(135deg,#4F46E5_0%,#6366F1_60%,#7C3AED_100%)]
                             shadow-[0_12px_28px_rgba(79,70,229,0.22)]
                             transition-all duration-200 ease-out
                             hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.28)]"
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

      {/* FINAL CTA */}
      <section className="px-6 py-28 bg-indigo-700 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Prêt à transformer votre relation client ?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold opacity-95 leading-relaxed">
            Donne à tes clients une visibilité claire. Réduis les relances. Monte en gamme.
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/login"
              className="rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-indigo-700 hover:bg-slate-100 transition"
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

          <div className="mt-10 text-xs font-extrabold uppercase tracking-widest opacity-90">
            Progressive Pulse • Suivi client structuré
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8FAFC] px-6 py-16">
        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-sm font-extrabold">Progressive Pulse</div>
            <p className="mt-4 text-sm font-semibold text-slate-600 leading-relaxed">
              Le suivi de dossiers qui réduit les relances et renforce la confiance client.
            </p>
          </div>

          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Produit
            </div>
            <div className="mt-4 space-y-3">
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
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Accès
            </div>
            <div className="mt-4 space-y-3">
              <a className="block text-sm font-semibold text-slate-600 hover:text-slate-900" href="/login">
                Connexion
              </a>
              <a className="block text-sm font-semibold text-slate-600 hover:text-slate-900" href="/pro">
                Dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl border-t border-[#E2E8F0] pt-8 text-center text-xs font-semibold text-slate-400">
          © {new Date().getFullYear()} Progressive Pulse
        </div>
      </footer>
    </main>
  );
}