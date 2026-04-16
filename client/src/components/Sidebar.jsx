import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, Wallet, MessagesSquare,
  FolderKanban, ShieldCheck, Settings, UserCircle, Building2, BookUser,
  CalendarDays, ClipboardCheck, Megaphone, Mail, FileSpreadsheet,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import Logo from './Logo';

const sections = [
  {
    title: 'Tableau de bord',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Accueil', exact: true },
    ],
  },
  {
    title: 'Gestion',
    items: [
      { to: '/ged', icon: FileText, label: 'GED - Documents' },
      { to: '/projets', icon: FolderKanban, label: 'Projets' },
      { to: '/finance', icon: Wallet, label: 'Finance' },
    ],
  },
  {
    title: 'RH & Organisation',
    items: [
      { to: '/rh', icon: Users, label: 'Ressources Humaines' },
      { to: '/rh/conges', icon: CalendarDays, label: 'Congés' },
      { to: '/rh/presences', icon: ClipboardCheck, label: 'Présences' },
      { to: '/rh/organigramme', icon: Building2, label: 'Organigramme' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { to: '/communication', icon: Megaphone, label: 'Annonces' },
      { to: '/messages', icon: Mail, label: 'Messagerie' },
      { to: '/annuaire', icon: BookUser, label: 'Annuaire' },
    ],
  },
  {
    title: 'Administration',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { to: '/admin', icon: ShieldCheck, label: 'Administration' },
      { to: '/admin/audit', icon: FileSpreadsheet, label: 'Journal d\'audit' },
      { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
    ],
  },
];

export default function Sidebar({ open }) {
  const user = useAuthStore((s) => s.user);

  return (
    <aside
      className={`${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen w-64 bg-sht-sidebar text-white z-40 transition-transform overflow-y-auto flex flex-col`}
    >
      <div className="px-5 py-5 border-b border-white/10">
        <Logo light size={38} />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5">
        {sections.map((section) => {
          if (section.roles && !section.roles.includes(user?.role)) return null;
          return (
            <div key={section.title}>
              <div className="px-3 text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                      }
                    >
                      <Icon size={18} />
                      <span className="text-sm">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-white/10">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
          <UserCircle size={18} />
          <span className="text-sm">Mon profil</span>
        </NavLink>
      </div>
    </aside>
  );
}
