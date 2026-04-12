'use client';

import Image from 'next/image';
import { Target, Eye, Award, Users, Building, BookOpen } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { ministere } from '@/data/ministere';

export default function AProposPage() {
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
            <div className="flex items-center gap-2 text-jaune text-sm font-semibold uppercase tracking-wider mb-3">
              <div className="w-8 h-0.5 bg-jaune" />
              Le Ministere
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              A Propos du <span className="text-jaune">MTENDA</span>
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              Decouvrez la mission, la vision et l&apos;organisation du Ministere des Telecommunications,
              de l&apos;Economie Numerique et de la Digitalisation de l&apos;Administration.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="chad-flag-bar" />

      {/* Mission et Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl p-8 border border-gris-100 shadow-lg h-full">
                <div className="w-14 h-14 rounded-xl bg-bleu/10 flex items-center justify-center mb-6">
                  <Target size={28} className="text-bleu" />
                </div>
                <h2 className="text-2xl font-bold text-gris-900 mb-4">Notre Mission</h2>
                <p className="text-gris-600 leading-relaxed">
                  {ministere.mission}
                </p>
                <div className="mt-6 flex gap-1">
                  <div className="h-1 w-12 rounded-full bg-bleu" />
                  <div className="h-1 w-6 rounded-full bg-jaune" />
                  <div className="h-1 w-3 rounded-full bg-rouge" />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="bg-white rounded-2xl p-8 border border-gris-100 shadow-lg h-full">
                <div className="w-14 h-14 rounded-xl bg-jaune/10 flex items-center justify-center mb-6">
                  <Eye size={28} className="text-jaune-dark" />
                </div>
                <h2 className="text-2xl font-bold text-gris-900 mb-4">Notre Vision</h2>
                <p className="text-gris-600 leading-relaxed">
                  {ministere.vision}
                </p>
                <div className="mt-6 flex gap-1">
                  <div className="h-1 w-12 rounded-full bg-jaune" />
                  <div className="h-1 w-6 rounded-full bg-rouge" />
                  <div className="h-1 w-3 rounded-full bg-bleu" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-gris-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gris-900 mb-4">
              Nos <span className="text-gradient">Valeurs</span>
            </h2>
            <p className="text-gris-600 max-w-2xl mx-auto">
              Guidees par la devise nationale, nos valeurs fondamentales orientent chacune de nos actions.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                titre: 'Unite',
                description: 'Federer tous les acteurs du numerique au Tchad autour d\'une vision commune pour un developpement harmonieux et inclusif du secteur des TIC.',
                icon: Users,
                color: 'bg-bleu',
              },
              {
                titre: 'Travail',
                description: 'S\'engager avec determination et professionnalisme dans la mise en oeuvre des projets structurants pour la transformation numerique du pays.',
                icon: Award,
                color: 'bg-jaune',
              },
              {
                titre: 'Progres',
                description: 'Innover constamment et adopter les meilleures pratiques internationales pour propulser le Tchad dans l\'ere du numerique.',
                icon: Target,
                color: 'bg-rouge',
              },
            ].map((valeur, index) => (
              <AnimatedSection key={valeur.titre} delay={index * 0.15}>
                <div className="bg-white rounded-2xl p-8 card-hover border border-gris-100 text-center h-full">
                  <div className={`w-16 h-16 mx-auto rounded-full ${valeur.color} flex items-center justify-center mb-6`}>
                    <valeur.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-900 mb-3">{valeur.titre}</h3>
                  <p className="text-gris-600 text-sm leading-relaxed">{valeur.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Organisation */}
      <section id="organisation" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gris-900 mb-4">
              <span className="text-gradient">Organisation</span> du Ministere
            </h2>
            <p className="text-gris-600 max-w-2xl mx-auto">
              Le MTENDA est organise autour de plusieurs directions generales specialisees.
            </p>
          </AnimatedSection>

          {/* Equipe dirigeante */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { ...ministere.ministre, role: 'Ministre', photo: '/images/ministre/haliki-choua-mahamat.jpg' },
              { nom: ministere.secretaireGeneral.nom, titre: ministere.secretaireGeneral.titre, role: 'Secretaire General', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
              { nom: ministere.secretaireGeneralAdjoint.nom, titre: ministere.secretaireGeneralAdjoint.titre, role: 'SGA', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80' },
              { nom: ministere.inspecteurGeneral.nom, titre: ministere.inspecteurGeneral.titre, role: 'Inspecteur General', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
            ].map((personne, index) => (
              <AnimatedSection key={personne.nom} delay={index * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden card-hover border border-gris-100 text-center">
                  <div className="h-40 relative">
                    <Image
                      src={personne.photo}
                      alt={personne.nom}
                      fill
                      sizes="(max-width: 768px) 50vw, 300px"
                      quality={90}
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bleu-dark/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-3 py-1 bg-jaune/10 text-jaune-dark text-xs font-semibold rounded-full mb-2">
                      {personne.role}
                    </span>
                    <h3 className="font-bold text-gris-800 text-sm mb-1">{personne.nom}</h3>
                    <p className="text-xs text-gris-500">{personne.titre}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Directions */}
          <AnimatedSection>
            <div className="bg-bleu-dark rounded-2xl p-10 text-white">
              <div className="flex items-center gap-3 mb-8">
                <Building size={24} className="text-jaune" />
                <h3 className="text-2xl font-bold">Directions Generales</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ministere.directions.map((direction, index) => (
                  <div
                    key={direction}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-jaune/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-jaune/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-jaune font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-white/80 text-sm">{direction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Cadre juridique */}
      <section className="py-20 bg-gris-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gris-900 mb-4">
              Cadre <span className="text-gradient">Juridique</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { titre: 'Loi N 013/PR/2014', desc: 'Loi regissant les communications electroniques et postales' },
              { titre: 'Loi N 006/PR/2015', desc: 'Creation de l\'ANSICE pour la cybersecurite' },
              { titre: 'Ordonnance 005/PR/2015', desc: 'Creation de l\'ENASTIC' },
              { titre: 'Code du Numerique', desc: 'En cours d\'elaboration - cadre juridique complet pour l\'economie numerique' },
            ].map((loi, index) => (
              <AnimatedSection key={loi.titre} delay={index * 0.1}>
                <div className="bg-white rounded-xl p-6 border border-gris-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-bleu/10 flex items-center justify-center shrink-0">
                    <BookOpen size={18} className="text-bleu" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gris-800 mb-1">{loi.titre}</h4>
                    <p className="text-sm text-gris-600">{loi.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
