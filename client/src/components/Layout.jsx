import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();

  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    if (!socket) return;

    const onMessage = (msg) => {
      toast.success(`Nouveau message de ${msg.expediteur?.prenom}`);
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['messages'] });
    };
    const onAnnouncement = (a) => {
      toast(`📢 ${a.titre}`, { icon: '📢' });
      qc.invalidateQueries({ queryKey: ['annonces'] });
    };
    socket.on('new-message', onMessage);
    socket.on('new-announcement', onAnnouncement);

    return () => {
      socket.off('new-message', onMessage);
      socket.off('new-announcement', onAnnouncement);
    };
  }, [token, qc]);

  useEffect(() => () => disconnectSocket(), []);

  return (
    <div className="min-h-screen flex bg-sht-bg">
      <Sidebar open={sidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
