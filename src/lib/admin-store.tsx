'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Actualite, actualites as defaultActualites } from '@/data/actualites';
import { Organisme, organismes as defaultOrganismes } from '@/data/organismes';
import { Service, services as defaultServices } from '@/data/services';

interface DashboardStats {
  totalActualites: number;
  totalServices: number;
  totalOrganismes: number;
  actualitesVedette: number;
  derniereModification: string;
}

interface AdminStore {
  actualites: Actualite[];
  organismes: Organisme[];
  services: Service[];
  stats: DashboardStats;
  // Actualités CRUD
  ajouterActualite: (actu: Omit<Actualite, 'id'>) => void;
  modifierActualite: (id: string, actu: Partial<Actualite>) => void;
  supprimerActualite: (id: string) => void;
  // Organismes CRUD
  modifierOrganisme: (id: string, org: Partial<Organisme>) => void;
  // Services CRUD
  modifierService: (id: string, svc: Partial<Service>) => void;
  // Utils
  reinitialiser: () => void;
}

const AdminContext = createContext<AdminStore | null>(null);

const STORAGE_KEYS = {
  actualites: 'mtenda_actualites',
  organismes: 'mtenda_organismes',
  services: 'mtenda_services',
};

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [organismes, setOrganismes] = useState<Organisme[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setActualites(loadFromStorage(STORAGE_KEYS.actualites, defaultActualites));
    setOrganismes(loadFromStorage(STORAGE_KEYS.organismes, defaultOrganismes));
    setServices(loadFromStorage(STORAGE_KEYS.services, defaultServices));
    setLoaded(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (!loaded) return;
    saveToStorage(STORAGE_KEYS.actualites, actualites);
  }, [actualites, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveToStorage(STORAGE_KEYS.organismes, organismes);
  }, [organismes, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveToStorage(STORAGE_KEYS.services, services);
  }, [services, loaded]);

  const ajouterActualite = useCallback((actu: Omit<Actualite, 'id'>) => {
    const id = Date.now().toString();
    setActualites((prev) => [{ ...actu, id } as Actualite, ...prev]);
  }, []);

  const modifierActualite = useCallback((id: string, updates: Partial<Actualite>) => {
    setActualites((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const supprimerActualite = useCallback((id: string) => {
    setActualites((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const modifierOrganisme = useCallback((id: string, updates: Partial<Organisme>) => {
    setOrganismes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  }, []);

  const modifierService = useCallback((id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const reinitialiser = useCallback(() => {
    setActualites(defaultActualites);
    setOrganismes(defaultOrganismes);
    setServices(defaultServices);
  }, []);

  const stats: DashboardStats = {
    totalActualites: actualites.length,
    totalServices: services.length,
    totalOrganismes: organismes.length,
    actualitesVedette: actualites.filter((a) => a.vedette).length,
    derniereModification: new Date().toLocaleDateString('fr-FR'),
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gris-50">
        <div className="animate-pulse text-bleu font-semibold">Chargement...</div>
      </div>
    );
  }

  return (
    <AdminContext.Provider
      value={{
        actualites,
        organismes,
        services,
        stats,
        ajouterActualite,
        modifierActualite,
        supprimerActualite,
        modifierOrganisme,
        modifierService,
        reinitialiser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
