import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Download, CheckCircle, XCircle, Clock, History, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/Loading';
import { formatDateTime, statutBadge, statutLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function GedDetail() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [comment, setComment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => (await api.get(`/documents/${id}`)).data.data,
  });

  const validateMut = useMutation({
    mutationFn: (payload) => api.post(`/documents/${id}/validate`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['document', id] });
      toast.success('Validation enregistrée');
      setComment('');
    },
  });

  const uploadVersion = useMutation({
    mutationFn: (fd) => api.post(`/documents/${id}/version`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['document', id] });
      toast.success('Nouvelle version uploadée');
    },
  });

  async function download() {
    const res = await api.get(`/documents/${id}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url; a.download = data.fichierNom; a.click();
  }

  if (isLoading) return <Loading />;
  if (!data) return null;

  const canValidate = ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'].includes(user?.role);

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/ged" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-sht-primary mb-3">
        <ArrowLeft size={14} /> Retour à la GED
      </Link>

      <PageHeader
        title={data.titre}
        subtitle={`Version ${data.version} • ${data.fichierNom}`}
        actions={<button onClick={download} className="btn-primary"><Download size={16} /> Télécharger</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-3">Informations</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-gray-500">Statut</dt><dd><span className={statutBadge(data.statut)}>{statutLabel(data.statut)}</span></dd></div>
              <div><dt className="text-gray-500">Type</dt><dd>{data.type}</dd></div>
              <div><dt className="text-gray-500">Taille</dt><dd>{(data.taille / 1024).toFixed(1)} Ko</dd></div>
              <div><dt className="text-gray-500">Direction</dt><dd>{data.direction?.nom || '-'}</dd></div>
              <div><dt className="text-gray-500">Auteur</dt><dd>{data.auteur?.prenom} {data.auteur?.nom}</dd></div>
              <div><dt className="text-gray-500">Créé le</dt><dd>{formatDateTime(data.createdAt)}</dd></div>
            </dl>
            {data.description && (
              <div className="mt-4 pt-3 border-t">
                <dt className="text-gray-500 text-sm mb-1">Description</dt>
                <dd className="text-sm">{data.description}</dd>
              </div>
            )}
            {data.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {data.tags.map((t) => <span key={t} className="badge-gray">#{t}</span>)}
              </div>
            )}
          </div>

          {canValidate && data.statut !== 'APPROUVE' && (
            <div className="card">
              <h3 className="font-semibold mb-3">Circuit de validation</h3>
              <textarea
                className="input mb-3"
                placeholder="Commentaire (optionnel)"
                rows="2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => validateMut.mutate({ statut: 'APPROUVE', commentaire: comment })}
                >
                  <CheckCircle size={16} /> Approuver
                </button>
                <button
                  className="btn-outline"
                  onClick={() => validateMut.mutate({ statut: 'EN_REVISION', commentaire: comment })}
                >
                  <Clock size={16} /> Mettre en révision
                </button>
                <button
                  className="btn-danger"
                  onClick={() => validateMut.mutate({ statut: 'REJETE', commentaire: comment })}
                >
                  <XCircle size={16} /> Rejeter
                </button>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><History size={16} /> Historique des validations</h3>
            {data.validations?.length ? (
              <div className="space-y-2">
                {data.validations.map((v) => (
                  <div key={v.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={statutBadge(v.statut)}>{statutLabel(v.statut)}</span>
                        <span className="ml-2 text-sm text-gray-600">par {v.validateur?.prenom} {v.validateur?.nom}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDateTime(v.createdAt)}</span>
                    </div>
                    {v.commentaire && <p className="text-sm text-gray-700 mt-1">{v.commentaire}</p>}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">Aucune validation</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Upload size={16} /> Nouvelle version</h3>
            <input
              type="file"
              className="input mb-2 text-sm"
              onChange={(e) => {
                if (e.target.files[0]) {
                  const fd = new FormData();
                  fd.append('fichier', e.target.files[0]);
                  uploadVersion.mutate(fd);
                }
              }}
            />
            <p className="text-xs text-gray-500">Incrémente automatiquement la version</p>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Versions ({(data.versions?.length || 0) + 1})</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-sht-secondary/10 border border-sht-secondary rounded flex justify-between">
                <span className="font-medium">v{data.version} (actuelle)</span>
                <span className="text-gray-500">{formatDateTime(data.createdAt)}</span>
              </div>
              {data.versions?.map((v) => (
                <div key={v.id} className="p-2 bg-gray-50 rounded flex justify-between">
                  <span>v{v.version}</span>
                  <span className="text-gray-500">{formatDateTime(v.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
