import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Upload, Search, FileText, Download, Trash2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Loading, { EmptyState } from '@/components/Loading';
import { formatDate, statutBadge, statutLabel, cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function Ged() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['documents', search, filterStatut],
    queryFn: async () => {
      const res = await api.get('/documents', { params: { search, statut: filterStatut || undefined } });
      return res.data;
    },
  });

  const { data: directions } = useQuery({
    queryKey: ['directions'],
    queryFn: async () => (await api.get('/directions')).data.data,
  });

  const uploadMut = useMutation({
    mutationFn: (fd) => api.post('/documents', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      toast.success('Document uploadé');
      qc.invalidateQueries({ queryKey: ['documents'] });
      setUploadOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur upload'),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/documents/${id}`),
    onSuccess: () => {
      toast.success('Supprimé');
      qc.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  async function download(doc) {
    try {
      const res = await api.get(`/documents/${doc.id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fichierNom;
      a.click();
    } catch { toast.error('Erreur téléchargement'); }
  }

  function submitUpload(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    uploadMut.mutate(fd);
  }

  return (
    <div>
      <PageHeader
        title="Gestion Documentaire (GED)"
        subtitle="Stockage, versioning et circuit de validation des documents"
        actions={
          <button className="btn-primary" onClick={() => setUploadOpen(true)}>
            <Upload size={16} /> Nouveau document
          </button>
        }
      />

      <div className="card mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              className="input pl-10"
              placeholder="Rechercher un document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input md:w-56" value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="SOUMIS">Soumis</option>
            <option value="EN_REVISION">En révision</option>
            <option value="APPROUVE">Approuvé</option>
            <option value="REJETE">Rejeté</option>
            <option value="ARCHIVE">Archivé</option>
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <Loading /> : (!data?.data?.length ? (
          <EmptyState icon={FileText} title="Aucun document" subtitle="Créez votre premier document" />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Type</th>
                  <th>Direction</th>
                  <th>Auteur</th>
                  <th>Version</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <Link to={`/ged/${d.id}`} className="font-medium text-sht-primary hover:underline flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        {d.titre}
                      </Link>
                    </td>
                    <td>{d.type}</td>
                    <td>{d.direction?.code || '-'}</td>
                    <td>{d.auteur?.prenom} {d.auteur?.nom}</td>
                    <td>v{d.version}</td>
                    <td><span className={statutBadge(d.statut)}>{statutLabel(d.statut)}</span></td>
                    <td>{formatDate(d.createdAt)}</td>
                    <td className="text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => download(d)} className="p-1.5 hover:bg-gray-100 rounded" title="Télécharger">
                          <Download size={14} />
                        </button>
                        {(d.auteurId === user?.id || ['SUPER_ADMIN', 'ADMIN'].includes(user?.role)) && (
                          <button
                            onClick={() => window.confirm('Supprimer ?') && deleteMut.mutate(d.id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Uploader un document">
        <form onSubmit={submitUpload} className="space-y-3">
          <div>
            <label className="label">Fichier *</label>
            <input type="file" name="fichier" required className="input" />
            <p className="text-xs text-gray-500 mt-1">PDF, Word, Excel, images - max 10 Mo</p>
          </div>
          <div>
            <label className="label">Titre</label>
            <input type="text" name="titre" className="input" placeholder="Titre du document" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" className="input" rows="3" />
          </div>
          <div>
            <label className="label">Direction</label>
            <select name="directionId" className="input">
              <option value="">-- Sélectionner --</option>
              {directions?.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Tags (séparés par des virgules)</label>
            <input type="text" name="tags" className="input" placeholder="rapport, 2025, trimestre" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-outline" onClick={() => setUploadOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={uploadMut.isPending}>
              {uploadMut.isPending ? 'Upload...' : 'Uploader'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
