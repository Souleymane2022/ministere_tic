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
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { nom: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard },
  { nom: 'Actualites', href: '/dashboard/actualites', icon: Newspaper },
  { nom: 'Services', href: '/dashboard/services', icon: Briefcase },
  { nom: 'Organismes', href: '/dashboard/organismes', icon: Building2 },
  { nom: 'Parametres', href: '/dashboard/parametres', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#0a0e27] text-white z-50 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-jaune to-jaune-dark flex items-center justify-center shrink-0">
            <span className="text-bleu font-bold text-sm">TD</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-bold text-sm">MTENDA</div>
              <div className="text-[10px] text-white/50">Administration</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-bleu text-white shadow-lg shadow-bleu/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              title={collapsed ? item.nom : undefined}
            >
              <item.icon size={20} className={`shrink-0 ${active ? 'text-jaune' : 'group-hover:text-jaune/70'}`} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.nom}</span>
              )}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-jaune" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
          title={collapsed ? 'Voir le site' : undefined}
        >
          <Globe size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm">Voir le Site</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 transition-all w-full"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="text-sm">Reduire</span>}
        </button>
      </div>
    </aside>
  );
}
