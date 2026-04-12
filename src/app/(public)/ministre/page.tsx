'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Briefcase, Target } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { ministere } from '@/data/ministere';

export default function MinistrePage() {
  return (
    <>
      {/* Banniere */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <Link
              href="/a-propos"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm"
            >
              <ArrowLeft size={16} />
              Retour
            </Link>
            <div className="flex items-center gap-2 text-jaune text-sm font-semibold uppercase tracking-wider mb-3">
              <div className="w-8 h-0.5 bg-jaune" />
              Le Ministre
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {ministere.ministre.nom}
            </h1>
            <p className="text-white/70 text-lg">
              {ministere.ministre.titre}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="chad-flag-bar" />

      {/* Profil */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-[350px_1fr] gap-12">
            {/* Photo et info */}
            <AnimatedSection direction="left">
              <div className="sticky top-24">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src="/images/ministre/haliki-choua-mahamat.jpg"
                      alt={ministere.ministre.nom}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 bg-bleu-dark/50">
                    <h3 className="text-white font-bold text-lg">{ministere.ministre.nom}</h3>
                    <p className="text-jaune text-sm mt-1">Ministre des Telecommunications</p>
                    <div className="flex items-center justify-center gap-1 mt-4">
                      <div className="w-8 h-1 rounded bg-[#002664]" />
                      <div className="w-8 h-1 rounded bg-[#FECB00]" />
                      <div className="w-8 h-1 rounded bg-[#C60C30]" />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Biographie */}
            <div>
              <AnimatedSection direction="right">
                <h2 className="text-3xl font-bold text-gris-900 mb-6">
                  Biographie <span className="text-gradient">Officielle</span>
                </h2>
                <p className="text-gris-600 leading-relaxed mb-6 text-lg">
                  {ministere.ministre.bio}
                </p>
              </AnimatedSection>

              {/* Parcours */}
              <AnimatedSection delay={0.2}>
                <div className="space-y-6 mt-10">
                  <h3 className="text-xl font-bold text-gris-900 flex items-center gap-3">
                    <Briefcase size={20} className="text-bleu" />
                    Parcours Professionnel
                  </h3>

                  <div className="space-y-4 border-l-2 border-bleu/20 pl-6 ml-2">
                    {[
                      { date: 'Avril 2026 - Present', poste: 'Ministre des Telecommunications, de l\'Economie Numerique et de la Digitalisation de l\'Administration', lieu: 'Republique du Tchad' },
                      { date: 'Precedemment', poste: 'Directeur General de l\'ARCEP Tchad', lieu: 'Autorite de Regulation' },
                    ].map((etape, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-bleu border-4 border-white shadow" />
                        <span className="text-sm text-bleu font-semibold">{etape.date}</span>
                        <h4 className="font-bold text-gris-800 mt-1">{etape.poste}</h4>
                        <p className="text-sm text-gris-500">{etape.lieu}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Priorites */}
              <AnimatedSection delay={0.3}>
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gris-900 flex items-center gap-3 mb-6">
                    <Target size={20} className="text-rouge" />
                    Priorites Ministerielles
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { titre: 'Connectivite Universelle', desc: 'Atteindre 80% de couverture internet nationale d\'ici 2030' },
                      { titre: 'E-Gouvernance', desc: 'Digitaliser 100% des services administratifs prioritaires' },
                      { titre: 'Capital Humain', desc: 'Former 50 000 jeunes aux metiers du numerique' },
                      { titre: 'Innovation', desc: 'Creer un ecosysteme favorable a l\'entrepreneuriat numerique' },
                    ].map((priorite, index) => (
                      <div key={index} className="bg-gris-50 rounded-xl p-5 border border-gris-100">
                        <h4 className="font-bold text-gris-800 mb-1 text-sm">{priorite.titre}</h4>
                        <p className="text-sm text-gris-600">{priorite.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
