'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Quote, ChevronRight } from 'lucide-react';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import StatsCounter from '@/components/StatsCounter';
import NewsCard from '@/components/NewsCard';
import OrganismeCard from '@/components/OrganismeCard';
import AnimatedSection from '@/components/AnimatedSection';
import { actualites } from '@/data/actualites';
import { organismes } from '@/data/organismes';
import { ministere } from '@/data/ministere';

const flashMessages = [
  'Lancement du Programme Tchad Numerique 2030 - Investissement de 1,5 milliard USD',
  'Phase 2 du deploiement de la fibre optique a N\'Djamena achevee',
  'L\'ENASTIC ouvre les inscriptions pour 5 000 nouveaux etudiants en TIC',
  'Nouveau cadre reglementaire pour les telecommunications adopte par l\'ARCEP',
];

export default function Home() {
  const actualitesRecentes = actualites.slice(0, 6);
  const actualiteVedette = actualites.find((a) => a.vedette);
  const autresActualites = actualitesRecentes.filter((a) => a.id !== actualiteVedette?.id).slice(0, 3);

  return (
    <>
      {/* Bandeau defilant */}
      <Marquee messages={flashMessages} />

      {/* Hero */}
      <Hero />

      {/* Mot du Ministre */}
      <section className="py-20 bg-gris-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="w-full aspect-[4/5] max-w-md rounded-2xl overflow-hidden relative shadow-2xl mx-auto lg:mx-0">
                  <Image
                    src="/images/ministre/haliki-choua-mahamat.jpg"
                    alt={ministere.ministre.nom}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bleu-dark via-bleu-dark/70 to-transparent p-6">
                    <h3 className="text-white font-bold text-lg">{ministere.ministre.nom}</h3>
                    <p className="text-white/70 text-sm">Ministre des Telecommunications</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-jaune/30 rounded-2xl -z-10 hidden lg:block" />
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="flex items-center gap-2 text-bleu text-sm font-semibold uppercase tracking-wider mb-4">
                <div className="w-8 h-0.5 bg-jaune" />
                Mot du Ministre
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gris-900 mb-6 leading-tight">
                Ensemble, construisons le{' '}
                <span className="text-gradient">Tchad Numerique</span> de demain
              </h2>
              <div className="relative mb-6">
                <Quote size={40} className="text-jaune/30 absolute -top-2 -left-2" />
                <p className="text-gris-600 leading-relaxed pl-8 italic">
                  La transformation numerique du Tchad est une priorite nationale. Notre ministere s&apos;engage
                  a deployer les infrastructures necessaires, a former notre jeunesse aux metiers du numerique,
                  et a digitaliser l&apos;administration publique pour offrir des services de qualite a chaque citoyen tchadien.
                </p>
              </div>
              <p className="text-gris-600 leading-relaxed mb-6">
                {ministere.ministre.bio}
              </p>
              <Link
                href="/ministre"
                className="inline-flex items-center gap-2 text-bleu font-semibold hover:gap-3 transition-all"
              >
                Decouvrir le parcours du Ministre
                <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Actualites */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-bleu text-sm font-semibold uppercase tracking-wider mb-3">
                <div className="w-8 h-0.5 bg-jaune" />
                Actualites
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gris-900">
                Dernieres <span className="text-gradient">Nouvelles</span>
              </h2>
            </div>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-bleu font-medium hover:gap-3 transition-all group"
            >
              Toutes les actualites
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>

          <div className="grid lg:grid-cols-3 gap-8">
            {actualiteVedette && (
              <AnimatedSection className="lg:col-span-2" delay={0.1}>
                <NewsCard actualite={actualiteVedette} variante="featured" />
              </AnimatedSection>
            )}

            <div className="space-y-4">
              {autresActualites.map((actu, index) => (
                <AnimatedSection key={actu.id} delay={0.2 + index * 0.1}>
                  <NewsCard actualite={actu} variante="horizontal" />
                </AnimatedSection>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {actualitesRecentes.slice(3, 6).map((actu, index) => (
              <AnimatedSection key={actu.id} delay={0.1 + index * 0.1}>
                <NewsCard actualite={actu} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <StatsCounter />

      {/* Services rapides */}
      <section className="py-20 bg-gris-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-bleu text-sm font-semibold uppercase tracking-wider mb-3">
              <div className="w-8 h-0.5 bg-jaune" />
              Nos Domaines
              <div className="w-8 h-0.5 bg-jaune" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gris-900 mb-4">
              Domaines d&apos;<span className="text-gradient">Intervention</span>
            </h2>
            <p className="text-gris-600 max-w-2xl mx-auto">
              Le MTENDA intervient dans des domaines strategiques pour la transformation numerique et
              le developpement des telecommunications au Tchad.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { titre: 'Telecommunications', desc: 'Regulation et developpement des infrastructures de telecommunications', icon: '📡', color: 'from-bleu to-bleu-light' },
              { titre: 'Economie Numerique', desc: 'Promotion de l\'ecosysteme numerique et soutien a l\'entrepreneuriat digital', icon: '💹', color: 'from-jaune-dark to-jaune' },
              { titre: 'E-Gouvernance', desc: 'Digitalisation de l\'administration publique et des services aux citoyens', icon: '🏛️', color: 'from-rouge to-rouge-light' },
              { titre: 'Services Postaux', desc: 'Modernisation et regulation des services postaux nationaux', icon: '📮', color: 'from-bleu-light to-bleu' },
              { titre: 'Formation Numerique', desc: 'Programmes de formation et renforcement des capacites en TIC', icon: '🎓', color: 'from-[#0066CC] to-bleu-light' },
              { titre: 'Intelligence Artificielle', desc: 'Direction Generale de l\'IA pour l\'innovation et l\'entrepreneuriat numerique', icon: '🤖', color: 'from-bleu-dark to-bleu' },
            ].map((domaine, index) => (
              <AnimatedSection key={domaine.titre} delay={index * 0.1}>
                <Link href="/services" className="block group">
                  <div className="bg-white rounded-2xl p-6 card-hover border border-gris-100 h-full">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${domaine.color} flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform`}>
                      {domaine.icon}
                    </div>
                    <h3 className="font-bold text-lg text-gris-800 mb-2 group-hover:text-bleu transition-colors">
                      {domaine.titre}
                    </h3>
                    <p className="text-gris-600 text-sm leading-relaxed">{domaine.desc}</p>
                    <div className="mt-4 flex gap-1">
                      <div className="h-0.5 w-6 rounded-full bg-bleu" />
                      <div className="h-0.5 w-3 rounded-full bg-jaune" />
                      <div className="h-0.5 w-1.5 rounded-full bg-rouge" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-bleu text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-bleu-light transition-colors shadow-lg hover:shadow-xl"
            >
              Tous nos Services
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Organismes sous tutelle */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-bleu text-sm font-semibold uppercase tracking-wider mb-3">
              <div className="w-8 h-0.5 bg-jaune" />
              Organismes
              <div className="w-8 h-0.5 bg-jaune" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gris-900 mb-4">
              Organismes sous <span className="text-gradient">Tutelle</span>
            </h2>
            <p className="text-gris-600 max-w-2xl mx-auto">
              Le MTENDA supervise plusieurs organismes strategiques qui contribuent au developpement
              numerique et a la regulation du secteur des telecommunications au Tchad.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {organismes.slice(0, 4).map((org, index) => (
              <AnimatedSection key={org.id} delay={index * 0.1}>
                <OrganismeCard organisme={org} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-10">
            <Link
              href="/organismes"
              className="inline-flex items-center gap-2 border-2 border-bleu text-bleu font-semibold px-8 py-3.5 rounded-lg hover:bg-bleu hover:text-white transition-all"
            >
              Voir tous les Organismes
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Projets majeurs */}
      <section className="py-20 bg-bleu-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 0 0-30 15 15 0 0 0 0 30z' opacity='.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-jaune text-sm font-semibold uppercase tracking-wider mb-3">
              <div className="w-8 h-0.5 bg-jaune" />
              Projets Majeurs
              <div className="w-8 h-0.5 bg-jaune" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Grands Projets <span className="text-jaune">Structurants</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Le MTENDA pilote des projets d&apos;envergure pour accelerer la transformation numerique du Tchad.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {ministere.projets.map((projet, index) => (
              <AnimatedSection key={projet.nom} delay={index * 0.15}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-jaune/30 transition-all group h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-xl text-white group-hover:text-jaune transition-colors">
                      {projet.nom}
                    </h3>
                    <span className="text-jaune font-bold text-sm bg-jaune/10 px-3 py-1 rounded-full shrink-0 ml-4">
                      {projet.budget}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {projet.description}
                  </p>
                  <div className="mt-4 flex gap-1">
                    <div className="h-0.5 w-8 rounded-full bg-jaune/40" />
                    <div className="h-0.5 w-4 rounded-full bg-rouge/40" />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-bleu via-jaune/10 to-rouge/10 opacity-5" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-1 rounded bg-bleu" />
              <div className="w-8 h-1 rounded bg-jaune" />
              <div className="w-8 h-1 rounded bg-rouge" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gris-900 mb-4">
              Unite, Travail, Progres
            </h2>
            <p className="text-gris-600 max-w-xl mx-auto mb-8">
              Le MTENDA au service de la transformation numerique du Tchad et de ses citoyens.
              Ensemble, construisons un avenir numerique inclusif et prospere.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-bleu text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-bleu-light transition-colors shadow-lg"
              >
                Contactez-nous
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2 border-2 border-gris-300 text-gris-700 font-semibold px-8 py-3.5 rounded-lg hover:border-bleu hover:text-bleu transition-colors"
              >
                En savoir plus
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
