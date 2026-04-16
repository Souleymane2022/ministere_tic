import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, CalendarDays, ClipboardCheck, Building2, Award } from 'lucide-react';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/Loading';

export default function Rh() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users', { params: { pageSize: 100 } })).data,
  });

  if (isLoading) return <Loading />;

  const cards = [
    { to: '/rh/conges', label: 'Congés', icon: CalendarDays, desc: 'Demandes et validations', color: 'from-sht-secondary to-sht-secondary-light' },
    { to: '/rh/presences', label: 'Présences', icon: ClipboardCheck, desc: 'Pointage quotidien', color: 'from-sht-primary to-sht-primary-light' },
    { to: '/rh/organigramme', label: 'Organigramme', icon: Building2, desc: 'Structure organisationnelle', color: 'from-sht-accent to-sht-accent-light' },
    { to: '/rh/evaluations', label: 'Évaluations', icon: Award, desc: 'Performance annuelle', color: 'from-purple-600 to-purple-400' },
    { to: '/annuaire', label: 'Annuaire', icon: Users, desc: 'Répertoire des agents', color: 'from-blue-600 to-blue-400' },
  ];

  return (
    <div>
      <PageHeader title="Ressources Humaines" subtitle="Gestion du personnel et des processus RH" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.to}
              to={c.to}
              className={`bg-gradient-to-br ${c.color} text-white p-6 rounded-xl shadow-soft hover:shadow-card transition hover:-translate-y-0.5`}
            >
              <Icon size={28} className="mb-3" />
              <h3 className="font-bold text-lg">{c.label}</h3>
              <p className="text-sm mt-1 opacity-90">{c.desc}</p>
            </Link>
          );
        })}
      </div>

      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Liste des agents ({users?.total})</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {users?.data?.slice(0, 12).map((u) => (
            <div key={u.id} className="p-3 border rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sht-secondary text-white flex items-center justify-center font-semibold">
                {u.prenom?.charAt(0)}{u.nom?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{u.prenom} {u.nom}</div>
                <div className="text-xs text-gray-500 truncate">{u.poste || u.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
