import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban, Users, Calendar, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Loading, { EmptyState } from '@/components/Loading';
import { formatDate, formatCurrency, statutBadge, statutLabel } from '@/lib/utils';
import Avatar from '@/components/Avatar';
import { useAuthStore } from '@/store/auth';

export default function Projets() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['projets'],
    queryFn: async () => (await api.get('/projets')).data.data,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users', { params: { pageSize: 100 } })).data.data,
  });

  const { data: directions } = useQuery({
    queryKey: ['directions'],
    queryFn: async () => (await api.get('/directions')).data.data,
  });

  const create = useMutation({
    mutationFn: (d) => api.post('/projets', d),
    onSuccess: () => { toast.success('Projet créé'); qc.invalidateQueries({ queryKey: ['projets'] }); setOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const canCreate = ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'].includes(user?.role);

  function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const d = Object.fromEntries(fd);
    if (d.budget) d.budget = parseFloat(d.budget);
    create.mutate(d);
  }

  return (
    <div>
      <PageHeader
        title="Gestion de projets"
        subtitle="Suivi des projets, tâches et risques"
        actions={canCreate && (
          <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Nouveau projet</button>
        )}
      />

      {isLoading ? <Loading /> : !data?.length ? (
        <EmptyState icon={FolderKanban} title="Aucun projet" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((p) => (
            <Link key={p.id} to={`/projets/${p.id}`} className="card hover:shadow-card transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-500 font-mono">{p.code}</div>
                  <h3 className="font-semibold mt-0.5 line-clamp-2">{p.titre}</h3>
                </div>
                <span className={statutBadge(p.statut)}>{statutLabel(p.statut)}</span>
              </div>

              {p.description && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.description}</p>}

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Avancement</span>
                  <span className="font-medium">{p.avancement}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sht-secondary" style={{ width: `${p.avancement}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 text-xs text-gray-500 gap-2 pt-3 border-t">
                <div className="flex items-center gap-1">
                  <CheckSquare size={12} /> {p._count?.taches || 0} tâches
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} /> {p._count?.membres || 0} membres
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(p.dateFin, 'MMM yy')}
                </div>
              </div>

              {p.chefProjet && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <Avatar user={p.chefProjet} size={24} />
                  <span className="text-xs text-gray-600">Chef : {p.chefProjet.prenom} {p.chefProjet.nom}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau projet" size="lg">
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Code *</label>
              <input name="code" className="input" required placeholder="SDG-2025" />
            </div>
            <div>
              <label className="label">Statut</label>
              <select name="statut" className="input" defaultValue="PLANIFIE">
                <option value="PLANIFIE">Planifié</option>
                <option value="EN_COURS">En cours</option>
                <option value="EN_PAUSE">En pause</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Titre *</label>
            <input name="titre" className="input" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" className="input" rows="3" />
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Chef de projet *</label>
              <select name="chefProjetId" className="input" required>
                <option value="">-- Sélectionner --</option>
                {users?.map((u) => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Direction</label>
              <select name="directionId" className="input">
                <option value="">--</option>
                {directions?.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Budget (XAF)</label>
            <input type="number" name="budget" className="input" min="0" step="1000" />
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
