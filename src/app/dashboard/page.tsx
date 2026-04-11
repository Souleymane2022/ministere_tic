'use client';

import Link from 'next/link';
import {
  Newspaper,
  Briefcase,
  Building2,
  Star,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  User,
  Settings,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { categories } from '@/data/actualites';

export default function DashboardPage() {
  const { actualites, stats } = useAdmin();

  const statsCards = [
    { titre: 'Actualites', valeur: stats.totalActualites, icon: Newspaper, couleur: 'bg-bleu', grad: 'from-bleu to-bleu-light', lien: '/dashboard/actualites' },
    { titre: 'Services', valeur: stats.totalServices, icon: Briefcase, couleur: 'bg-jaune-dark', grad: 'from-jaune-dark to-jaune', lien: '/dashboard/services' },
    { titre: 'Organismes', valeur: stats.totalOrganismes, icon: Building2, couleur: 'bg-rouge', grad: 'from-rouge to-rouge-light', lien: '/dashboard/organismes' },
    { titre: 'A la Une', valeur: stats.actualitesVedette, icon: Star, couleur: 'bg-bleu-light', grad: 'from-bleu-light to-bleu', lien: '/dashboard/actualites' },
  ];

  const categorieStats = Object.entries(categories).map(([key, cat]) => ({
    key,
    label: cat.label,
    color: cat.color,
    count: actualites.filter((a) => a.categorie === key).length,
  }));

  return (
    <>
      <DashboardHeader
        titre="Tableau de Bord"
        sousTitre="Vue d'ensemble du site MTENDA"
        actions={
          <Link
            href="/dashboard/actualites/nouveau"
            className="hidden sm:inline-flex items-center gap-2 bg-bleu text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-bleu-light transition-colors shadow-md"
          >
            <Plus size={16} />
            Nouvel Article
          </Link>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsCards.map((card) => (
            <Link
              key={card.titre}
              href={card.lien}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gris-100 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${card.grad} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                  <card.icon size={18} className="text-white" />
                </div>
                <TrendingUp size={14} className="text-green-500 mt-1" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gris-900">{card.valeur}</p>
              <p className="text-xs sm:text-sm text-gris-500 mt-0.5">{card.titre}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Derniers articles */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gris-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gris-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gris-900 text-base">Derniers Articles</h2>
                <p className="text-xs text-gris-400 mt-0.5">Publications recentes</p>
              </div>
              <Link href="/dashboard/actualites/nouveau" className="sm:hidden p-2 rounded-xl bg-bleu text-white">
                <Plus size={18} />
              </Link>
            </div>
            <div className="divide-y divide-gris-50">
              {actualites.slice(0, 6).map((actu) => {
                const cat = categories[actu.categorie];
                return (
                  <Link
                    key={actu.id}
                    href={`/dashboard/actualites/${actu.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-gris-50/50 transition-colors group"
                  >
                    <div className={`w-1 h-10 rounded-full ${cat.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {actu.vedette && <Star size={11} className="text-jaune fill-jaune shrink-0" />}
                        <h3 className="text-sm font-medium text-gris-800 group-hover:text-bleu transition-colors truncate">
                          {actu.titre}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gris-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(actu.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={10} />
                          {actu.auteur}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-gris-300 group-hover:text-bleu transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-gris-100 bg-gris-50/30">
              <Link href="/dashboard/actualites" className="text-sm text-bleu font-medium hover:underline flex items-center gap-1 justify-center">
                Voir tout ({stats.totalActualites})
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="lg:col-span-2 space-y-4">
            {/* Par categorie */}
            <div className="bg-white rounded-2xl border border-gris-100 p-4 sm:p-5">
              <h2 className="font-bold text-gris-900 text-base mb-4">Par Categorie</h2>
              <div className="space-y-3">
                {categorieStats.map((cat) => (
                  <div key={cat.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gris-600">{cat.label}</span>
                      <span className="text-sm font-bold text-gris-800">{cat.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gris-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.color} transition-all duration-700`}
                        style={{ width: `${stats.totalActualites > 0 ? Math.max((cat.count / stats.totalActualites) * 100, 4) : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl border border-gris-100 p-4 sm:p-5">
              <h2 className="font-bold text-gris-900 text-base mb-3">Actions Rapides</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Nouvel Article', href: '/dashboard/actualites/nouveau', icon: Plus, bg: 'bg-bleu/5 hover:bg-bleu/10', text: 'text-bleu' },
                  { label: 'Services', href: '/dashboard/services', icon: Briefcase, bg: 'bg-jaune/10 hover:bg-jaune/20', text: 'text-jaune-dark' },
                  { label: 'Organismes', href: '/dashboard/organismes', icon: Building2, bg: 'bg-rouge/5 hover:bg-rouge/10', text: 'text-rouge' },
                  { label: 'Parametres', href: '/dashboard/parametres', icon: Settings, bg: 'bg-gris-50 hover:bg-gris-100', text: 'text-gris-600' },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl ${a.bg} transition-colors`}
                  >
                    <a.icon size={20} className={a.text} />
                    <span className={`text-xs font-medium ${a.text}`}>{a.label}</span>
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
