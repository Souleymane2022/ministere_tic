'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Save, Edit3, X, Check } from 'lucide-react';
import { useAdmin } from '@/lib/admin-store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function OrganismesAdmin() {
  const { organismes, modifierOrganisme } = useAdmin();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ nom: '', description: '' });
  const [saved, setSaved] = useState(false);

  const startEdit = (org: typeof organismes[0]) => {
    setEditId(org.id);
    setEditData({ nom: org.nom, description: org.description });
  };

  const saveEdit = () => {
    if (editId) {
      modifierOrganisme(editId, editData);
      setEditId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <>
      <DashboardHeader
        titre="Organismes"
        sousTitre={`${organismes.length} organismes sous tutelle`}
      />
      <div className="p-6">
        {saved && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700 animate-fadeInUp">
            <Check size={16} />
            Organisme mis a jour avec succes
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {organismes.map((org) => (
            <div key={org.id} className="bg-white rounded-2xl border border-gris-100 p-6">
              {editId === org.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.nom}
                    onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="inline-flex items-center gap-1.5 bg-bleu text-white text-sm px-4 py-2 rounded-lg">
                      <Save size={14} /> Sauvegarder
                    </button>
                    <button onClick={() => setEditId(null)} className="inline-flex items-center gap-1.5 text-gris-500 text-sm px-4 py-2 rounded-lg hover:bg-gris-50">
                      <X size={14} /> Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gris-50 flex items-center justify-center p-1 shrink-0">
                        <Image src={org.logo} alt={org.sigle} width={40} height={40} className="object-contain" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gris-900">{org.sigle}</h3>
                        <p className="text-xs text-gris-500">{org.nom}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startEdit(org)}
                      className="p-2 rounded-lg hover:bg-gris-50 text-gris-400 hover:text-bleu transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gris-600 leading-relaxed line-clamp-3">{org.description}</p>
                  <div
                    className="mt-4 h-1 rounded-full opacity-30"
                    style={{ backgroundColor: org.couleur }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
