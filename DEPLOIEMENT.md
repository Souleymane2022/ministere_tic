# Guide de déploiement — Portail SHT

## Architecture recommandée

```
┌─────────────────┐       ┌──────────────────┐       ┌──────────────┐
│  Frontend       │       │  Backend API     │       │  PostgreSQL  │
│  (Vercel)       │──────▶│  (Railway)       │──────▶│  (Railway)   │
│  React + Vite   │       │  Express + WS    │       │  + Redis     │
└─────────────────┘       └──────────────────┘       └──────────────┘
```

## Étape 1 — Déployer le backend sur Railway

### 1.1 Créer un compte
1. Va sur https://railway.app et connecte-toi avec GitHub
2. Clique sur **"New Project"** → **"Deploy from GitHub repo"**
3. Sélectionne `Souleymane2022/sht-portail`

### 1.2 Ajouter PostgreSQL
1. Dans ton projet Railway, clique **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway crée la BDD automatiquement et génère `DATABASE_URL`

### 1.3 Ajouter Redis (optionnel, pour le cache)
1. **"+ New"** → **"Database"** → **"Redis"**
2. Génère `REDIS_URL` automatiquement

### 1.4 Configurer les variables d'environnement

Sur le service backend, onglet **"Variables"**, ajoute :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (référence auto) |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` (optionnel) |
| `JWT_SECRET` | *(une chaîne aléatoire longue, min 32 caractères)* |
| `JWT_REFRESH_SECRET` | *(une autre chaîne aléatoire)* |
| `JWT_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | *(l'URL Vercel, on la met après)* |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `UPLOAD_PATH` | `/tmp/uploads` |
| `TOTP_ISSUER` | `SHT-Portail` |
| `BCRYPT_ROUNDS` | `10` |

### 1.5 Configurer le build/start

Dans **Settings → Build** du service backend :
- **Root Directory** : laisser vide
- **Build Command** : `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command** : `node server/src/index.js`

Railway va déployer et te donner une URL, par exemple :
`https://sht-portail-backend-production.up.railway.app`

### 1.6 Peupler la BDD (une seule fois)

Dans l'interface Railway, ouvre le **shell** du service backend et lance :
```bash
node prisma/seed.js
```

Ou en local avec la `DATABASE_URL` de Railway :
```bash
DATABASE_URL="..." npm run db:seed
```

---

## Étape 2 — Déployer le frontend sur Vercel

### 2.1 Importer le repo
1. Va sur https://vercel.com → **"Add New Project"**
2. Importe `Souleymane2022/sht-portail`
3. Vercel détecte Vite automatiquement

### 2.2 Configurer le build

| Champ | Valeur |
|---|---|
| **Framework Preset** | Vite |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 2.3 Variables d'environnement Vercel

| Variable | Valeur |
|---|---|
| `VITE_API_URL` | `https://sht-portail-backend-production.up.railway.app` *(ton URL Railway)* |

### 2.4 Déployer
Clique **"Deploy"**. Vercel te donne une URL : `https://sht-portail.vercel.app`

### 2.5 Revenir sur Railway pour compléter
Modifie la variable `CLIENT_URL` sur Railway avec l'URL Vercel :
```
CLIENT_URL=https://sht-portail.vercel.app
```

Relance le backend Railway.

---

## Étape 3 — Ajustement du code frontend

Pour que le frontend utilise la bonne URL API en production, modifie `client/src/lib/api.js` :

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  withCredentials: true,
});
```

Et `client/src/lib/socket.js` :
```js
socket = io(import.meta.env.VITE_API_URL || '/', { auth: { token } });
```

---

## Alternatives

### Option "tout-en-un" : Render.com
- Plus simple que Vercel+Railway
- Déployer frontend + backend + PostgreSQL en un seul endroit
- https://render.com/docs/deploy-node-express-app

### Option classique : VPS + PM2 + Nginx
Pour un déploiement sur serveur dédié :
```bash
# Sur ton serveur
git clone https://github.com/Souleymane2022/sht-portail.git
cd sht-portail
cp .env.example .env  # et remplis les valeurs
npm run install:all
npm run prisma:deploy
npm run db:seed
npm run build
pm2 start server/src/index.js --name sht-api
```

Nginx config :
```nginx
server {
  listen 80;
  server_name portail.sht-td.com;

  location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

  location / {
    root /var/www/sht-portail/client/dist;
    try_files $uri /index.html;
  }
}
```

---

## Limitations Vercel à connaître

| Fonctionnalité | Impact |
|---|---|
| **Socket.io** | ❌ Ne fonctionne pas sur Vercel — utilise Railway pour le backend |
| **Upload disque** | ❌ Stockage non persistant — utilise Vercel Blob ou S3 si backend sur Vercel |
| **Serverless timeout** | 10s max en free, 60s en Pro — OK pour la plupart des cas |

C'est pour ces raisons qu'on met **uniquement le frontend** sur Vercel, pas le backend.

---

## Check-list post-déploiement

- [ ] Backend accessible : `https://TON-BACKEND.railway.app/api/health`
- [ ] Frontend accessible : `https://TON-FRONT.vercel.app`
- [ ] Login fonctionne avec `admin@sht-td.com` / `Admin@SHT2025`
- [ ] CORS : pas d'erreur dans la console navigateur
- [ ] Socket.io : ouvre la messagerie, pas d'erreur WebSocket
- [ ] Upload doc : teste un PDF dans la GED

Bon déploiement ! 🚀
