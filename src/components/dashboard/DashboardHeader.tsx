'use client';

import { Bell, Search, User } from 'lucide-react';

interface DashboardHeaderProps {
  titre: string;
  sousTitre?: string;
}

export default function DashboardHeader({ titre, sousTitre }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gris-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gris-900">{titre}</h1>
          {sousTitre && <p className="text-sm text-gris-500 mt-0.5">{sousTitre}</p>}
        </div>
        <div className="flex items-center gap-3">
          {/* Recherche */}
          <div className="hidden md:flex items-center gap-2 bg-gris-50 rounded-xl px-4 py-2 border border-gris-200">
            <Search size={16} className="text-gris-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent text-sm outline-none w-40 text-gris-700 placeholder:text-gris-400"
            />
          </div>
          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-gris-50 transition-colors">
            <Bell size={20} className="text-gris-600" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rouge" />
          </button>
          {/* Avatar */}
          <div className="flex items-center gap-2 pl-3 border-l border-gris-200">
            <div className="w-8 h-8 rounded-full bg-bleu flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gris-800">Admin</div>
              <div className="text-[10px] text-gris-500">Administrateur</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
