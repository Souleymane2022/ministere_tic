import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Mail, Phone, MessageCircle } from 'lucide-react';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/Loading';
import Avatar from '@/components/Avatar';
import { roleBadge } from '@/lib/utils';

export default function Annuaire() {
  const [search, setSearch] = useState('');
  const [directionId, setDirectionId] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', search, directionId],
    queryFn: async () => (await api.get('/users', { params: { search, directionId: directionId || undefined, pageSize: 100 } })).data.data,
  });

  const { data: directions } = useQuery({
    queryKey: ['directions'],
    queryFn: async () => (await api.get('/directions')).data.data,
  });

  return (
    <div>
      <PageHeader title="Annuaire" subtitle="Répertoire des agents SHT" />

      <div className="card mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              className="input pl-10"
              placeholder="Rechercher par nom, prénom, email, poste..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input md:w-64" value={directionId} onChange={(e) => setDirectionId(e.target.value)}>
            <option value="">Toutes les directions</option>
            {directions?.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? <Loading /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {users?.map((u) => (
            <div key={u.id} className="card p-4 hover:shadow-card transition">
              <div className="flex items-center gap-3 mb-3">
                <Avatar user={u} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{u.prenom} {u.nom}</div>
                  <div className="text-xs text-gray-500 truncate">{u.poste || u.role}</div>
                  <span className={`${roleBadge(u.role)} text-[9px] mt-0.5 inline-block`}>{u.role}</span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2 truncate">
                  <Mail size={12} /> <span className="truncate">{u.email}</span>
                </div>
                {u.telephone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} /> {u.telephone}
                  </div>
                )}
                {u.direction && <div className="text-gray-500 mt-1">{u.direction.nom}</div>}
              </div>
              <Link to={`/messages/${u.id}`} className="btn-outline w-full mt-3 text-xs">
                <MessageCircle size={12} /> Envoyer un message
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
