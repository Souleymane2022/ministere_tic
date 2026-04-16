import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileSpreadsheet } from 'lucide-react';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Loading, { EmptyState } from '@/components/Loading';
import { formatDateTime } from '@/lib/utils';

export default function AuditLogs() {
  const [page, setPage] = useState(1);
  const [entite, setEntite] = useState('');
  const [action, setAction] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['audit', page, entite, action],
    queryFn: async () => (await api.get('/admin/audit', { params: { page, pageSize: 50, entite: entite || undefined, action: action || undefined } })).data,
  });

  return (
    <div>
      <PageHeader title="Journal d'audit" subtitle="Traçabilité de toutes les actions du portail" />

      <div className="card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="label">Entité</label>
            <select className="input" value={entite} onChange={(e) => setEntite(e.target.value)}>
              <option value="">Toutes</option>
              <option>User</option>
              <option>Document</option>
              <option>Conge</option>
              <option>Depense</option>
              <option>Projet</option>
              <option>Annonce</option>
            </select>
          </div>
          <div>
            <label className="label">Action (recherche)</label>
            <input className="input" value={action} onChange={(e) => setAction(e.target.value)} placeholder="LOGIN, CREATE, DELETE..." />
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <Loading /> : !data?.data?.length ? (
          <EmptyState icon={FileSpreadsheet} title="Aucun événement" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Utilisateur</th>
                    <th>Action</th>
                    <th>Entité</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((log) => (
                    <tr key={log.id}>
                      <td className="text-xs font-mono">{formatDateTime(log.createdAt)}</td>
                      <td>{log.user ? `${log.user.prenom} ${log.user.nom}` : <span className="text-gray-400">Système</span>}</td>
                      <td><span className="badge-blue">{log.action}</span></td>
                      <td className="text-sm">{log.entite}{log.entiteId ? ` #${log.entiteId.slice(0, 8)}` : ''}</td>
                      <td className="text-xs text-gray-500 font-mono">{log.ip || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t flex items-center justify-between text-sm">
              <span>
                Page {data.page} / {Math.ceil(data.total / data.pageSize)} ({data.total} événements)
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline">← Précédent</button>
                <button onClick={() => setPage((p) => p + 1)} disabled={page * data.pageSize >= data.total} className="btn-outline">Suivant →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
