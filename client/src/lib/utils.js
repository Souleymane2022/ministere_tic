import clsx from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const cn = (...args) => clsx(...args);

export function formatDate(date, pattern = 'dd MMM yyyy') {
  if (!date) return '-';
  return format(new Date(date), pattern, { locale: fr });
}

export function formatDateTime(date) {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
}

export function timeAgo(date) {
  if (!date) return '-';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function formatCurrency(n, devise = 'XAF') {
  if (n == null) return '-';
  return new Intl.NumberFormat('fr-FR').format(n) + ' ' + devise;
}

export function formatNumber(n) {
  if (n == null) return '-';
  return new Intl.NumberFormat('fr-FR').format(n);
}

export function initiales(nom, prenom) {
  return `${(prenom || '').charAt(0)}${(nom || '').charAt(0)}`.toUpperCase();
}

const roleColors = {
  SUPER_ADMIN: 'badge-red',
  ADMIN: 'badge-orange',
  DIRECTEUR: 'badge-blue',
  AGENT: 'badge-green',
};
export const roleBadge = (role) => roleColors[role] || 'badge-gray';

const statutColors = {
  APPROUVE: 'badge-green', APPROUVEE: 'badge-green',
  EN_COURS: 'badge-blue',
  EN_REVISION: 'badge-yellow', EN_ATTENTE: 'badge-yellow', SOUMIS: 'badge-yellow', SOUMISE: 'badge-yellow',
  REJETE: 'badge-red', REJETEE: 'badge-red', BLOQUEE: 'badge-red',
  TERMINE: 'badge-green', TERMINEE: 'badge-green', PAYEE: 'badge-green',
  A_FAIRE: 'badge-gray', BROUILLON: 'badge-gray', PLANIFIE: 'badge-gray',
  EN_PAUSE: 'badge-orange', ANNULE: 'badge-red', ANNULEE: 'badge-red',
  EN_REVUE: 'badge-blue', ARCHIVE: 'badge-gray',
  URGENTE: 'badge-red', HAUTE: 'badge-orange', NORMALE: 'badge-blue', BASSE: 'badge-gray',
};
export const statutBadge = (s) => statutColors[s] || 'badge-gray';

export function statutLabel(s) {
  const map = {
    A_FAIRE: 'À faire', EN_COURS: 'En cours', EN_REVUE: 'En revue', TERMINEE: 'Terminée',
    BLOQUEE: 'Bloquée', PLANIFIE: 'Planifié', TERMINE: 'Terminé', EN_PAUSE: 'En pause',
    ANNULE: 'Annulé', EN_ATTENTE: 'En attente', APPROUVE: 'Approuvé', REJETE: 'Rejeté',
    SOUMIS: 'Soumis', EN_REVISION: 'En révision', ARCHIVE: 'Archivé',
    BROUILLON: 'Brouillon', SOUMISE: 'Soumise', APPROUVEE: 'Approuvée', REJETEE: 'Rejetée',
    PAYEE: 'Payée',
    URGENTE: 'Urgente', HAUTE: 'Haute', NORMALE: 'Normale', BASSE: 'Basse',
  };
  return map[s] || s;
}
