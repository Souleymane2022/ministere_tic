import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Loading, { EmptyState } from '@/components/Loading';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function Contrats() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['contrats'],
    queryFn: async () => (await api.get('/finance/contrats')).data.data,
  });

  const create = useMutation({
    mutationFn: (d) => api.post('/finance/contrats', { ...d, montant: parseFloat(d.montant) }),
    onSuccess: () => { toast.success('Contrat créé'); qc.invalidateQueries({ queryKey: ['contrats'] }); setOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const canManage = ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'].includes(user?.role);

  function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    create.mutate(Object.fromEntries(fd));
  }

  return (
    <div>
      <PageHeader
        title="Contrats fournisseurs"
        subtitle="Gestion des contrats et partenariats"
        actions={canManage && (
          <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Nouveau contrat</button>
        )}
      />

      <div className="card p-0 overflow-hidden">
        {isLoading ? <Loading /> : !data?.length ? (
          <EmptyState icon={FileText} title="Aucun contrat" />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Titre</th>
                  <th>Fournisseur</th>
                  <th>Montant</th>
                  <th>Début</th>
                  <th>Fin</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs">{c.reference}</td>
                    <td className="font-medium">{c.titre}</td>
                    <td>{c.fournisseur}</td>
                    <td>{formatCurrency(c.montant, c.devise)}</td>
                    <td>{formatDate(c.dateDebut)}</td>
                    <td>{formatDate(c.dateFin)}</td>
                    <td><span className="badge-green">{c.statut}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau contrat">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Titre *</label>
            <input name="titre" className="input" required />
          </div>
          <div>
            <label className="label">Fournisseur *</label>
            <input name="fournisseur" className="input" required />
          </div>
          <div>
            <label className="label">Montant (XAF) *</label>
            <input type="number" name="montant" className="input" required min="0" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Début *</label>
              <input type="date" name="dateDebut" className="input" required />
            </div>
            <div>
              <label className="label">Fin *</label>
              <input type="date" name="dateFin" className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" className="input" rows="3" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={create.isPending}>Créer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
