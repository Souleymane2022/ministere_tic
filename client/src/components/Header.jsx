import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, Menu, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { timeAgo, roleBadge, cn } from '@/lib/utils';
import Avatar from './Avatar';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/communication/notifications')).data,
    refetchInterval: 30_000,
  });

  const markAll = useMutation({
    mutationFn: () => api.patch('/communication/notifications/all/lu'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  async function handleLogout() {
    try { await api.post('/auth/logout'); } catch {}
    logout();
    navigate('/login');
  }

  const nonLus = notifData?.nonLus || 0;

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 shadow-soft">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-sht-primary hidden sm:block">
          Portail de gestion SHT
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-lg hover:bg-gray-100"
          >
            <Bell size={20} className="text-gray-600" />
            {nonLus > 0 && (
              <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-sht-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {nonLus > 9 ? '9+' : nonLus}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
              <div className="p-3 border-b flex items-center justify-between">
                <div className="font-semibold">Notifications</div>
                {nonLus > 0 && (
                  <button
                    onClick={() => markAll.mutate()}
                    className="text-xs text-sht-primary hover:underline flex items-center gap-1"
                  >
                    <Check size={12} /> Tout marquer
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifData?.data?.length ? (
                  notifData.data.map((n) => (
                    <div
                      key={n.id}
                      className={cn('p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer',
                        !n.lu && 'bg-blue-50/40')}
                    >
                      <div className="font-medium text-sm">{n.titre}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{n.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500">Aucune notification</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profil */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <Avatar user={user} size={32} />
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">{user?.prenom} {user?.nom}</div>
              <div className={`${roleBadge(user?.role)} text-[9px]`}>{user?.role}</div>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
              <div className="p-3 border-b">
                <div className="font-medium">{user?.prenom} {user?.nom}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
              >
                Mon profil
              </button>
              <button
                onClick={() => { setProfileOpen(false); navigate('/2fa'); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
              >
                Sécurité (2FA)
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 border-t"
              >
                <LogOut size={14} /> Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
