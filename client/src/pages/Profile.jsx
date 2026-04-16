import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save, Lock } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import PageHeader from '@/components/PageHeader';
import Avatar from '@/components/Avatar';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();

  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    telephone: user?.telephone || '',
    poste: user?.poste || '',
    email: user?.email || '',
  });

  const [pwd, setPwd] = useState({ ancienMotDePasse: '', nouveauMotDePasse: '' });

  const updateProfile = useMutation({
    mutationFn: (data) => api.put(`/users/${user.id}`, data),
    onSuccess: (res) => {
      setUser(res.data.data);
      toast.success('Profil mis à jour');
      qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const changePwd = useMutation({
    mutationFn: (data) => api.post('/auth/change-password', data),
    onSuccess: () => {
      toast.success('Mot de passe modifié');
      setPwd({ ancienMotDePasse: '', nouveauMotDePasse: '' });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const uploadAvatar = useMutation({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append('avatar', file);
      return api.post(`/users/${user.id}/avatar`, fd);
    },
    onSuccess: (res) => {
      setUser(res.data.data);
      toast.success('Photo mise à jour');
    },
    onError: () => toast.error('Erreur upload'),
  });

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Mon profil" subtitle="Gérez vos informations personnelles" />

      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Photo de profil</h3>
        <div className="flex items-center gap-4">
          <Avatar user={user} size={80} />
          <div>
            <label className="btn-outline cursor-pointer">
              Changer la photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files[0] && uploadAvatar.mutate(e.target.files[0])}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">JPG ou PNG, max 2 Mo</p>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Informations personnelles</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); updateProfile.mutate(form); }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="label">Prénom</label>
            <input className="input" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
          </div>
          <div>
            <label className="label">Nom</label>
            <input className="input" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input className="input" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Poste</label>
            <input className="input" value={form.poste} onChange={(e) => setForm({ ...form, poste: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <button className="btn-primary" disabled={updateProfile.isPending}>
              <Save size={16} /> Enregistrer
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Changer mon mot de passe</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); changePwd.mutate(pwd); }}
          className="space-y-3"
        >
          <div>
            <label className="label">Ancien mot de passe</label>
            <input
              type="password"
              className="input"
              value={pwd.ancienMotDePasse}
              onChange={(e) => setPwd({ ...pwd, ancienMotDePasse: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Nouveau mot de passe (min. 8 caractères)</label>
            <input
              type="password"
              className="input"
              minLength={8}
              value={pwd.nouveauMotDePasse}
              onChange={(e) => setPwd({ ...pwd, nouveauMotDePasse: e.target.value })}
              required
            />
          </div>
          <button className="btn-primary" disabled={changePwd.isPending}>
            <Lock size={16} /> Changer le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}
