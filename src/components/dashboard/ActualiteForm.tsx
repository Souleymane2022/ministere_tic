'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, Star, ImageIcon } from 'lucide-react';
import { useAdmin } from '@/lib/admin-store';
import { Actualite, categories } from '@/data/actualites';

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
  const [previewImage, setPreviewImage] = useState(false);

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
    setTimeout(() => {
      router.push('/dashboard/actualites');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gris-600 hover:text-gris-900 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        <div className="flex items-center gap-3">
          {sauvegarde && (
            <span className="text-sm text-green-600 font-medium animate-fadeInUp">
              Sauvegarde effectuee !
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-bleu text-white font-medium px-6 py-2.5 rounded-xl hover:bg-bleu-light transition-colors shadow-md"
          >
            <Save size={16} />
            {mode === 'creation' ? 'Publier' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Colonne principale */}
        <div className="space-y-5">
          {/* Titre */}
          <div className="bg-white rounded-2xl border border-gris-100 p-5">
            <label className="block text-sm font-semibold text-gris-800 mb-2">
              Titre de l&apos;article *
            </label>
            <input
              type="text"
              required
              value={form.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gris-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu"
              placeholder="Entrez le titre de l'article..."
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gris-400">Slug :</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="flex-1 px-2 py-1 text-xs text-gris-500 bg-gris-50 rounded border border-gris-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Resume */}
          <div className="bg-white rounded-2xl border border-gris-100 p-5">
            <label className="block text-sm font-semibold text-gris-800 mb-2">
              Resume *
            </label>
            <textarea
              required
              rows={3}
              value={form.resume}
              onChange={(e) => handleChange('resume', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu resize-none"
              placeholder="Resume court de l'article (visible dans les cartes)..."
            />
          </div>

          {/* Contenu */}
          <div className="bg-white rounded-2xl border border-gris-100 p-5">
            <label className="block text-sm font-semibold text-gris-800 mb-2">
              Contenu de l&apos;article *
            </label>
            <p className="text-xs text-gris-400 mb-3">
              Utilisez **texte** pour le gras, et commencez une ligne par - pour les listes.
            </p>
            <textarea
              required
              rows={15}
              value={form.contenu}
              onChange={(e) => handleChange('contenu', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gris-200 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu resize-y"
              placeholder="Ecrivez le contenu complet de l'article..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Image */}
          <div className="bg-white rounded-2xl border border-gris-100 p-5">
            <label className="block text-sm font-semibold text-gris-800 mb-2">
              Image de couverture
            </label>
            <div className="space-y-3">
              {form.image && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gris-100">
                  {form.image.startsWith('http') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={30} className="text-gris-300" />
                    </div>
                  )}
                </div>
              )}
              <input
                type="url"
                value={form.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20"
                placeholder="URL de l'image..."
              />
              <p className="text-[10px] text-gris-400">
                Collez une URL d&apos;image (Unsplash, Pexels, etc.)
              </p>
            </div>
          </div>

          {/* Categorie */}
          <div className="bg-white rounded-2xl border border-gris-100 p-5">
            <label className="block text-sm font-semibold text-gris-800 mb-2">
              Categorie *
            </label>
            <select
              value={form.categorie}
              onChange={(e) => handleChange('categorie', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gris-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-bleu/20"
            >
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Date & Auteur */}
          <div className="bg-white rounded-2xl border border-gris-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gris-800 mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gris-800 mb-2">Auteur</label>
              <input
                type="text"
                value={form.auteur}
                onChange={(e) => handleChange('auteur', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20"
                placeholder="Nom de l'auteur"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-gris-100 p-5">
            <label className="block text-sm font-semibold text-gris-800 mb-2">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gris-200 text-sm focus:outline-none focus:ring-2 focus:ring-bleu/20"
              placeholder="Tag1, Tag2, Tag3..."
            />
            <p className="text-[10px] text-gris-400 mt-1">Separez les tags par des virgules</p>
          </div>

          {/* Vedette */}
          <div className="bg-white rounded-2xl border border-gris-100 p-5">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Star size={16} className={form.vedette ? 'text-jaune fill-jaune' : 'text-gris-400'} />
                <span className="text-sm font-semibold text-gris-800">Article vedette</span>
              </div>
              <div
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  form.vedette ? 'bg-bleu' : 'bg-gris-300'
                }`}
                onClick={() => handleChange('vedette', !form.vedette)}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    form.vedette ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
            <p className="text-[10px] text-gris-400 mt-2">
              Les articles vedette apparaissent en premier sur la page d&apos;accueil
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
