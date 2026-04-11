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
      <div className="min-h-screen bg-gris-50">
        <Sidebar />
        <div className="lg:ml-64 min-h-screen">
          {children}
        </div>
      </div>
    </AdminProvider>
  );
}
