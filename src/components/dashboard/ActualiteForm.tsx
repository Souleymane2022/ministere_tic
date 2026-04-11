'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Star, ImageIcon, Check } from 'lucide-react';
import { useAdmin } from '@/lib/admin-store';
import { Actualite, categories } from '@/data/actualites';
import DashboardHeader from './DashboardHeader';

interface ActualiteFormProps {
  actualite?: Actualite;
  mode: 'creation' | 'edition';
}

function generateSlug(titre: string): string {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function ActualiteForm({ actualite, mode }: ActualiteFormProps) {
  const router = useRouter();
  const { ajouterActualite, modifierActualite } = useAdmin();

  const [form, setForm] = useState({
    titre: actualite?.titre || '',
    slug: actualite?.slug || '',
    resume: actualite?.resume || '',
    contenu: actualite?.contenu || '',
    image: actualite?.image || '',
    categorie: actualite?.categorie || 'numerique',
    date: actualite?.date || new Date().toISOString().split('T')[0],
    auteur: actualite?.auteur || 'Direction de la Communication',
    tags: actualite?.tags.join(', ') || '',
    vedette: actualite?.vedette || false,
  });

  const [sauvegarde, setSauvegarde] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'titre' && mode === 'creation') {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      titre: form.titre,
      slug: form.slug || generateSlug(form.titre),
      resume: form.resume,
      contenu: form.contenu,
      image: form.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      categorie: form.categorie as Actualite['categorie'],
      date: form.date,
      auteur: form.auteur,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      vedette: form.vedette,
    };

    if (mode === 'edition' && actualite) {
      modifierActualite(actualite.id, data);
    } else {
      ajouterActualite(data);
    }

    setSauvegarde(true);
    setLoading(false);
    setTimeout(() => router.push('/dashboard/actualites'), 1500);
  };

  return (
    <>
      <DashboardHeader
        titre={mode === 'creation' ? 'Nouvel Article' : 'Modifier l\'Article'}
        sousTitre={mode === 'edition' ? actualite?.titre : 'Creer et publier un nouvel article'}
        actions={
          <div className="flex items-center gap-2">
            {sauvegarde && (
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg">
                <Check size={14} />
                Sauvegarde !
              </span>
            )}
            <button
              type="submit"
              form="article-form"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-bleu text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-bleu-light transition-colors shadow-md disabled:opacity-50"
            >
              <Save size={16} />
              <span className="hidden sm:inline">{mode === 'creation' ? 'Publier' : 'Sauvegarder'}</span>
            </button>
          </div>
        }
      />

      <form id="article-form" onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
        {/* Retour */}
        <Link
          href="/dashboard/actualites"
          className="inline-flex items-center gap-1.5 text-sm text-gris-500 hover:text-gris-800 transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Retour aux articles
        </Link>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Colonne principale (3/5) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Titre */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5">
              <label className="block text-sm font-semibold text-gris-700 mb-2">Titre *</label>
              <input
                type="text"
                required
                value={form.titre}
                onChange={(e) => handleChange('titre', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gris-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu transition-all"
                placeholder="Titre de l'article..."
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-gris-400">Slug :</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs text-gris-500 bg-gris-50 rounded-lg border border-gris-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5">
              <label className="block text-sm font-semibold text-gris-700 mb-2">Resume *</label>
              <textarea
                required
                rows={3}
                value={form.resume}
                onChange={(e) => handleChange('resume', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu resize-none transition-all"
                placeholder="Resume court visible dans les cartes..."
              />
            </div>

            {/* Contenu */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5">
              <label className="block text-sm font-semibold text-gris-700 mb-1">Contenu *</label>
              <p className="text-[11px] text-gris-400 mb-3">**gras** pour le gras, - pour les listes</p>
              <textarea
                required
                rows={14}
                value={form.contenu}
                onChange={(e) => handleChange('contenu', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gris-200 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu resize-y min-h-[200px] transition-all"
                placeholder="Contenu complet de l'article..."
              />
            </div>
          </div>

          {/* Sidebar (2/5) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5">
              <label className="block text-sm font-semibold text-gris-700 mb-2">Image</label>
              {form.image ? (
                <div className="w-full h-36 rounded-xl overflow-hidden bg-gris-100 mb-3 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="Apercu" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-36 rounded-xl bg-gris-50 border-2 border-dashed border-gris-200 flex flex-col items-center justify-center mb-3">
                  <ImageIcon size={28} className="text-gris-300 mb-1" />
                  <p className="text-xs text-gris-400">Collez une URL ci-dessous</p>
                </div>
              )}
              <input
                type="url"
                value={form.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {/* Categorie */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5">
              <label className="block text-sm font-semibold text-gris-700 mb-2">Categorie *</label>
              <select
                value={form.categorie}
                onChange={(e) => handleChange('categorie', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gris-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-bleu/20 transition-all"
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Date & Auteur */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gris-700 mb-2">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gris-700 mb-2">Auteur</label>
                <input
                  type="text"
                  value={form.auteur}
                  onChange={(e) => handleChange('auteur', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 transition-all"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5">
              <label className="block text-sm font-semibold text-gris-700 mb-2">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 transition-all"
                placeholder="Tag1, Tag2, Tag3..."
              />
              <p className="text-[11px] text-gris-400 mt-1.5">Separes par des virgules</p>
            </div>

            {/* Vedette */}
            <div className="bg-white rounded-2xl border border-gris-100 p-5">
              <button
                type="button"
                onClick={() => handleChange('vedette', !form.vedette)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  form.vedette
                    ? 'border-jaune bg-jaune/5'
                    : 'border-gris-200 hover:border-gris-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star
                    size={20}
                    className={form.vedette ? 'text-jaune fill-jaune' : 'text-gris-400'}
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gris-800">Article vedette</p>
                    <p className="text-[11px] text-gris-400">Affiche en priorite sur l&apos;accueil</p>
                  </div>
                </div>
                <div
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    form.vedette ? 'bg-jaune' : 'bg-gris-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      form.vedette ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
