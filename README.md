# Portail SHT — Société des Hydrocarbures du Tchad

> Portail de gestion interne **complet** avec 8 modules : Auth, GED, SIRH, Dashboard, Finance, Communication, Projets, Administration.

## Stack technique

| Couche | Technologies |
| --- | --- |
| Frontend | React 18, Vite, TailwindCSS, React Router, React Query, Zustand, Recharts, Socket.io-client |
| Backend | Node.js, Express 4, Prisma ORM, Socket.io, JWT, Speakeasy (2FA), Multer, PDFKit |
| Base de données | PostgreSQL 16 |
| Cache / temps réel | Redis, Socket.io |
| Outils | Docker Compose, Adminer |

## Structure du projet

```
.
├── client/            # Application React (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── lib/
│   └── package.json
├── server/            # API Express
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── modules/   # 1 dossier par module (auth, users, documents, rh, ...)
│   │   ├── routes/
│   │   ├── sockets/
│   │   └── utils/
│   ├── uploads/
│   └── package.json
├── prisma/
│   ├── schema.prisma  # Toutes les tables
│   └── seed.js        # Données de démo
├── docker-compose.yml
├── .env.example
└── package.json       # Workspaces npm
```

## Installation rapide

### Prérequis
- Node.js 18+
- Docker + Docker Compose
- Git

### 1. Cloner et configurer

```bash
git clone <ce-repo>
cd ministere_tic
cp .env.example .env
# Editez .env si besoin (la config par défaut fonctionne avec docker-compose)
```

### 2. Démarrer PostgreSQL + Redis

```bash
npm run docker:up
```

Adminer disponible sur http://localhost:8080 (serveur: `postgres`, user/pass: `user`/`password`, db: `sht_portail`).

### 3. Installer les dépendances

```bash
npm run install:all
```

### 4. Migrer et peupler la base

```bash
npm run prisma:generate
npm run prisma:migrate   # création des tables
npm run db:seed          # comptes de démo + données fictives
```

### 5. Lancer en développement

```bash
npm run dev
```

- Backend : http://localhost:5000
- Frontend : http://localhost:3000

## Comptes de démonstration

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Super Admin | `admin@sht-td.com` | `Admin@SHT2025` |
| Directeur (DG) | `dg@sht-td.com` | `DG@SHT2025` |
| Agent | `agent@sht-td.com` | `Agent@SHT2025` |

Également créés par le seed : `directeur.finance@sht-td.com`, `directeur.rh@sht-td.com`, `directeur.exploration@sht-td.com` (mdp `Directeur@SHT2025`).

## Modules implémentés

### 1. Auth & Sécurité
- Login / logout avec JWT (access 15 min + refresh 7 j)
- 2FA TOTP (QR code via `speakeasy`)
- Changement de mot de passe
- Rate-limiting sur `/login`

### 2. GED (Gestion Électronique de Documents)
- Upload PDF / Word / Excel / images (max 10 Mo)
- Classement par direction, tags, projet
- Versioning automatique (`POST /documents/:id/version`)
- Circuit de validation : SOUMIS → EN_REVISION → APPROUVE / REJETE
- Historique complet des actions
- Téléchargement & recherche full-text simple

### 3. SIRH
- Fiche agent (photo, coordonnées, poste, direction)
- Demandes de congés + workflow d'approbation hiérarchique
- Feuille de présence avec pointage arrivée/départ
- Organigramme interactif par direction
- Évaluations annuelles

### 4. Dashboard & KPI
- KPIs filtrés par rôle (DG = global, Agent = périmètre perso)
- Graphiques : production barils/jour, budgets, effectifs par direction, tâches par statut
- Widgets configurables (drag & drop via store)
- Export rapport PDF (PDFKit)
- Notifications temps réel

### 5. Gestion financière
- Budgets annuels par direction
- Demandes de dépenses avec référence auto + workflow
- Contrats fournisseurs
- Récapitulatif mensuel

### 6. Communication interne
- Messagerie instantanée (Socket.io, typing indicator, compteur non-lus)
- Annonces / fil d'actualité catégorisé (Générale, RH, Projet, Urgent, Direction)
- Annuaire avec recherche
- Notifications push temps réel

### 7. Gestion de projets
- Projets avec code, budget, avancement calculé automatiquement
- Tâches (assignation, deadline, priorité)
- Diagramme de Gantt simple
- Gestion des risques (matrice probabilité × impact)
- Membres projet

### 8. Administration
- Gestion des utilisateurs (CRUD, activation/désactivation)
- Journal d'audit complet (toutes les actions tracées)
- Matrice de permissions par rôle
- Paramètres système éditables
- Stats globales

## Commandes utiles

```bash
# Backend uniquement
npm run dev:server

# Frontend uniquement
npm run dev:client

# Reset complet de la BDD + reseed
npm run db:reset && npm run db:seed

# Prisma Studio (GUI BDD)
npm run prisma:studio

# Build production
npm run build
```

## Docker

Le `docker-compose.yml` lance :
- PostgreSQL 16 (port 5432)
- Redis 7 (port 6379)
- Adminer (port 8080)

```bash
npm run docker:up     # démarrer
npm run docker:down   # arrêter
```

## Architecture API

Toutes les routes sont préfixées par `/api`. Voir `docs/postman_collection.json` pour la collection complète.

| Module | Préfixe |
| --- | --- |
| Auth | `/api/auth/*` |
| Utilisateurs | `/api/users/*` |
| Directions | `/api/directions/*` |
| Documents | `/api/documents/*` |
| RH | `/api/rh/*` |
| Dashboard | `/api/dashboard/*` |
| Finance | `/api/finance/*` |
| Communication | `/api/communication/*` |
| Projets | `/api/projets/*` |
| Administration | `/api/admin/*` |

### Exemple d'appel

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sht-td.com","password":"Admin@SHT2025"}'
```

## Charte graphique SHT

| Couleur | Code | Usage |
| --- | --- | --- |
| Primaire | `#1A2B3C` | Sidebar, titres |
| Secondaire | `#2E7D32` | Boutons action, succès |
| Accent | `#F57F17` | Actions fortes, alertes |
| Background | `#F5F7FA` | Fond général |

## Sécurité

- Mots de passe : bcrypt (10 rounds)
- JWT séparés (access / refresh) avec secrets distincts
- RBAC strict sur toutes les routes sensibles
- Rate limiting login
- Helmet, CORS strict
- 2FA TOTP activable par utilisateur
- Audit log de toutes les actions importantes

## Déploiement

### Production
1. `npm run build` dans `/client`
2. Servir `client/dist` via un reverse proxy
3. `NODE_ENV=production npm start` côté serveur
4. `npm run prisma:deploy` pour appliquer les migrations
5. Configurer PM2 ou systemd

### PM2
```bash
pm2 start server/src/index.js --name sht-api
pm2 save && pm2 startup
```

## Licence

© Société des Hydrocarbures du Tchad — Usage interne.
