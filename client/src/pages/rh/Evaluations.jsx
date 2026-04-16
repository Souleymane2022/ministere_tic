import { useQuery } from '@tanstack/react-query';
import { Award } from 'lucide-react';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Loading, { EmptyState } from '@/components/Loading';

export default function Evaluations() {
  const { data, isLoading } = useQuery({
    queryKey: ['evaluations'],
    queryFn: async () => (await api.get('/rh/evaluations')).data.data,
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader title="Évaluations annuelles" subtitle="Performance et objectifs des agents" />

      {!data?.length ? (
        <EmptyState icon={Award} title="Aucune évaluation" subtitle="Les évaluations seront visibles ici" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((e) => (
            <div key={e.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold">{e.agent.prenom} {e.agent.nom}</div>
                  <div className="text-sm text-gray-500">{e.agent.poste}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-sht-accent">{e.note}/20</div>
                  <div className="text-xs text-gray-500">Année {e.annee}</div>
                </div>
              </div>
              {e.pointsForts && <div className="text-sm mb-2"><strong>Points forts :</strong> {e.pointsForts}</div>}
              {e.objectifs && <div className="text-sm text-gray-600"><strong>Objectifs :</strong> {e.objectifs}</div>}
              <div className="text-xs text-gray-400 mt-2">Par {e.evaluateur.prenom} {e.evaluateur.nom}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
