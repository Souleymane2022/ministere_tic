'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Globe,
} from 'lucide-react';
import { FacebookIcon, TwitterIcon } from './SocialIcons';

const navigation = [
  { nom: 'Accueil', href: '/' },
  {
    nom: 'Le Ministere',
    href: '/a-propos',
    sousMenu: [
      { nom: 'Presentation', href: '/a-propos' },
      { nom: 'Le Ministre', href: '/ministre' },
      { nom: 'Organisation', href: '/a-propos#organisation' },
    ],
  },
  { nom: 'Actualites', href: '/actualites' },
  { nom: 'Services', href: '/services' },
  { nom: 'Organismes', href: '/organismes' },
  { nom: 'Contact', href: '/contact' },
];

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sousMenuOuvert, setSousMenuOuvert] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-bleu-dark text-white text-sm hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+23522429090" className="flex items-center gap-1.5 hover:text-jaune transition-colors">
              <Phone size={13} />
              <span>+235 22 42 90 90</span>
            </a>
            <a href="mailto:info@mpntic.td" className="flex items-center gap-1.5 hover:text-jaune transition-colors">
              <Mail size={13} />
              <span>info@mpntic.td</span>
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              <span>N&apos;Djamena, Tchad</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-jaune transition-colors">
              <FacebookIcon size={14} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-jaune transition-colors">
              <TwitterIcon size={14} />
            </a>
            <a href="#" aria-label="Site Web" className="hover:text-jaune transition-colors">
              <Globe size={14} />
            </a>
            <span className="ml-2 border-l border-white/20 pl-3 text-xs uppercase tracking-wider">
              Republique du Tchad
            </span>
          </div>
        </div>
      </div>

      {/* Bande tricolore */}
      <div className="chad-flag-bar" />

      {/* Navigation principale */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 shrink-0">
                <Image
                  src="/images/logos/armoiries-tchad.svg"
                  alt="Armoiries du Tchad"
                  width={56}
                  height={56}
                  className="object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-bleu text-base leading-tight">MTENDA</div>
                <div className="text-[10px] text-gris-600 leading-tight max-w-[200px]">
                  Ministere des Telecommunications, de l&apos;Economie Numerique et de la Digitalisation
                </div>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.nom}
                  className="relative group"
                  onMouseEnter={() => item.sousMenu && setSousMenuOuvert(item.nom)}
                  onMouseLeave={() => setSousMenuOuvert(null)}
                >
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-gris-700 hover:text-bleu transition-colors flex items-center gap-1 relative group"
                  >
                    {item.nom}
                    {item.sousMenu && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-jaune group-hover:w-3/4 transition-all duration-300" />
                  </Link>

                  {/* Sous-menu */}
                  {item.sousMenu && (
                    <AnimatePresence>
                      {sousMenuOuvert === item.nom && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-xl border border-gris-100 py-2 mt-1"
                        >
                          {item.sousMenu.map((sous) => (
                            <Link
                              key={sous.nom}
                              href={sous.href}
                              className="block px-4 py-2.5 text-sm text-gris-700 hover:bg-bleu/5 hover:text-bleu transition-colors"
                            >
                              {sous.nom}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA + Burger */}
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center px-5 py-2.5 bg-bleu text-white text-sm font-medium rounded-lg hover:bg-bleu-light transition-colors shadow-md hover:shadow-lg"
              >
                Nous Contacter
              </Link>
              <button
                onClick={() => setMenuOuvert(!menuOuvert)}
                className="lg:hidden p-2 text-gris-700 hover:text-bleu transition-colors"
                aria-label="Menu"
              >
                {menuOuvert ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {menuOuvert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gris-100"
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                {navigation.map((item) => (
                  <div key={item.nom}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (!item.sousMenu) setMenuOuvert(false);
                        if (item.sousMenu) {
                          setSousMenuOuvert(
                            sousMenuOuvert === item.nom ? null : item.nom
                          );
                        }
                      }}
                      className="flex items-center justify-between py-3 text-gris-700 hover:text-bleu transition-colors border-b border-gris-100 font-medium"
                    >
                      {item.nom}
                      {item.sousMenu && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sousMenuOuvert === item.nom ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </Link>
                    {item.sousMenu && sousMenuOuvert === item.nom && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className="pl-4 overflow-hidden"
                      >
                        {item.sousMenu.map((sous) => (
                          <Link
                            key={sous.nom}
                            href={sous.href}
                            onClick={() => setMenuOuvert(false)}
                            className="block py-2.5 text-sm text-gris-600 hover:text-bleu transition-colors"
                          >
                            {sous.nom}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setMenuOuvert(false)}
                  className="block mt-4 text-center px-5 py-3 bg-bleu text-white font-medium rounded-lg"
                >
                  Nous Contacter
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
