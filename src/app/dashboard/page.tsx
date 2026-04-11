'use client';

import Link from 'next/link';
import {
  Newspaper,
  Briefcase,
  Building2,
  Star,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { categories } from '@/data/actualites';

export default function DashboardPage() {
  const { actualites, stats } = useAdmin();

  const statsCards = [
    {
      titre: 'Actualites',
      valeur: stats.totalActualites,
      icon: Newspaper,
      couleur: 'bg-bleu',
      lien: '/dashboard/actualites',
    },
    {
      titre: 'Services',
      valeur: stats.totalServices,
      icon: Briefcase,
      couleur: 'bg-jaune-dark',
      lien: '/dashboard/services',
    },
    {
      titre: 'Organismes',
      valeur: stats.totalOrganismes,
      icon: Building2,
      couleur: 'bg-rouge',
      lien: '/dashboard/organismes',
    },
    {
      titre: 'A la Une',
      valeur: stats.actualitesVedette,
      icon: Star,
      couleur: 'bg-[#0066CC]',
      lien: '/dashboard/actualites',
    },
  ];

  const dernieresActualites = actualites.slice(0, 5);

  const categorieStats = Object.entries(categories).map(([key, cat]) => ({
    key,
    label: cat.label,
    count: actualites.filter((a) => a.categorie === key).length,
  }));

  return (
    <>
      <DashboardHeader
        titre="Tableau de Bord"
        sousTitre="Vue d'ensemble du site MTENDA"
      />

      <div className="p-6 space-y-6">
        {/* Cartes de stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card) => (
            <Link
              key={card.titre}
              href={card.lien}
              className="bg-white rounded-2xl p-5 border border-gris-100 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gris-500 mb-1">{card.titre}</p>
                  <p className="text-3xl font-bold text-gris-900">{card.valeur}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.couleur} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <card.icon size={22} className="text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-gris-500">
                <TrendingUp size={12} className="text-green-500" />
                <span>Mis a jour aujourd&apos;hui</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Dernieres actualites */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gris-100">
            <div className="p-5 border-b border-gris-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gris-900">Dernieres Actualites</h2>
                <p className="text-xs text-gris-500 mt-0.5">Articles recemment publies</p>
              </div>
              <Link
                href="/dashboard/actualites/nouveau"
                className="inline-flex items-center gap-1.5 bg-bleu text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-bleu-light transition-colors"
              >
                <Plus size={16} />
                Nouveau
              </Link>
            </div>
            <div className="divide-y divide-gris-100">
              {dernieresActualites.map((actu) => {
                const cat = categories[actu.categorie];
                return (
                  <Link
                    key={actu.id}
                    href={`/dashboard/actualites/${actu.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gris-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${cat.color}`} />
                        <span className="text-[10px] text-gris-500 uppercase font-medium">{cat.label}</span>
                        {actu.vedette && (
                          <Star size={12} className="text-jaune fill-jaune" />
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-gris-800 group-hover:text-bleu transition-colors truncate">
                        {actu.titre}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] text-gris-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(actu.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-[11px] text-gris-400 flex items-center gap-1">
                          <Eye size={10} />
                          {actu.auteur}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-gris-300 group-hover:text-bleu transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-gris-100">
              <Link href="/dashboard/actualites" className="text-sm text-bleu font-medium hover:underline flex items-center gap-1">
                Voir toutes les actualites
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Stats par categorie + Actions rapides */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5">
              <h2 className="font-bold text-gris-900 mb-4">Par Categorie</h2>
              <div className="space-y-3">
                {categorieStats.map((cat) => (
                  <div key={cat.key} className="flex items-center justify-between">
                    <span className="text-sm text-gris-600">{cat.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gris-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-bleu rounded-full"
                          style={{
                            width: `${stats.totalActualites > 0 ? (cat.count / stats.totalActualites) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gris-800 w-6 text-right">{cat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5">
              <h2 className="font-bold text-gris-900 mb-4">Actions Rapides</h2>
              <div className="space-y-2">
                {[
                  { label: 'Nouvel Article', href: '/dashboard/actualites/nouveau', icon: Plus, color: 'text-bleu' },
                  { label: 'Gerer les Services', href: '/dashboard/services', icon: Briefcase, color: 'text-jaune-dark' },
                  { label: 'Gerer les Organismes', href: '/dashboard/organismes', icon: Building2, color: 'text-rouge' },
                  { label: 'Parametres', href: '/dashboard/parametres', icon: Clock, color: 'text-gris-600' },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gris-50 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gris-50 flex items-center justify-center ${action.color} group-hover:bg-gris-100`}>
                      <action.icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-gris-700 group-hover:text-gris-900">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
