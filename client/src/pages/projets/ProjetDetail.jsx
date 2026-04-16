import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import { formatDate, formatCurrency, statutBadge, statutLabel } from '@/lib/utils';
import Avatar from '@/components/Avatar';

function Gantt({ taches, dateDebut, dateFin }) {
  if (!taches?.length) return <div className="text-sm text-gray-500 p-4 text-center">Aucune tâche</div>;

  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px] space-y-1.5">
        {taches.map((t) => {
          const tStart = new Date(t.dateDebut || dateDebut);
          const tEnd = new Date(t.deadline || dateFin);
          const offset = Math.max(0, ((tStart - start) / (1000 * 60 * 60 * 24)) / totalDays) * 100;
          const duration = Math.max(2, ((tEnd - tStart) / (1000 * 60 * 60 * 24)) / totalDays) * 100;
          const colors = {
            TERMINEE: 'bg-green-500', EN_COURS: 'bg-blue-500',
            A_FAIRE: 'bg-gray-300', BLOQUEE: 'bg-red-500', EN_REVUE: 'bg-yellow-400',
          };
          return (
            <div key={t.id} className="flex items-center gap-2">
              <div className="w-40 text-xs truncate">{t.titre}</div>
              <div className="flex-1 h-6 relative bg-gray-50 rounded">
                <div
                  className={`absolute top-0 h-full rounded ${colors[t.statut]}`}
                  style={{ left: `${offset}%`, width: `${duration}%` }}
                  title={`${t.avancement}%`}
                >
                  <div className="text-[10px] text-white px-1 truncate">{t.avancement}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProjetDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [tacheOpen, setTacheOpen] = useState(false);
  const [risqueOpen, setRisqueOpen] = useState(false);

  const { data: projet, isLoading } = useQuery({
    queryKey: ['projet', id],
    queryFn: async () => (await api.get(`/projets/${id}`)).data.data,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users', { params: { pageSize: 100 } })).data.data,
  });

  const createTache = useMutation({
    mutationFn: (d) => api.post(`/projets/${id}/taches`, d),
    onSuccess: () => { toast.success('Tâche créée'); qc.invalidateQueries({ queryKey: ['projet', id] }); setTacheOpen(false); },
  });

  const updateTache = useMutation({
    mutationFn: ({ tacheId, data }) => api.put(`/projets/taches/${tacheId}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projet', id] }),
  });

  const createRisque = useMutation({
    mutationFn: (d) => api.post(`/projets/${id}/risques`, d),
    onSuccess: () => { toast.success('Risque ajouté'); qc.invalidateQueries({ queryKey: ['projet', id] }); setRisqueOpen(false); },
  });

  if (isLoading || !projet) return <Loading />;

  function submitTache(e) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    if (fd.avancement) fd.avancement = parseInt(fd.avancement);
    createTache.mutate(fd);
  }

  function submitRisque(e) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    fd.probabilite = parseInt(fd.probabilite);
    fd.impact = parseInt(fd.impact);
    createRisque.mutate(fd);
  }

  return (
    <div>
      <Link to="/projets" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-sht-primary mb-3">
        <ArrowLeft size={14} /> Retour aux projets
      </Link>

      <PageHeader
        title={projet.titre}
        subtitle={`${projet.code} • ${formatDate(projet.dateDebut)} → ${formatDate(projet.dateFin)}`}
      />

      {/* Info projet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <span className={statutBadge(projet.statut)}>{statutLabel(projet.statut)}</span>
            {projet.budget && <span className="text-sm text-gray-500">Budget : <strong>{formatCurrency(projet.budget)}</strong></span>}
          </div>
          {projet.description && <p className="text-sm text-gray-700 mb-3">{projet.description}</p>}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Avancement global</span>
              <span className="font-medium">{projet.avancement}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sht-secondary to-sht-accent" style={{ width: `${projet.avancement}%` }} />
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="font-semibold mb-2">Chef de projet</h4>
          {projet.chefProjet && (
            <div className="flex items-center gap-3">
              <Avatar user={projet.chefProjet} size={44} />
              <div>
                <div className="font-medium">{projet.chefProjet.prenom} {projet.chefProjet.nom}</div>
                <div className="text-xs text-gray-500">{projet.chefProjet.poste}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gantt */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Calendar size={16} /> Diagramme de Gantt</h3>
        <Gantt taches={projet.taches} dateDebut={projet.dateDebut} dateFin={projet.dateFin} />
      </div>

      {/* Tâches */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Tâches ({projet.taches?.length || 0})</h3>
          <button className="btn-primary text-xs" onClick={() => setTacheOpen(true)}>
            <Plus size={14} /> Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {projet.taches?.map((t) => (
            <div key={t.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{t.titre}</span>
                    <span className={statutBadge(t.statut)}>{statutLabel(t.statut)}</span>
                    <span className={statutBadge(t.priorite)}>{statutLabel(t.priorite)}</span>
                  </div>
                  {t.description && <p className="text-xs text-gray-600 mt-1">{t.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    {t.assigne && <span>👤 {t.assigne.prenom} {t.assigne.nom}</span>}
                    {t.deadline && <span>📅 {formatDate(t.deadline)}</span>}
                  </div>
                </div>
                <div className="w-24">
                  <input
                    type="range" min="0" max="100" value={t.avancement}
                    onChange={(e) => updateTache.mutate({ tacheId: t.id, data: { avancement: parseInt(e.target.value) } })}
                    className="w-full"
                  />
                  <div className="text-center text-xs">{t.avancement}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risques */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><AlertTriangle size={16} className="text-orange-500" /> Risques</h3>
          <button className="btn-outline text-xs" onClick={() => setRisqueOpen(true)}>
            <Plus size={14} /> Ajouter un risque
          </button>
        </div>
        {projet.risques?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projet.risques.map((r) => {
              const score = r.probabilite * r.impact;
              const color = score > 15 ? 'border-red-400 bg-red-50' : score > 9 ? 'border-orange-400 bg-orange-50' : 'border-yellow-300 bg-yellow-50';
              return (
                <div key={r.id} className={`p-3 border-l-4 rounded ${color}`}>
                  <div className="font-medium">{r.titre}</div>
                  {r.description && <p className="text-xs text-gray-600 mt-1">{r.description}</p>}
                  <div className="text-xs text-gray-600 mt-2">
                    Prob: {r.probabilite}/5 • Impact: {r.impact}/5 • <strong>Score: {score}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p className="text-sm text-gray-500">Aucun risque identifié</p>}
      </div>

      {/* Modales */}
      <Modal open={tacheOpen} onClose={() => setTacheOpen(false)} title="Nouvelle tâche">
        <form onSubmit={submitTache} className="space-y-3">
          <div>
            <label className="label">Titre *</label>
            <input name="titre" className="input" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" className="input" rows="2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Statut</label>
              <select name="statut" className="input" defaultValue="A_FAIRE">
                <option value="A_FAIRE">À faire</option>
                <option value="EN_COURS">En cours</option>
                <option value="EN_REVUE">En revue</option>
                <option value="TERMINEE">Terminée</option>
              </select>
            </div>
            <div>
              <label className="label">Priorité</label>
              <select name="priorite" className="input" defaultValue="NORMALE">
                <option value="BASSE">Basse</option>
                <option value="NORMALE">Normale</option>
                <option value="HAUTE">Haute</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Assigné à</label>
            <select name="assigneId" className="input">
              <option value="">--</option>
              {users?.map((u) => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Deadline</label>
            <input type="date" name="deadline" className="input" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setTacheOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary">Créer</button>
          </div>
        </form>
      </Modal>

      <Modal open={risqueOpen} onClose={() => setRisqueOpen(false)} title="Nouveau risque">
        <form onSubmit={submitRisque} className="space-y-3">
          <div>
            <label className="label">Titre *</label>
            <input name="titre" className="input" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" className="input" rows="2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Probabilité (1-5)</label>
              <input type="number" name="probabilite" min="1" max="5" className="input" required />
            </div>
            <div>
              <label className="label">Impact (1-5)</label>
              <input type="number" name="impact" min="1" max="5" className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Mitigation</label>
            <textarea name="mitigation" className="input" rows="2" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setRisqueOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary">Ajouter</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
