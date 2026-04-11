'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ServiceCard from '@/components/ServiceCard';
import { services } from '@/data/services';
import { ministere } from '@/data/ministere';

export default function ServicesPage() {
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
              Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nos <span className="text-jaune">Services</span>
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              Le MTENDA offre un ensemble de services strategiques pour le developpement
              numerique et la modernisation des telecommunications au Tchad.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="chad-flag-bar" />

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection key={service.id} delay={index * 0.1}>
                <ServiceCard service={service} index={index} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Projets structurants */}
      <section className="py-20 bg-gris-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gris-900 mb-4">
              Projets <span className="text-gradient">Structurants</span>
            </h2>
            <p className="text-gris-600 max-w-2xl mx-auto">
              Decouvrez les grands projets qui transforment le paysage numerique du Tchad.
            </p>
          </AnimatedSection>

          <div className="space-y-6">
            {ministere.projets.map((projet, index) => (
              <AnimatedSection key={projet.nom} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 border border-gris-100 card-hover">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-bleu flex items-center justify-center text-white font-bold text-sm">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-xl font-bold text-gris-900">{projet.nom}</h3>
                      </div>
                      <p className="text-gris-600 leading-relaxed ml-[52px]">
                        {projet.description}
                      </p>
                    </div>
                    <div className="ml-[52px] md:ml-0">
                      <div className="bg-jaune/10 text-jaune-dark font-bold px-5 py-2.5 rounded-lg text-center">
                        {projet.budget}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-bleu-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">
              Besoin d&apos;informations supplementaires ?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              N&apos;hesitez pas a nous contacter pour en savoir plus sur nos services et programmes.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-jaune text-bleu-dark font-semibold px-8 py-3.5 rounded-lg hover:bg-jaune-light transition-colors shadow-lg"
            >
              Contactez-nous
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
