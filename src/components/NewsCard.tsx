'use client';

import Link from 'next/link';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { Actualite, categories } from '@/data/actualites';

interface NewsCardProps {
  actualite: Actualite;
  variante?: 'default' | 'horizontal' | 'featured';
}

export default function NewsCard({ actualite, variante = 'default' }: NewsCardProps) {
  const categorie = categories[actualite.categorie];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (variante === 'featured') {
    return (
      <Link href={`/actualites/${actualite.slug}`} className="block group">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-bleu to-bleu-dark min-h-[400px] flex items-end card-hover">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bleu-dark/95 via-bleu-dark/50 to-transparent" />

          {/* Pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${categorie.color}`}>
                {categorie.label}
              </span>
              <span className="text-white/60 text-sm flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(actualite.date)}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-jaune transition-colors leading-tight">
              {actualite.titre}
            </h3>
            <p className="text-white/70 mb-5 line-clamp-2 max-w-xl">
              {actualite.resume}
            </p>
            <span className="inline-flex items-center gap-2 text-jaune font-medium text-sm group-hover:gap-3 transition-all">
              Lire la suite
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variante === 'horizontal') {
    return (
      <Link href={`/actualites/${actualite.slug}`} className="block group">
        <div className="flex gap-5 bg-white rounded-xl p-4 card-hover border border-gris-100">
          {/* Image placeholder */}
          <div className="w-32 h-24 shrink-0 rounded-lg bg-gradient-to-br from-bleu/10 to-bleu/5 flex items-center justify-center">
            <Tag size={24} className="text-bleu/30" />
          </div>
          <div className="flex-1 min-w-0">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-white ${categorie.color} mb-2`}>
              {categorie.label}
            </span>
            <h4 className="font-semibold text-gris-800 group-hover:text-bleu transition-colors line-clamp-2 text-sm mb-1">
              {actualite.titre}
            </h4>
            <span className="text-gris-500 text-xs flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(actualite.date)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/actualites/${actualite.slug}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden card-hover border border-gris-100 h-full flex flex-col">
        {/* Image placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-bleu/10 via-bleu/5 to-jaune/5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-bleu/5 to-transparent" />
          <div className="relative text-center p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-bleu/10 flex items-center justify-center">
              <Tag size={20} className="text-bleu/40" />
            </div>
            <span className="text-bleu/30 text-xs font-medium">{categorie.label}</span>
          </div>
          {/* Badge categorie */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${categorie.color} shadow-md`}>
              {categorie.label}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-gris-500 text-xs mb-3">
            <Calendar size={12} />
            <span>{formatDate(actualite.date)}</span>
          </div>
          <h3 className="font-bold text-gris-800 group-hover:text-bleu transition-colors mb-3 line-clamp-2 leading-snug">
            {actualite.titre}
          </h3>
          <p className="text-gris-600 text-sm line-clamp-3 flex-1 leading-relaxed">
            {actualite.resume}
          </p>
          <div className="mt-4 pt-4 border-t border-gris-100">
            <span className="inline-flex items-center gap-2 text-bleu font-medium text-sm group-hover:gap-3 transition-all">
              Lire la suite
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
