'use client';

import { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/SocialIcons';
import AnimatedSection from '@/components/AnimatedSection';

export default function ContactPage() {
  const [formEnvoye, setFormEnvoye] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormEnvoye(true);
    setTimeout(() => setFormEnvoye(false), 5000);
    setFormData({ nom: '', email: '', sujet: '', message: '' });
  };

  return (
    <>
      {/* Banniere */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="flex items-center gap-2 text-jaune text-sm font-semibold uppercase tracking-wider mb-3">
              <div className="w-8 h-0.5 bg-jaune" />
              Contact
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contactez <span className="text-jaune">le MTENDA</span>
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              N&apos;hesitez pas a nous contacter pour toute question, suggestion ou demande
              d&apos;information concernant les services du ministere.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="chad-flag-bar" />

      {/* Contenu */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Formulaire */}
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl p-8 border border-gris-100 shadow-lg">
                <h2 className="text-2xl font-bold text-gris-900 mb-6">
                  Envoyez-nous un <span className="text-gradient">message</span>
                </h2>

                {formEnvoye && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <p className="text-green-700 text-sm font-medium">
                      Votre message a ete envoye avec succes ! Nous vous repondrons dans les plus brefs delais.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-gris-700 mb-1.5">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="nom"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gris-200 focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu transition-all text-sm"
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gris-700 mb-1.5">
                        Adresse email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gris-200 focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu transition-all text-sm"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sujet" className="block text-sm font-medium text-gris-700 mb-1.5">
                      Sujet *
                    </label>
                    <select
                      id="sujet"
                      required
                      value={formData.sujet}
                      onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gris-200 focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu transition-all text-sm bg-white"
                    >
                      <option value="">Selectionnez un sujet</option>
                      <option value="information">Demande d&apos;information</option>
                      <option value="telecoms">Telecommunications</option>
                      <option value="numerique">Economie Numerique</option>
                      <option value="gouvernance">E-Gouvernance</option>
                      <option value="regulation">Regulation</option>
                      <option value="formation">Formation</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gris-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gris-200 focus:outline-none focus:ring-2 focus:ring-bleu/20 focus:border-bleu transition-all text-sm resize-none"
                      placeholder="Ecrivez votre message ici..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-bleu text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-bleu-light transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Send size={18} />
                    Envoyer le Message
                  </button>
                </form>
              </div>
            </AnimatedSection>

            {/* Informations de contact */}
            <div className="space-y-6">
              <AnimatedSection direction="right">
                <div className="bg-bleu-dark rounded-2xl p-8 text-white">
                  <h3 className="font-bold text-xl mb-6">Coordonnees</h3>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-jaune" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Adresse</h4>
                        <p className="text-white/70 text-sm">
                          Rue 105 Centre Ville, BP 201
                          <br />
                          N&apos;Djamena, Republique du Tchad
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Phone size={18} className="text-jaune" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Telephone</h4>
                        <a href="tel:+23522429090" className="text-white/70 text-sm hover:text-jaune transition-colors">
                          +235 22 42 90 90
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-jaune" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Email</h4>
                        <a href="mailto:info@mpntic.td" className="text-white/70 text-sm hover:text-jaune transition-colors">
                          info@mpntic.td
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Clock size={18} className="text-jaune" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Horaires</h4>
                        <p className="text-white/70 text-sm">
                          Lundi - Vendredi : 7h30 - 15h30
                          <br />
                          Samedi - Dimanche : Ferme
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reseaux sociaux */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="font-semibold text-sm mb-3">Suivez-nous</h4>
                    <div className="flex items-center gap-3">
                      {[
                        { Icon: FacebookIcon, label: 'Facebook' },
                        { Icon: TwitterIcon, label: 'Twitter' },
                        { Icon: LinkedinIcon, label: 'LinkedIn' },
                        { Icon: () => <Globe size={18} />, label: 'Site Web' },
                      ].map(({ Icon, label }) => (
                        <a
                          key={label}
                          href="#"
                          aria-label={label}
                          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-jaune hover:text-bleu transition-all duration-300"
                        >
                          <Icon size={18} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Carte placeholder */}
              <AnimatedSection direction="right" delay={0.2}>
                <div className="bg-gris-100 rounded-2xl overflow-hidden h-64 relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bleu/5 to-bleu/10">
                    <div className="text-center">
                      <MapPin size={40} className="text-bleu/30 mx-auto mb-2" />
                      <p className="text-gris-600 text-sm font-medium">N&apos;Djamena, Tchad</p>
                      <p className="text-gris-400 text-xs mt-1">Rue 105, Centre Ville</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Devise */}
              <AnimatedSection direction="right" delay={0.3}>
                <div className="bg-gris-50 rounded-2xl p-6 text-center border border-gris-100">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-6 h-1 rounded bg-bleu" />
                    <div className="w-6 h-1 rounded bg-jaune" />
                    <div className="w-6 h-1 rounded bg-rouge" />
                  </div>
                  <p className="text-sm text-gris-600 italic">
                    &quot;Unite, Travail, Progres&quot;
                  </p>
                  <p className="text-xs text-gris-400 mt-1">
                    Devise de la Republique du Tchad
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
