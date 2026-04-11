'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import AnimatedSection from '@/components/AnimatedSection';
import { actualites, categories } from '@/data/actualites';

export default function ActualitesPage() {
  const [recherche, setRecherche] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState<string>('tous');

  const actualitesFiltrees = actualites.filter((actu) => {
    const matchRecherche =
      actu.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      actu.resume.toLowerCase().includes(recherche.toLowerCase());
    const matchCategorie = categorieFiltre === 'tous' || actu.categorie === categorieFiltre;
    return matchRecherche && matchCategorie;
  });

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
              Actualites
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Toutes les <span className="text-jaune">Actualites</span>
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              Suivez les dernieres nouvelles et les activites du Ministere des Telecommunications,
              de l&apos;Economie Numerique et de la Digitalisation de l&apos;Administration.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="chad-flag-bar" />

      {/* Filtres */}
      <section className="py-8 bg-gris-50 border-b border-gris-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-lg w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-400" />
              <input
                type="text"
                placeholder="Rechercher une actualite..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gris-200 bg-white focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu transition-all text-sm"
              />
            </div>

            {/* Filtres categories */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className="text-gris-500" />
              <button
                onClick={() => setCategorieFiltre('tous')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categorieFiltre === 'tous'
                    ? 'bg-bleu text-white shadow-md'
                    : 'bg-white text-gris-600 hover:bg-gris-100 border border-gris-200'
                }`}
              >
                Tous
              </button>
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setCategorieFiltre(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    categorieFiltre === key
                      ? 'bg-bleu text-white shadow-md'
                      : 'bg-white text-gris-600 hover:bg-gris-100 border border-gris-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liste des actualites */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {actualitesFiltrees.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gris-700 mb-2">Aucun resultat</h3>
              <p className="text-gris-500">Aucune actualite ne correspond a votre recherche.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {actualitesFiltrees.map((actu, index) => (
                <AnimatedSection key={actu.id} delay={index * 0.1}>
                  <NewsCard actualite={actu} />
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Resultats count */}
          <div className="mt-8 text-center text-sm text-gris-500">
            {actualitesFiltrees.length} actualite{actualitesFiltrees.length > 1 ? 's' : ''} trouvee{actualitesFiltrees.length > 1 ? 's' : ''}
          </div>
        </div>
      </section>
    </>
  );
}
