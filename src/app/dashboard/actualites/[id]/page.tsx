'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Newspaper } from 'lucide-react';
import ActualiteForm from '@/components/dashboard/ActualiteForm';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAdmin } from '@/lib/admin-store';

export default function ModifierArticle() {
  const params = useParams();
  const { actualites } = useAdmin();
  const id = params.id as string;
  const actualite = actualites.find((a) => a.id === id);

  if (!actualite) {
    return (
      <>
        <DashboardHeader titre="Article non trouve" />
        <div className="p-8 text-center">
          <Newspaper size={48} className="mx-auto text-gris-200 mb-4" />
          <h2 className="text-lg font-semibold text-gris-700 mb-2">Article introuvable</h2>
          <p className="text-sm text-gris-400 mb-6">Cet article n&apos;existe pas ou a ete supprime.</p>
          <Link
            href="/dashboard/actualites"
            className="inline-flex items-center gap-2 text-bleu text-sm font-medium hover:underline"
          >
            <ArrowLeft size={14} />
            Retour aux articles
          </Link>
        </div>
      </>
    );
  }

  return <ActualiteForm mode="edition" actualite={actualite} />;
}
