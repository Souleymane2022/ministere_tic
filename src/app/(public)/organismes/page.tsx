'use client';

import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import OrganismeCard from '@/components/OrganismeCard';
import { organismes } from '@/data/organismes';

export default function OrganismesPage() {
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
              Organismes
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Organismes sous <span className="text-jaune">Tutelle</span>
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              Le MTENDA supervise plusieurs organismes strategiques qui contribuent au developpement
              numerique et a la regulation du secteur des telecommunications au Tchad.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="chad-flag-bar" />

      {/* Liste des organismes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {organismes.map((org, index) => (
              <AnimatedSection key={org.id} delay={index * 0.1}>
                <OrganismeCard organisme={org} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Detail de chaque organisme */}
      <section className="py-20 bg-gris-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gris-900 mb-4">
              Details des <span className="text-gradient">Organismes</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-8">
            {organismes.map((org, index) => (
              <AnimatedSection key={org.id} delay={index * 0.05}>
                <div className="bg-white rounded-2xl overflow-hidden border border-gris-100 shadow-sm">
                  <div
                    className="h-2"
                    style={{ backgroundColor: org.couleur }}
                  />
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gris-50 flex items-center justify-center p-2">
                          <Image
                            src={org.logo}
                            alt={`Logo ${org.sigle}`}
                            width={72}
                            height={72}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gris-900 mb-1">{org.sigle}</h3>
                        <p className="text-sm text-gris-500 mb-4">{org.nom}</p>
                        <p className="text-gris-600 leading-relaxed mb-6">
                          {org.description}
                        </p>

                        <h4 className="font-semibold text-gris-800 mb-3">Missions principales :</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {org.missions.map((mission, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div
                                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                                style={{ backgroundColor: org.couleur }}
                              />
                              <span className="text-sm text-gris-600">{mission}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
