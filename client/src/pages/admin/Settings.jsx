import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/Loading';

export default function Settings() {
  const qc = useQueryClient();
  const [edits, setEdits] = useState({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/admin/settings')).data.data,
  });

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => (await api.get('/admin/permissions')).data.data,
  });

  const save = useMutation({
    mutationFn: ({ cle, valeur }) => api.put(`/admin/settings/${cle}`, { valeur }),
    onSuccess: () => { toast.success('Enregistré'); qc.invalidateQueries({ queryKey: ['settings'] }); },
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader title="Paramètres du portail" subtitle="Configuration générale du système" />

      <div className="card mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><SettingsIcon size={18} /> Paramètres système</h3>
        <div className="space-y-3">
          {settings?.map((s) => (
            <div key={s.cle} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-mono text-sm font-medium">{s.cle}</div>
                {s.description && <div className="text-xs text-gray-500">{s.description}</div>}
              </div>
              <input
                className="input md:col-span-1"
                value={edits[s.cle] ?? s.valeur}
                onChange={(e) => setEdits({ ...edits, [s.cle]: e.target.value })}
              />
              <button
                className="btn-primary md:w-auto"
                onClick={() => save.mutate({ cle: s.cle, valeur: edits[s.cle] ?? s.valeur })}
              >
                <Save size={14} /> Enregistrer
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Matrice des permissions</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Rôle</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {permissions && Object.entries(permissions).map(([role, perms]) => (
                <tr key={role}>
                  <td className="font-semibold">{role}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {perms.map((p) => <span key={p} className="badge-blue">{p}</span>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
