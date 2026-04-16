import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Activity, Shield, Settings as SettingsIcon, UserCheck, UserX, Trash2, Edit, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import Avatar from '@/components/Avatar';
import { formatNumber, formatCurrency, roleBadge } from '@/lib/utils';

export default function Admin() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data.data,
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/users', { params: { pageSize: 200 } })).data.data,
  });

  const { data: directions } = useQuery({
    queryKey: ['directions'],
    queryFn: async () => (await api.get('/directions')).data.data,
  });

  const createUser = useMutation({
    mutationFn: (d) => api.post('/users', d),
    onSuccess: () => { toast.success('Utilisateur créé'); qc.invalidateQueries({ queryKey: ['admin-users'] }); setCreateOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }) => api.put(`/users/${id}`, data),
    onSuccess: () => { toast.success('Modifié'); qc.invalidateQueries({ queryKey: ['admin-users'] }); setEditUser(null); },
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, actif }) => api.patch(`/users/${id}/activate`, { actif }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const delUser = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => { toast.success('Supprimé'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
  });

  function submitCreate(e) {
    e.preventDefault();
    createUser.mutate(Object.fromEntries(new FormData(e.target)));
  }

  function submitEdit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    updateUser.mutate({ id: editUser.id, data });
  }

  return (
    <div>
      <PageHeader
        title="Administration système"
        subtitle="Gestion des utilisateurs, rôles et paramètres"
        actions={
          <div className="flex gap-2">
            <Link to="/admin/audit" className="btn-outline"><FileText size={16} /> Journal</Link>
            <Link to="/admin/settings" className="btn-outline"><SettingsIcon size={16} /> Paramètres</Link>
            <button className="btn-primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Nouvel utilisateur</button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-1"><Users size={16} /> Utilisateurs</div>
          <div className="text-2xl font-bold">{stats?.utilisateurs.total || 0}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats?.utilisateurs.actifs} actifs • {stats?.utilisateurs.inactifs} inactifs
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-1"><FileText size={16} /> Documents</div>
          <div className="text-2xl font-bold">{formatNumber(stats?.documents || 0)}</div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-1"><Shield size={16} /> Budget global</div>
          <div className="text-xl font-bold">{formatCurrency(stats?.budget.alloue || 0)}</div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-1"><Activity size={16} /> Actions (24h)</div>
          <div className="text-2xl font-bold">{stats?.logs24h || 0}</div>
        </div>
      </div>

      {/* Table users */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Utilisateurs du portail</h3>
        </div>
        {isLoading ? <Loading /> : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Direction</th>
                  <th>Statut</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar user={u} size={28} />
                        <div>
                          <div className="font-medium">{u.prenom} {u.nom}</div>
                          <div className="text-xs text-gray-500">{u.poste}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{u.email}</td>
                    <td><span className={roleBadge(u.role)}>{u.role}</span></td>
                    <td>{u.direction?.code || '-'}</td>
                    <td>
                      {u.actif
                        ? <span className="badge-green">Actif</span>
                        : <span className="badge-red">Inactif</span>}
                    </td>
                    <td>
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => setEditUser(u)} className="p-1.5 hover:bg-gray-100 rounded">
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => toggleActive.mutate({ id: u.id, actif: !u.actif })}
                          className="p-1.5 hover:bg-gray-100 rounded"
                          title={u.actif ? 'Désactiver' : 'Activer'}
                        >
                          {u.actif ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                        <button
                          onClick={() => window.confirm('Supprimer définitivement ?') && delUser.mutate(u.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nouvel utilisateur" size="lg">
        <form onSubmit={submitCreate} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Prénom *</label><input name="prenom" className="input" required /></div>
            <div><label className="label">Nom *</label><input name="nom" className="input" required /></div>
          </div>
          <div><label className="label">Email *</label><input type="email" name="email" className="input" required /></div>
          <div><label className="label">Mot de passe * (min. 8)</label><input type="password" name="password" className="input" minLength="8" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Rôle *</label>
              <select name="role" className="input" required defaultValue="AGENT">
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="DIRECTEUR">Directeur</option>
                <option value="AGENT">Agent</option>
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
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Téléphone</label><input name="telephone" className="input" /></div>
            <div><label className="label">Poste</label><input name="poste" className="input" /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setCreateOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={createUser.isPending}>Créer</button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Modifier l'utilisateur">
        {editUser && (
          <form onSubmit={submitEdit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Prénom</label><input name="prenom" className="input" defaultValue={editUser.prenom} /></div>
              <div><label className="label">Nom</label><input name="nom" className="input" defaultValue={editUser.nom} /></div>
            </div>
            <div><label className="label">Email</label><input type="email" name="email" className="input" defaultValue={editUser.email} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Rôle</label>
                <select name="role" className="input" defaultValue={editUser.role}>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="DIRECTEUR">Directeur</option>
                  <option value="AGENT">Agent</option>
                </select>
              </div>
              <div>
                <label className="label">Direction</label>
                <select name="directionId" className="input" defaultValue={editUser.directionId || ''}>
                  <option value="">--</option>
                  {directions?.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Téléphone</label><input name="telephone" className="input" defaultValue={editUser.telephone || ''} /></div>
              <div><label className="label">Poste</label><input name="poste" className="input" defaultValue={editUser.poste || ''} /></div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-outline" onClick={() => setEditUser(null)}>Annuler</button>
              <button type="submit" className="btn-primary">Enregistrer</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
