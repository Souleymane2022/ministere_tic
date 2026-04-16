import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Loading, { EmptyState } from '@/components/Loading';
import { formatDate, statutBadge, statutLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import Avatar from '@/components/Avatar';

export default function Conges() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [statut, setStatut] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['conges', statut],
    queryFn: async () => (await api.get('/rh/conges', { params: { statut: statut || undefined } })).data.data,
  });

  const create = useMutation({
    mutationFn: (d) => api.post('/rh/conges', d),
    onSuccess: () => { toast.success('Demande créée'); qc.invalidateQueries({ queryKey: ['conges'] }); setOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const decide = useMutation({
    mutationFn: ({ id, statut, commentaire }) => api.patch(`/rh/conges/${id}/decision`, { statut, commentaire }),
    onSuccess: () => { toast.success('Décision enregistrée'); qc.invalidateQueries({ queryKey: ['conges'] }); },
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
        title="Demandes de congés"
        subtitle="Gestion des congés avec workflow d'approbation"
        actions={<button className="btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Nouvelle demande</button>}
      />

      <div className="card mb-4">
        <div className="flex gap-2">
          {['', 'EN_ATTENTE', 'APPROUVE', 'REJETE'].map((s) => (
            <button
              key={s}
              onClick={() => setStatut(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statut === s ? 'bg-sht-primary text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
            >
              {s === '' ? 'Tous' : statutLabel(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <Loading /> : !data?.length ? (
          <EmptyState icon={CalendarDays} title="Aucune demande" />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Type</th>
                  <th>Du</th>
                  <th>Au</th>
                  <th>Jours</th>
                  <th>Motif</th>
                  <th>Statut</th>
                  {canApprove && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar user={c.agent} size={28} />
                        <span>{c.agent?.prenom} {c.agent?.nom}</span>
                      </div>
                    </td>
                    <td>{c.type}</td>
                    <td>{formatDate(c.dateDebut)}</td>
                    <td>{formatDate(c.dateFin)}</td>
                    <td><strong>{c.nbJours}</strong></td>
                    <td className="max-w-xs truncate">{c.motif || '-'}</td>
                    <td><span className={statutBadge(c.statut)}>{statutLabel(c.statut)}</span></td>
                    {canApprove && (
                      <td>
                        {c.statut === 'EN_ATTENTE' && c.agentId !== user?.id && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => decide.mutate({ id: c.id, statut: 'APPROUVE' })}
                              className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                              title="Approuver"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => decide.mutate({ id: c.id, statut: 'REJETE' })}
                              className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                              title="Rejeter"
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

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle demande de congé">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Type *</label>
            <select name="type" className="input" required>
              <option value="ANNUEL">Annuel</option>
              <option value="MALADIE">Maladie</option>
              <option value="MATERNITE">Maternité</option>
              <option value="PATERNITE">Paternité</option>
              <option value="SANS_SOLDE">Sans solde</option>
              <option value="EXCEPTIONNEL">Exceptionnel</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date début *</label>
              <input type="date" name="dateDebut" className="input" required />
            </div>
            <div>
              <label className="label">Date fin *</label>
              <input type="date" name="dateFin" className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Motif</label>
            <textarea name="motif" className="input" rows="3" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={create.isPending}>Envoyer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
