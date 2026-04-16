import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, LogIn, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Loading, { EmptyState } from '@/components/Loading';
import { formatDate, formatDateTime } from '@/lib/utils';
import Avatar from '@/components/Avatar';

export default function Presences() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['presences'],
    queryFn: async () => (await api.get('/rh/presences')).data.data,
  });

  const pointer = useMutation({
    mutationFn: (type) => api.post(`/rh/presences/pointage-${type}`),
    onSuccess: (_, type) => {
      toast.success(`${type === 'arrivee' ? 'Arrivée' : 'Départ'} pointé(e)`);
      qc.invalidateQueries({ queryKey: ['presences'] });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  return (
    <div>
      <PageHeader title="Feuilles de présence" subtitle="Pointage quotidien des arrivées et départs" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => pointer.mutate('arrivee')}
          className="card hover:shadow-card transition flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200"
        >
          <div>
            <div className="font-semibold text-green-900 text-lg">Pointer mon arrivée</div>
            <div className="text-sm text-green-700 mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          </div>
          <div className="p-3 bg-green-600 rounded-full">
            <LogIn size={24} className="text-white" />
          </div>
        </button>

        <button
          onClick={() => pointer.mutate('depart')}
          className="card hover:shadow-card transition flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
        >
          <div>
            <div className="font-semibold text-blue-900 text-lg">Pointer mon départ</div>
            <div className="text-sm text-blue-700 mt-1">Enregistrer la fin de journée</div>
          </div>
          <div className="p-3 bg-blue-600 rounded-full">
            <LogOut size={24} className="text-white" />
          </div>
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <Loading /> : !data?.length ? (
          <EmptyState icon={Clock} title="Aucune présence enregistrée" />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Date</th>
                  <th>Arrivée</th>
                  <th>Départ</th>
                  <th>Heures</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar user={p.agent} size={24} />
                        <span>{p.agent?.prenom} {p.agent?.nom}</span>
                      </div>
                    </td>
                    <td>{formatDate(p.date)}</td>
                    <td>{p.heureArrivee ? formatDateTime(p.heureArrivee).slice(-5) : '-'}</td>
                    <td>{p.heureDepart ? formatDateTime(p.heureDepart).slice(-5) : '-'}</td>
                    <td>{p.nbHeures ? `${p.nbHeures}h` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
