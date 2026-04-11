'use client';

import { useState } from 'react';
import { Save, Edit3, X, Check } from 'lucide-react';
import { useAdmin } from '@/lib/admin-store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function ServicesAdmin() {
  const { services, modifierService } = useAdmin();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ titre: '', description: '' });
  const [saved, setSaved] = useState(false);

  const startEdit = (svc: typeof services[0]) => {
    setEditId(svc.id);
    setEditData({ titre: svc.titre, description: svc.description });
  };

  const saveEdit = () => {
    if (editId) {
      modifierService(editId, editData);
      setEditId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <>
      <DashboardHeader
        titre="Services"
        sousTitre={`${services.length} services configures`}
      />
      <div className="p-6">
        {saved && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700 animate-fadeInUp">
            <Check size={16} />
            Service mis a jour avec succes
          </div>
        )}
        <div className="space-y-4">
          {services.map((svc, index) => (
            <div key={svc.id} className="bg-white rounded-2xl border border-gris-100 p-6">
              {editId === svc.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.titre}
                    onChange={(e) => setEditData({ ...editData, titre: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gris-200 font-semibold focus:outline-none focus:ring-2 focus:ring-bleu/20"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="inline-flex items-center gap-1.5 bg-bleu text-white text-sm px-4 py-2 rounded-lg hover:bg-bleu-light"
                    >
                      <Save size={14} />
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="inline-flex items-center gap-1.5 text-gris-500 text-sm px-4 py-2 rounded-lg hover:bg-gris-50"
                    >
                      <X size={14} />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-bleu/10 flex items-center justify-center text-bleu font-bold text-sm shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gris-900">{svc.titre}</h3>
                      <p className="text-sm text-gris-500 mt-1 leading-relaxed">{svc.description}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {svc.details.map((d, i) => (
                          <span key={i} className="text-[10px] bg-gris-100 text-gris-600 px-2 py-0.5 rounded-full">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => startEdit(svc)}
                    className="p-2 rounded-lg hover:bg-gris-50 text-gris-400 hover:text-bleu transition-colors shrink-0"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
