'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/SocialIcons';
import AnimatedSection from '@/components/AnimatedSection';
import NewsCard from '@/components/NewsCard';
import { getActualiteBySlug, actualites, categories } from '@/data/actualites';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const actualite = getActualiteBySlug(slug);

  if (!actualite) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gris-800 mb-4">Article non trouve</h1>
          <p className="text-gris-500 mb-6">L&apos;article que vous recherchez n&apos;existe pas.</p>
          <Link href="/actualites" className="text-bleu font-medium hover:underline">
            Retour aux actualites
          </Link>
        </div>
      </div>
    );
  }

  const categorie = categories[actualite.categorie];
  const autresArticles = actualites.filter((a) => a.id !== actualite.id).slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Banniere article */}
      <section className="hero-gradient py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm"
            >
              <ArrowLeft size={16} />
              Retour aux actualites
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${categorie.color}`}>
                {categorie.label}
              </span>
              <span className="text-white/60 text-sm flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(actualite.date)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {actualite.titre}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <div className="chad-flag-bar" />

      {/* Contenu article */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Article principal */}
            <AnimatedSection>
              <article>
                {/* Meta */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gris-200">
                  <div className="flex items-center gap-2 text-gris-600 text-sm">
                    <User size={14} />
                    <span>{actualite.auteur}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gris-600 text-sm">
                    <Calendar size={14} />
                    <span>{formatDate(actualite.date)}</span>
                  </div>
                </div>

                {/* Resume */}
                <div className="bg-bleu/5 border-l-4 border-bleu p-6 rounded-r-lg mb-8">
                  <p className="text-gris-700 font-medium leading-relaxed">
                    {actualite.resume}
                  </p>
                </div>

                {/* Corps de l'article */}
                <div className="prose prose-lg max-w-none">
                  {actualite.contenu.split('\n\n').map((paragraphe, index) => {
                    if (paragraphe.startsWith('**') && paragraphe.endsWith('**')) {
                      return (
                        <h3 key={index} className="text-xl font-bold text-gris-800 mt-8 mb-3">
                          {paragraphe.replace(/\*\*/g, '')}
                        </h3>
                      );
                    }
                    if (paragraphe.startsWith('- ')) {
                      const items = paragraphe.split('\n');
                      return (
                        <ul key={index} className="space-y-2 my-4">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-gris-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-bleu mt-2 shrink-0" />
                              <span>{item.replace('- ', '')}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={index} className="text-gris-600 leading-relaxed mb-4">
                        {paragraphe.split('**').map((part, i) =>
                          i % 2 === 1 ? (
                            <strong key={i} className="text-gris-800 font-semibold">{part}</strong>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </p>
                    );
                  })}
                </div>

                {/* Tags */}
                <div className="mt-10 pt-6 border-t border-gris-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={16} className="text-gris-400" />
                    {actualite.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gris-100 text-gris-600 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Partage */}
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-gris-500 text-sm flex items-center gap-2">
                    <Share2 size={14} />
                    Partager :
                  </span>
                  {[
                    { Icon: FacebookIcon, label: 'Facebook', color: 'hover:bg-[#1877F2]' },
                    { Icon: TwitterIcon, label: 'Twitter', color: 'hover:bg-[#1DA1F2]' },
                    { Icon: LinkedinIcon, label: 'LinkedIn', color: 'hover:bg-[#0A66C2]' },
                  ].map(({ Icon, label, color }) => (
                    <button
                      key={label}
                      className={`w-9 h-9 rounded-full bg-gris-100 flex items-center justify-center text-gris-600 hover:text-white transition-all ${color}`}
                      aria-label={`Partager sur ${label}`}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </article>
            </AnimatedSection>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {/* Articles recents */}
                <div className="bg-gris-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gris-800 mb-4 pb-3 border-b border-gris-200">
                    Articles Recents
                  </h3>
                  <div className="space-y-4">
                    {autresArticles.map((art) => (
                      <Link
                        key={art.id}
                        href={`/actualites/${art.slug}`}
                        className="block group"
                      >
                        <h4 className="text-sm font-medium text-gris-700 group-hover:text-bleu transition-colors line-clamp-2 mb-1">
                          {art.titre}
                        </h4>
                        <span className="text-xs text-gris-500 flex items-center gap-1">
                          <Calendar size={10} />
                          {formatDate(art.date)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-gris-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gris-800 mb-4 pb-3 border-b border-gris-200">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(categories).map(([key, cat]) => (
                      <Link
                        key={key}
                        href="/actualites"
                        className="flex items-center gap-2 text-sm text-gris-600 hover:text-bleu transition-colors py-1"
                      >
                        <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Articles lies */}
          <div className="mt-16 pt-12 border-t border-gris-200">
            <h2 className="text-2xl font-bold text-gris-900 mb-8">
              Articles <span className="text-gradient">Similaires</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {autresArticles.map((art) => (
                <NewsCard key={art.id} actualite={art} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
