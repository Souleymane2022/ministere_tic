'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Building2,
  Settings,
  Globe,
  X,
  Menu,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const menuItems = [
  { nom: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard },
  { nom: 'Actualites', href: '/dashboard/actualites', icon: Newspaper },
  { nom: 'Services', href: '/dashboard/services', icon: Briefcase },
  { nom: 'Organismes', href: '/dashboard/organismes', icon: Building2 },
  { nom: 'Parametres', href: '/dashboard/parametres', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fermer le menu mobile sur changement de route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-jaune to-jaune-dark flex items-center justify-center shrink-0 shadow-lg shadow-jaune/20">
            <span className="text-bleu font-bold text-xs">TD</span>
          </div>
          <div>
            <div className="font-bold text-sm text-white">MTENDA</div>
            <div className="text-[10px] text-white/40">Administration</div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
          aria-label="Fermer le menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Label section */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Menu</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-bleu text-white shadow-lg shadow-bleu/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={active ? 'text-jaune' : 'group-hover:text-jaune/60'} />
              <span className="text-sm font-medium">{item.nom}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-jaune" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 mt-auto">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Globe size={18} />
          <span className="text-sm">Voir le Site</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Bouton burger mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-[#0a0e27] text-white p-2.5 rounded-xl shadow-xl"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-[#0a0e27] text-white z-40 flex-col shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile - Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 h-full bg-[#0a0e27] text-white shadow-2xl animate-slideInLeft">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
