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
  Filter,
  MoreVertical,
  Eye,
  Newspaper,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { categories } from '@/data/actualites';

export default function ActualitesAdmin() {
  const { actualites, supprimerActualite, modifierActualite } = useAdmin();
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState('tous');
  const [menuOuvert, setMenuOuvert] = useState<string | null>(null);

  const filtrees = actualites.filter((a) => {
    const matchRecherche = a.titre.toLowerCase().includes(recherche.toLowerCase());
    const matchFiltre = filtre === 'tous' || a.categorie === filtre;
    return matchRecherche && matchFiltre;
  });

  const handleSupprimer = (id: string) => {
    if (confirm('Etes-vous sur de vouloir supprimer cet article ?')) {
      supprimerActualite(id);
    }
    setMenuOuvert(null);
  };

  const toggleVedette = (id: string, current: boolean) => {
    modifierActualite(id, { vedette: !current });
    setMenuOuvert(null);
  };

  return (
    <>
      <DashboardHeader
        titre="Actualites"
        sousTitre={`${actualites.length} articles publies`}
      />

      <div className="p-6">
        {/* Barre d'actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            {/* Recherche */}
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gris-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu"
              />
            </div>
            {/* Filtre categorie */}
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-400" />
              <select
                value={filtre}
                onChange={(e) => setFiltre(e.target.value)}
                className="pl-8 pr-8 py-2.5 rounded-xl border border-gris-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-bleu/20"
              >
                <option value="tous">Toutes</option>
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Link
            href="/dashboard/actualites/nouveau"
            className="inline-flex items-center gap-2 bg-bleu text-white font-medium px-5 py-2.5 rounded-xl hover:bg-bleu-light transition-colors shadow-md"
          >
            <Plus size={18} />
            Nouvel Article
          </Link>
        </div>

        {/* Tableau des actualites */}
        <div className="bg-white rounded-2xl border border-gris-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gris-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gris-500 uppercase">Article</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gris-500 uppercase">Categorie</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gris-500 uppercase">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gris-500 uppercase">Statut</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gris-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gris-100">
                {filtrees.map((actu) => {
                  const cat = categories[actu.categorie];
                  return (
                    <tr key={actu.id} className="hover:bg-gris-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-gris-100 shrink-0 relative">
                            {actu.image.startsWith('http') ? (
                              <Image src={actu.image} alt="" fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-bleu/10 to-bleu/5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-gris-800 truncate max-w-xs">
                              {actu.titre}
                            </h3>
                            <p className="text-xs text-gris-400 truncate max-w-xs">{actu.auteur}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold text-white ${cat.color}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gris-600 flex items-center gap-1.5">
                          <Calendar size={12} className="text-gris-400" />
                          {new Date(actu.date).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {actu.vedette ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-jaune-dark bg-jaune/10 px-2.5 py-1 rounded-full">
                            <Star size={10} className="fill-current" />
                            Vedette
                          </span>
                        ) : (
                          <span className="text-xs text-gris-400">Publie</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 relative">
                          <Link
                            href={`/actualites/${actu.slug}`}
                            className="p-2 rounded-lg hover:bg-gris-100 text-gris-400 hover:text-bleu transition-colors"
                            title="Voir"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/dashboard/actualites/${actu.id}`}
                            className="p-2 rounded-lg hover:bg-gris-100 text-gris-400 hover:text-bleu transition-colors"
                            title="Modifier"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button
                            onClick={() => setMenuOuvert(menuOuvert === actu.id ? null : actu.id)}
                            className="p-2 rounded-lg hover:bg-gris-100 text-gris-400 hover:text-gris-700 transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {/* Menu contextuel */}
                          {menuOuvert === actu.id && (
                            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-gris-100 py-1.5 z-10 w-44">
                              <button
                                onClick={() => toggleVedette(actu.id, actu.vedette)}
                                className="w-full text-left px-4 py-2 text-sm text-gris-700 hover:bg-gris-50 flex items-center gap-2"
                              >
                                <Star size={14} className={actu.vedette ? 'text-jaune fill-jaune' : ''} />
                                {actu.vedette ? 'Retirer vedette' : 'Mettre en vedette'}
                              </button>
                              <button
                                onClick={() => handleSupprimer(actu.id)}
                                className="w-full text-left px-4 py-2 text-sm text-rouge hover:bg-rouge/5 flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtrees.length === 0 && (
            <div className="text-center py-16">
              <Newspaper size={40} className="mx-auto text-gris-300 mb-3" />
              <p className="text-gris-500 font-medium">Aucun article trouve</p>
              <p className="text-sm text-gris-400 mt-1">Modifiez vos filtres ou creez un nouvel article</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
