import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MTENDA - Ministere des Telecommunications, de l\'Economie Numerique et de la Digitalisation de l\'Administration',
    template: '%s | MTENDA Tchad',
  },
  description:
    'Site officiel du Ministere des Telecommunications, de l\'Economie Numerique et de la Digitalisation de l\'Administration - Republique du Tchad. Unite, Travail, Progres.',
  keywords: [
    'MTENDA',
    'Tchad',
    'Telecommunications',
    'Economie Numerique',
    'Digitalisation',
    'E-Gouvernance',
    'TIC',
    'N\'Djamena',
  ],
  authors: [{ name: 'MTENDA - Republique du Tchad' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'MTENDA Tchad',
    title: 'MTENDA - Ministere des Telecommunications du Tchad',
    description: 'Site officiel du Ministere des Telecommunications, de l\'Economie Numerique et de la Digitalisation de l\'Administration du Tchad.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
