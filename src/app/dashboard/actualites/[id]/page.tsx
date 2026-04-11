'use client';

import { useParams } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ActualiteForm from '@/components/dashboard/ActualiteForm';
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
        <div className="p-6 text-center text-gris-500">
          Cet article n&apos;existe pas ou a ete supprime.
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        titre="Modifier l'Article"
        sousTitre={actualite.titre}
      />
      <ActualiteForm mode="edition" actualite={actualite} />
    </>
  );
}
