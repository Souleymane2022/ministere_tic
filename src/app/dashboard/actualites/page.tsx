'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Star,
  Calendar,
  Eye,
  Newspaper,
  User,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { categories } from '@/data/actualites';

export default function ActualitesAdmin() {
  const { actualites, supprimerActualite, modifierActualite } = useAdmin();
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState('tous');

  const filtrees = actualites.filter((a) => {
    const matchRecherche = a.titre.toLowerCase().includes(recherche.toLowerCase());
    const matchFiltre = filtre === 'tous' || a.categorie === filtre;
    return matchRecherche && matchFiltre;
  });

  const handleSupprimer = (id: string) => {
    if (confirm('Supprimer cet article ?')) {
      supprimerActualite(id);
    }
  };

  return (
    <>
      <DashboardHeader
        titre="Actualites"
        sousTitre={`${actualites.length} articles publies`}
        actions={
          <Link
            href="/dashboard/actualites/nouveau"
            className="inline-flex items-center gap-2 bg-bleu text-white font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-bleu-light transition-colors shadow-md"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nouvel Article</span>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gris-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gris-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFiltre('tous')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filtre === 'tous' ? 'bg-bleu text-white shadow' : 'bg-white text-gris-600 border border-gris-200 hover:border-bleu/30'
              }`}
            >
              Tous ({actualites.length})
            </button>
            {Object.entries(categories).map(([key, cat]) => {
              const count = actualites.filter(a => a.categorie === key).length;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setFiltre(key)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    filtre === key ? 'bg-bleu text-white shadow' : 'bg-white text-gris-600 border border-gris-200 hover:border-bleu/30'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste des articles */}
        {filtrees.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gris-100 p-12 text-center">
            <Newspaper size={48} className="mx-auto text-gris-200 mb-4" />
            <h3 className="text-lg font-semibold text-gris-700 mb-1">Aucun article</h3>
            <p className="text-sm text-gris-400 mb-6">Modifiez vos filtres ou creez un nouvel article.</p>
            <Link
              href="/dashboard/actualites/nouveau"
              className="inline-flex items-center gap-2 bg-bleu text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-bleu-light transition-colors"
            >
              <Plus size={16} />
              Creer un article
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtrees.map((actu) => {
              const cat = categories[actu.categorie];
              return (
                <div
                  key={actu.id}
                  className="bg-white rounded-2xl border border-gris-100 p-4 sm:p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="hidden sm:block w-24 h-20 rounded-xl overflow-hidden bg-gris-100 shrink-0 relative">
                      {actu.image.startsWith('http') ? (
                        <Image src={actu.image} alt={actu.titre} fill className="object-cover" sizes="96px" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-bleu/10 to-bleu/5 flex items-center justify-center">
                          <Newspaper size={20} className="text-bleu/20" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {/* Badges */}
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold text-white ${cat.color}`}>
                              {cat.label}
                            </span>
                            {actu.vedette && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-jaune-dark bg-jaune/15 px-2 py-0.5 rounded-md">
                                <Star size={9} className="fill-current" />
                                Vedette
                              </span>
                            )}
                          </div>

                          {/* Titre */}
                          <h3 className="font-semibold text-gris-800 text-sm sm:text-base truncate">
                            {actu.titre}
                          </h3>

                          {/* Meta */}
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gris-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(actu.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <User size={11} />
                              {actu.auteur}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Link
                            href={`/actualites/${actu.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg text-gris-400 hover:text-bleu hover:bg-bleu/5 transition-colors"
                            title="Voir sur le site"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/dashboard/actualites/${actu.id}`}
                            className="p-2 rounded-lg text-gris-400 hover:text-bleu hover:bg-bleu/5 transition-colors"
                            title="Modifier"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button
                            onClick={() => {
                              modifierActualite(actu.id, { vedette: !actu.vedette });
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              actu.vedette
                                ? 'text-jaune hover:text-jaune-dark hover:bg-jaune/10'
                                : 'text-gris-400 hover:text-jaune hover:bg-jaune/5'
                            }`}
                            title={actu.vedette ? 'Retirer vedette' : 'Mettre en vedette'}
                          >
                            <Star size={16} className={actu.vedette ? 'fill-current' : ''} />
                          </button>
                          <button
                            onClick={() => handleSupprimer(actu.id)}
                            className="p-2 rounded-lg text-gris-400 hover:text-rouge hover:bg-rouge/5 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Count */}
        {filtrees.length > 0 && (
          <p className="text-center text-xs text-gris-400 mt-6">
            {filtrees.length} article{filtrees.length > 1 ? 's' : ''} affiche{filtrees.length > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </>
  );
}
