import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/Loading';
import Avatar from '@/components/Avatar';
import { Building2, Crown } from 'lucide-react';

export default function Organigramme() {
  const { data, isLoading } = useQuery({
    queryKey: ['organigramme'],
    queryFn: async () => (await api.get('/directions/tree/organigramme')).data.data,
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader title="Organigramme" subtitle="Structure hiérarchique de la SHT" />

      <div className="space-y-6">
        {data?.map((dir) => (
          <div key={dir.id} className="card">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
              <div className="p-3 bg-sht-primary/10 rounded-lg">
                <Building2 size={24} className="text-sht-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-sht-primary">{dir.nom}</h3>
                <div className="text-xs text-gray-500">Code : {dir.code} • {dir.agents?.length || 0} agents</div>
              </div>
            </div>

            {dir.responsable && (
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-sht-accent/10 to-transparent flex items-center gap-3">
                <div className="relative">
                  <Avatar user={dir.responsable} size={48} />
                  <Crown size={16} className="absolute -top-1 -right-1 text-sht-accent" />
                </div>
                <div>
                  <div className="font-semibold">{dir.responsable.prenom} {dir.responsable.nom}</div>
                  <div className="text-sm text-gray-600">{dir.responsable.poste}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {dir.agents?.filter((a) => a.id !== dir.responsable?.id).map((a) => (
                <div key={a.id} className="p-3 border rounded-lg flex items-center gap-2 hover:shadow-soft transition">
                  <Avatar user={a} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{a.prenom} {a.nom}</div>
                    <div className="text-xs text-gray-500 truncate">{a.poste || a.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
