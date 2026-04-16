import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Wallet, Receipt, FileText, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/Loading';
import { formatCurrency } from '@/lib/utils';

export default function Finance() {
  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => (await api.get('/finance/budgets', { params: { annee: new Date().getFullYear() } })).data.data,
  });

  if (isLoading) return <Loading />;

  const totalAlloue = budgets?.reduce((s, b) => s + b.montantAlloue, 0) || 0;
  const totalConsomme = budgets?.reduce((s, b) => s + b.montantConsomme, 0) || 0;

  const chartData = budgets?.map((b) => ({
    direction: b.direction.code,
    alloue: b.montantAlloue,
    consomme: b.montantConsomme,
    restant: b.montantAlloue - b.montantConsomme,
  })) || [];

  return (
    <div>
      <PageHeader title="Gestion Financière" subtitle="Suivi budgétaire et gestion des dépenses" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Link to="/finance/depenses" className="card hover:shadow-card flex items-center gap-4 p-6 bg-gradient-to-br from-sht-primary to-sht-primary-light text-white">
          <Receipt size={40} />
          <div>
            <div className="font-bold text-lg">Demandes de dépenses</div>
            <div className="text-sm opacity-90">Workflow de validation</div>
          </div>
        </Link>
        <Link to="/finance/contrats" className="card hover:shadow-card flex items-center gap-4 p-6 bg-gradient-to-br from-sht-accent to-sht-accent-light text-white">
          <FileText size={40} />
          <div>
            <div className="font-bold text-lg">Contrats fournisseurs</div>
            <div className="text-sm opacity-90">Gestion des partenariats</div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="text-sht-primary" />
            <span className="text-sm text-gray-500">Budget alloué</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalAlloue)}</div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-sht-accent" />
            <span className="text-sm text-gray-500">Budget consommé</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalConsomme)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {totalAlloue ? ((totalConsomme / totalAlloue) * 100).toFixed(1) : 0}% du budget
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="text-sht-secondary" />
            <span className="text-sm text-gray-500">Budget restant</span>
          </div>
          <div className="text-2xl font-bold text-sht-secondary">{formatCurrency(totalAlloue - totalConsomme)}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Budgets par direction - {new Date().getFullYear()}</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="direction" />
            <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend />
            <Bar dataKey="alloue" name="Alloué" fill="#1A2B3C" />
            <Bar dataKey="consomme" name="Consommé" fill="#F57F17" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
