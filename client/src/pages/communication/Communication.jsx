import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pin, Megaphone, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Loading, { EmptyState } from '@/components/Loading';
import { timeAgo } from '@/lib/utils';
import Avatar from '@/components/Avatar';
import { useAuthStore } from '@/store/auth';

const CATEGORIES = {
  GENERALE: { label: 'Générale', color: 'bg-gray-100 text-gray-800' },
  RH: { label: 'RH', color: 'bg-blue-100 text-blue-800' },
  DIRECTION: { label: 'Direction', color: 'bg-purple-100 text-purple-800' },
  PROJET: { label: 'Projet', color: 'bg-green-100 text-green-800' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-800' },
};

export default function Communication() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['annonces', cat],
    queryFn: async () => (await api.get('/communication/annonces', { params: { categorie: cat || undefined } })).data.data,
  });

  const create = useMutation({
    mutationFn: (d) => api.post('/communication/annonces', d),
    onSuccess: () => { toast.success('Annonce publiée'); qc.invalidateQueries({ queryKey: ['annonces'] }); setOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/communication/annonces/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['annonces'] }),
  });

  const canPublish = ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'].includes(user?.role);

  function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    data.epingle = data.epingle === 'on';
    create.mutate(data);
  }

  return (
    <div>
      <PageHeader
        title="Annonces & Actualités"
        subtitle="Fil d'actualité de l'entreprise"
        actions={canPublish && (
          <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Nouvelle annonce</button>
        )}
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        {['', ...Object.keys(CATEGORIES)].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${cat === c ? 'bg-sht-primary text-white' : 'bg-white border border-gray-300'}`}
          >
            {c === '' ? 'Toutes' : CATEGORIES[c].label}
          </button>
        ))}
      </div>

      {isLoading ? <Loading /> : !data?.length ? (
        <EmptyState icon={Megaphone} title="Aucune annonce" />
      ) : (
        <div className="space-y-3">
          {data.map((a) => (
            <div key={a.id} className={`card ${a.epingle ? 'border-l-4 border-l-sht-accent' : ''}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <Avatar user={a.auteur} size={40} />
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {a.epingle && <Pin size={14} className="text-sht-accent" />}
                      {a.titre}
                    </div>
                    <div className="text-xs text-gray-500">
                      {a.auteur?.prenom} {a.auteur?.nom} • {timeAgo(a.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${CATEGORIES[a.categorie]?.color}`}>
                    {CATEGORIES[a.categorie]?.label}
                  </span>
                  {canPublish && (
                    <button
                      onClick={() => window.confirm('Supprimer ?') && del.mutate(a.id)}
                      className="p-1 hover:bg-red-50 text-red-500 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{a.contenu}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle annonce">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Titre *</label>
            <input name="titre" className="input" required />
          </div>
          <div>
            <label className="label">Catégorie *</label>
            <select name="categorie" className="input" defaultValue="GENERALE">
              {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Contenu *</label>
            <textarea name="contenu" className="input" rows="5" required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="epingle" /> Épingler cette annonce
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={create.isPending}>Publier</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
