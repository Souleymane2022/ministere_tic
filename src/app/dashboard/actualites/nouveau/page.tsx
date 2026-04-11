'use client';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ActualiteForm from '@/components/dashboard/ActualiteForm';

export default function NouvelArticle() {
  return (
    <>
      <DashboardHeader
        titre="Nouvel Article"
        sousTitre="Creer et publier un nouvel article d'actualite"
      />
      <ActualiteForm mode="creation" />
    </>
  );
}
