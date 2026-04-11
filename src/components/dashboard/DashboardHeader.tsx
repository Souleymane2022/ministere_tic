'use client';

import { User } from 'lucide-react';

interface DashboardHeaderProps {
  titre: string;
  sousTitre?: string;
  actions?: React.ReactNode;
}

export default function DashboardHeader({ titre, sousTitre, actions }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gris-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Espace pour le burger mobile */}
          <div className="lg:hidden w-12" />

          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gris-900 truncate">{titre}</h1>
            {sousTitre && <p className="text-sm text-gris-500 mt-0.5 truncate">{sousTitre}</p>}
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <div className="flex items-center gap-2 pl-3 border-l border-gris-200">
              <div className="w-9 h-9 rounded-full bg-bleu flex items-center justify-center shadow-sm">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gris-800">Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
