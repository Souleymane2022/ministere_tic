'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    titre: 'Tchad Numerique 2030',
    sousTitre: 'Construire l\'avenir numerique du Tchad',
    description:
      'Un programme ambitieux de 1,5 milliard USD pour transformer le paysage numerique du Tchad et connecter l\'ensemble du territoire national.',
    cta: 'Decouvrir le Programme',
    ctaLink: '/services',
    gradient: 'from-bleu-dark via-bleu to-bleu-light',
  },
  {
    titre: 'Transformation Digitale',
    sousTitre: 'Moderniser l\'Administration Publique',
    description:
      'Digitalisation des services publics pour une administration plus efficace, transparente et accessible a tous les citoyens tchadiens.',
    cta: 'Nos Services',
    ctaLink: '/services',
    gradient: 'from-bleu via-bleu-dark to-[#001030]',
  },
  {
    titre: 'Connecter le Tchad',
    sousTitre: 'Infrastructure Numerique Nationale',
    description:
      'Deploiement massif de la fibre optique et des reseaux mobiles pour atteindre 80% de couverture nationale d\'ici 2030.',
    cta: 'En Savoir Plus',
    ctaLink: '/a-propos',
    gradient: 'from-[#001030] via-bleu-dark to-bleu',
  },
];

export default function Hero() {
  const [slideActuel, setSlideActuel] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideActuel((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[slideActuel];

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background avec gradient animé */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slideActuel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
        />
      </AnimatePresence>

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Cercles decoratifs animes */}
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-jaune/5 animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-white/3" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full border border-white/5" />

      {/* Contenu */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 flex items-center min-h-[600px] lg:min-h-[700px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          {/* Texte */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={slideActuel}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 mb-6"
                >
                  <span className="w-2 h-2 rounded-full bg-jaune animate-pulse" />
                  {slide.sousTitre}
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {slide.titre.split(' ').map((mot, i) => (
                    <span key={i}>
                      {i === slide.titre.split(' ').length - 1 ? (
                        <span className="text-jaune">{mot}</span>
                      ) : (
                        mot
                      )}{' '}
                    </span>
                  ))}
                </h1>

                <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 bg-jaune text-bleu-dark font-semibold px-7 py-3.5 rounded-lg hover:bg-jaune-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                  >
                    {slide.cta}
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/actualites"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-medium px-7 py-3.5 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <Play size={16} className="fill-current" />
                    Actualites
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Indicateurs de slide */}
            <div className="flex items-center gap-3 mt-12">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSlideActuel(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === slideActuel
                      ? 'w-10 h-3 bg-jaune'
                      : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Visual side - Emblème stylisé */}
          <div className="hidden lg:flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              {/* Grand cercle decoratif */}
              <div className="w-80 h-80 rounded-full border-2 border-white/10 flex items-center justify-center relative">
                <div className="w-64 h-64 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-jaune mb-1">MTENDA</div>
                      <div className="text-xs text-white/60 uppercase tracking-[0.2em]">Tchad</div>
                      <div className="flex items-center justify-center gap-1 mt-3">
                        <div className="w-6 h-1 rounded bg-[#002664]" />
                        <div className="w-6 h-1 rounded bg-[#FECB00]" />
                        <div className="w-6 h-1 rounded bg-[#C60C30]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elements orbitaux */}
                {['Telecoms', 'Numerique', 'Innovation', 'E-Gouv'].map((label, i) => (
                  <div
                    key={label}
                    className="absolute w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-[10px] text-white/80 font-medium"
                    style={{
                      top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 4 - Math.PI / 4)}%`,
                      left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 4 - Math.PI / 4)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fleches de navigation */}
      <button
        onClick={() => setSlideActuel((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors hidden md:flex"
        aria-label="Slide precedent"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setSlideActuel((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors hidden md:flex"
        aria-label="Slide suivant"
      >
        <ChevronRight size={20} />
      </button>

      {/* Vague decorative en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 40L48 36.7C96 33 192 27 288 28.3C384 30 480 40 576 46.7C672 53 768 57 864 53.3C960 50 1056 40 1152 36.7C1248 33 1344 37 1392 38.3L1440 40V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
