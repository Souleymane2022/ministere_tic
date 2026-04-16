import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Loading, { EmptyState } from '@/components/Loading';
import { formatDate, formatCurrency, statutBadge, statutLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function Depenses() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['depenses'],
    queryFn: async () => (await api.get('/finance/depenses')).data.data,
  });

  const { data: directions } = useQuery({
    queryKey: ['directions'],
    queryFn: async () => (await api.get('/directions')).data.data,
  });

  const create = useMutation({
    mutationFn: (d) => api.post('/finance/depenses', { ...d, montant: parseFloat(d.montant) }),
    onSuccess: () => { toast.success('Demande créée'); qc.invalidateQueries({ queryKey: ['depenses'] }); setOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const decide = useMutation({
    mutationFn: ({ id, statut }) => api.patch(`/finance/depenses/${id}/decision`, { statut }),
    onSuccess: () => { toast.success('Décision enregistrée'); qc.invalidateQueries({ queryKey: ['depenses'] }); },
  });

  const canApprove = ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'].includes(user?.role);

  function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    create.mutate(Object.fromEntries(fd));
  }

  return (
    <div>
      <PageHeader
        title="Demandes de dépenses"
        subtitle="Workflow de validation des dépenses"
        actions={<button className="btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Nouvelle demande</button>}
      />

      <div className="card p-0 overflow-hidden">
        {isLoading ? <Loading /> : !data?.length ? (
          <EmptyState icon={Receipt} title="Aucune dépense" />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Libellé</th>
                  <th>Demandeur</th>
                  <th>Direction</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                  {canApprove && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.id}>
                    <td className="font-mono text-xs">{d.reference}</td>
                    <td className="font-medium">{d.libelle}</td>
                    <td>{d.demandeur?.prenom} {d.demandeur?.nom}</td>
                    <td>{d.direction?.code || '-'}</td>
                    <td className="font-semibold">{formatCurrency(d.montant, d.devise)}</td>
                    <td><span className={statutBadge(d.statut)}>{statutLabel(d.statut)}</span></td>
                    <td>{formatDate(d.createdAt)}</td>
                    {canApprove && (
                      <td>
                        {d.statut === 'SOUMISE' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => decide.mutate({ id: d.id, statut: 'APPROUVEE' })}
                              className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => decide.mutate({ id: d.id, statut: 'REJETEE' })}
                              className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle demande de dépense">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Libellé *</label>
            <input name="libelle" className="input" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" className="input" rows="2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Montant (XAF) *</label>
              <input type="number" name="montant" className="input" required min="0" step="1000" />
            </div>
            <div>
              <label className="label">Catégorie</label>
              <input name="categorie" className="input" placeholder="Mission, IT, Achat..." />
            </div>
          </div>
          <div>
            <label className="label">Direction</label>
            <select name="directionId" className="input">
              <option value="">-- Ma direction --</option>
              {directions?.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={create.isPending}>Soumettre</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
