import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import { Users, FileText, FolderKanban, Wallet, Download, Droplet, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatCurrency, formatNumber } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/Loading';

const COLORS = ['#1A2B3C', '#2E7D32', '#F57F17', '#2C4056', '#4CAF50', '#FFA726', '#546E7A'];

function StatCard({ icon: Icon, label, value, color = 'primary', suffix }) {
  const colorClasses = {
    primary: 'bg-sht-primary/10 text-sht-primary',
    secondary: 'bg-sht-secondary/10 text-sht-secondary',
    accent: 'bg-sht-accent/10 text-sht-accent',
    red: 'bg-red-100 text-red-600',
  };
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}{suffix && <span className="text-sm text-gray-500 ml-1">{suffix}</span>}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data.data,
  });

  async function exportPDF() {
    try {
      const res = await api.get('/dashboard/export/pdf', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-sht-${Date.now()}.pdf`;
      a.click();
      toast.success('Rapport téléchargé');
    } catch {
      toast.error('Erreur lors de l\'export');
    }
  }

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader
        title={`Bonjour, ${user?.prenom} 👋`}
        subtitle={`Bienvenue sur votre tableau de bord ${user?.role === 'AGENT' ? '' : '— vue globale'}`}
        actions={
          <button onClick={exportPDF} className="btn-outline">
            <Download size={16} /> Exporter PDF
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Effectifs actifs" value={formatNumber(data?.kpi.effectif || 0)} color="primary" />
        <StatCard icon={FolderKanban} label="Projets en cours" value={data?.kpi.projetsEnCours || 0} color="secondary" />
        <StatCard icon={FileText} label="Documents à valider" value={data?.kpi.documentsSoumis || 0} color="accent" />
        <StatCard icon={Calendar} label="Congés en attente" value={data?.kpi.congesEnAttente || 0} color="red" />
      </div>

      {/* Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Budget global {new Date().getFullYear()}</h3>
            <Wallet className="text-sht-accent" size={20} />
          </div>
          <div className="text-3xl font-bold text-sht-primary">
            {formatCurrency(data?.kpi.budgetAlloue || 0)}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Consommé</span>
              <span className="font-medium">
                {(((data?.kpi.budgetConsomme || 0) / (data?.kpi.budgetAlloue || 1)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sht-secondary to-sht-accent"
                style={{ width: `${((data?.kpi.budgetConsomme || 0) / (data?.kpi.budgetAlloue || 1)) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatCurrency(data?.kpi.budgetConsomme || 0)} consommés
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Droplet size={18} className="text-sht-secondary" />
              Production (30 derniers jours)
            </h3>
            <span className="text-xs text-gray-500">Barils / jour</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data?.production}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="barils" stroke="#2E7D32" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphiques bas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Effectifs par direction</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data?.effectifsParDirection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="direction" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="effectif" fill="#1A2B3C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Budgets par direction</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data?.budgetsParDirection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="direction" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="alloue" name="Alloué" fill="#1A2B3C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="consomme" name="Consommé" fill="#F57F17" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Répartition des tâches</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data?.tachesParStatut || []}
                dataKey="count"
                nameKey="statut"
                cx="50%" cy="50%"
                outerRadius={90}
                label={(e) => `${e.statut}: ${e.count}`}
              >
                {(data?.tachesParStatut || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Accès rapides</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/ged', label: 'Documents', color: 'from-sht-primary to-sht-primary-light' },
              { to: '/rh/conges', label: 'Mes congés', color: 'from-sht-secondary to-sht-secondary-light' },
              { to: '/projets', label: 'Projets', color: 'from-sht-accent to-sht-accent-light' },
              { to: '/communication', label: 'Annonces', color: 'from-blue-600 to-blue-400' },
            ].map((x) => (
              <a key={x.to} href={x.to} className={`bg-gradient-to-br ${x.color} text-white p-4 rounded-xl hover:opacity-90 transition`}>
                <div className="font-semibold">{x.label}</div>
                <div className="text-xs mt-1 opacity-80">Accès direct →</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
