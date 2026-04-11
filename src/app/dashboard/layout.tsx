import { AdminProvider } from '@/lib/admin-store';
import Sidebar from '@/components/dashboard/Sidebar';

export const metadata = {
  title: 'Dashboard | MTENDA Administration',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gris-50 flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          {children}
        </div>
      </div>
    </AdminProvider>
  );
}
