'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowUp, Globe } from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon, YoutubeIcon } from './SocialIcons';

const liensRapides = [
  { nom: 'Accueil', href: '/' },
  { nom: 'Le Ministere', href: '/a-propos' },
  { nom: 'Actualites', href: '/actualites' },
  { nom: 'Services', href: '/services' },
  { nom: 'Organismes', href: '/organismes' },
  { nom: 'Contact', href: '/contact' },
];

const organismesLiens = [
  { nom: 'ADETIC', href: 'https://adetic.td/' },
  { nom: 'ARCEP', href: 'https://arcep.td/' },
  { nom: 'La Poste', href: '#' },
  { nom: 'ENASTIC', href: 'https://www.enastic.td/' },
  { nom: 'PATN', href: '#' },
  { nom: 'SAFITEL', href: '#' },
  { nom: 'ATPE', href: 'https://atpe.td/' },
];

const socialLinks = [
  { Icon: FacebookIcon, label: 'Facebook' },
  { Icon: TwitterIcon, label: 'Twitter' },
  { Icon: LinkedinIcon, label: 'LinkedIn' },
  { Icon: YoutubeIcon, label: 'YouTube' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-bleu-dark text-white relative">
      {/* Bande tricolore */}
      <div className="chad-flag-bar-thick" />

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* A propos */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-jaune flex items-center justify-center">
                <span className="text-bleu font-bold text-sm">TD</span>
              </div>
              <div>
                <div className="font-bold text-lg">MTENDA</div>
                <div className="text-xs text-white/60">Republique du Tchad</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Ministere des Telecommunications, de l&apos;Economie Numerique et de la
              Digitalisation de l&apos;Administration. Au service de la transformation
              numerique du Tchad.
            </p>
            <div className="flex items-center gap-2 text-xs text-jaune font-medium">
              <span>Unite</span>
              <span className="w-1 h-1 rounded-full bg-jaune" />
              <span>Travail</span>
              <span className="w-1 h-1 rounded-full bg-jaune" />
              <span>Progres</span>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold text-lg mb-6 relative">
              Liens Rapides
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-jaune -mb-2" />
            </h3>
            <ul className="space-y-3 mt-4">
              {liensRapides.map((lien) => (
                <li key={lien.nom}>
                  <Link
                    href={lien.href}
                    className="text-white/70 hover:text-jaune transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-jaune/40" />
                    {lien.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organismes */}
          <div>
            <h3 className="font-semibold text-lg mb-6 relative">
              Organismes sous Tutelle
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-jaune -mb-2" />
            </h3>
            <ul className="space-y-3 mt-4">
              {organismesLiens.map((org) => (
                <li key={org.nom}>
                  <a
                    href={org.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-jaune transition-colors text-sm flex items-center gap-2"
                  >
                    <Globe size={12} className="text-jaune/40" />
                    {org.nom}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 relative">
              Contact
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-jaune -mb-2" />
            </h3>
            <div className="space-y-4 mt-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-jaune mt-0.5 shrink-0" />
                <span className="text-white/70 text-sm">
                  Rue 105 Centre Ville, BP 201
                  <br />
                  N&apos;Djamena, Republique du Tchad
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-jaune shrink-0" />
                <a href="tel:+23522429090" className="text-white/70 hover:text-jaune text-sm transition-colors">
                  +235 22 42 90 90
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-jaune shrink-0" />
                <a href="mailto:info@mpntic.td" className="text-white/70 hover:text-jaune text-sm transition-colors">
                  info@mpntic.td
                </a>
              </div>
            </div>

            {/* Reseaux sociaux */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-jaune hover:text-bleu transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} MTENDA - Ministere des Telecommunications, de l&apos;Economie
            Numerique et de la Digitalisation de l&apos;Administration. Tous droits reserves.
          </p>
          <p className="text-white/40 text-xs">
            Republique du Tchad
          </p>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <button
        onClick={scrollToTop}
        className="absolute right-6 bottom-20 w-10 h-10 bg-jaune text-bleu rounded-full flex items-center justify-center shadow-lg hover:bg-jaune-light transition-colors hover:-translate-y-1 transform duration-200"
        aria-label="Retour en haut"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
