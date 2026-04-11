'use client';

import { useState } from 'react';
import { RotateCcw, Check, AlertTriangle, Database, Globe, Shield } from 'lucide-react';
import { useAdmin } from '@/lib/admin-store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function ParametresPage() {
  const { reinitialiser, stats } = useAdmin();
  const [confirmerReset, setConfirmerReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    reinitialiser();
    setConfirmerReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <>
      <DashboardHeader
        titre="Parametres"
        sousTitre="Configuration du dashboard"
      />
      <div className="p-6 max-w-3xl">
        {resetDone && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-sm text-green-700 animate-fadeInUp">
            <Check size={16} />
            Donnees reinitialises avec succes
          </div>
        )}

        <div className="space-y-6">
          {/* Infos du site */}
          <div className="bg-white rounded-2xl border border-gris-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe size={20} className="text-bleu" />
              <h2 className="font-bold text-gris-900">Informations du Site</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gris-50 rounded-xl p-4">
                <p className="text-xs text-gris-500 mb-1">Nom du site</p>
                <p className="font-semibold text-gris-800">MTENDA - Tchad</p>
              </div>
              <div className="bg-gris-50 rounded-xl p-4">
                <p className="text-xs text-gris-500 mb-1">Framework</p>
                <p className="font-semibold text-gris-800">Next.js 16</p>
              </div>
              <div className="bg-gris-50 rounded-xl p-4">
                <p className="text-xs text-gris-500 mb-1">Total contenus</p>
                <p className="font-semibold text-gris-800">{stats.totalActualites + stats.totalServices + stats.totalOrganismes} elements</p>
              </div>
              <div className="bg-gris-50 rounded-xl p-4">
                <p className="text-xs text-gris-500 mb-1">Stockage</p>
                <p className="font-semibold text-gris-800">localStorage (client)</p>
              </div>
            </div>
          </div>

          {/* Donnees */}
          <div className="bg-white rounded-2xl border border-gris-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database size={20} className="text-jaune-dark" />
              <h2 className="font-bold text-gris-900">Gestion des Donnees</h2>
            </div>
            <p className="text-sm text-gris-600 mb-4">
              Les donnees du dashboard sont stockees dans le navigateur (localStorage).
              Vous pouvez reinitialiser toutes les donnees aux valeurs par defaut.
            </p>
            <div className="bg-gris-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-bleu">{stats.totalActualites}</p>
                  <p className="text-xs text-gris-500">Actualites</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-jaune-dark">{stats.totalServices}</p>
                  <p className="text-xs text-gris-500">Services</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-rouge">{stats.totalOrganismes}</p>
                  <p className="text-xs text-gris-500">Organismes</p>
                </div>
              </div>
            </div>

            {!confirmerReset ? (
              <button
                onClick={() => setConfirmerReset(true)}
                className="inline-flex items-center gap-2 text-sm text-rouge border border-rouge/20 px-4 py-2.5 rounded-xl hover:bg-rouge/5 transition-colors"
              >
                <RotateCcw size={16} />
                Reinitialiser les donnees
              </button>
            ) : (
              <div className="bg-rouge/5 border border-rouge/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-rouge shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-rouge mb-1">Confirmer la reinitialisation ?</p>
                    <p className="text-xs text-gris-600 mb-3">
                      Toutes les modifications seront perdues. Les donnees par defaut seront restaurees.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleReset}
                        className="bg-rouge text-white text-sm px-4 py-2 rounded-lg hover:bg-rouge-dark"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setConfirmerReset(false)}
                        className="text-sm text-gris-500 px-4 py-2 rounded-lg hover:bg-gris-100"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Securite */}
          <div className="bg-white rounded-2xl border border-gris-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-rouge" />
              <h2 className="font-bold text-gris-900">Securite</h2>
            </div>
            <p className="text-sm text-gris-600 mb-3">
              Pour une version en production, il est recommande de :
            </p>
            <ul className="space-y-2 text-sm text-gris-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bleu mt-1.5 shrink-0" />
                Ajouter une authentification (NextAuth, Clerk, etc.)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bleu mt-1.5 shrink-0" />
                Migrer vers une base de donnees (PostgreSQL, MongoDB)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bleu mt-1.5 shrink-0" />
                Ajouter un CMS headless (Strapi, Sanity, etc.)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bleu mt-1.5 shrink-0" />
                Proteger les routes /dashboard avec un middleware
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
