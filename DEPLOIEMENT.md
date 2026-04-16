# 🚀 Déploiement GRATUIT du Portail SHT

**Coût : 0 FCFA / mois** ✨

## Stack utilisée

| Service | Rôle | Limites free |
|---|---|---|
| **Neon** | PostgreSQL | 3 Go, toujours actif |
| **Render** | Backend Express + Frontend statique | 750h/mois, s'endort après 15min d'inactivité |
| **GitHub** | Code source | illimité |

> ⚠️ Le backend Render free "s'endort" après 15 min sans activité. Le **premier appel après sommeil prend 30-60s** (cold start). C'est normal.

---

## 📱 Étapes détaillées (depuis ton téléphone)

### Étape 1 — Créer la base de données Neon (2 min)

1. Va sur 👉 **https://neon.tech**
2. **"Sign up with GitHub"** (aucune carte requise)
3. Une fois connecté, clique sur **"Create project"**
4. Configure :
   - **Name** : `sht-portail`
   - **Region** : Frankfurt (Europe) ou plus proche
   - **Postgres version** : 16
5. Clique **"Create project"**
6. ⚠️ **Copie la `Connection string`** qui s'affiche (commence par `postgresql://...`). Garde-la, on en aura besoin.

---

### Étape 2 — Déployer sur Render (5 min)

1. Va sur 👉 **https://render.com**
2. **"Get Started"** → **"Sign in with GitHub"**
3. Autorise Render à accéder à ton repo `sht-portail`
4. Sur le dashboard Render, clique **"+ New"** → **"Blueprint"**
5. Sélectionne le repo **`Souleymane2022/sht-portail`**
6. Render détecte automatiquement le fichier `render.yaml`
7. Render va demander les **variables manquantes** :
   - **`DATABASE_URL`** → colle ton URL Neon de l'étape 1
   - **`CLIENT_URL`** → laisse vide pour l'instant (on reviendra)
   - **`VITE_API_URL`** → laisse vide pour l'instant
8. Clique **"Apply"** / **"Deploy"**

Render déploie **2 services** en parallèle :
- `sht-backend` (API Express)
- `sht-frontend` (React)

Attends 5-10 min (premier build).

---

### Étape 3 — Connecter frontend et backend (2 min)

Une fois les déploiements terminés, Render te donne 2 URLs :
- Backend : `https://sht-backend-XXXX.onrender.com`
- Frontend : `https://sht-frontend-XXXX.onrender.com`

**Configure le backend pour accepter le frontend :**

1. Dashboard Render → service **`sht-backend`** → onglet **"Environment"**
2. Édite la variable `CLIENT_URL` :
   - Valeur : `https://sht-frontend-XXXX.onrender.com` *(ton URL frontend)*
3. Clique **"Save, rebuild, and deploy"**

**Configure le frontend pour appeler le backend :**

1. Dashboard Render → service **`sht-frontend`** → onglet **"Environment"**
2. Édite la variable `VITE_API_URL` :
   - Valeur : `https://sht-backend-XXXX.onrender.com` *(ton URL backend)*
3. Clique **"Save, rebuild, and deploy"**

Attends le rebuild (3-5 min).

---

### Étape 4 — Tester 🎉

1. Ouvre dans ton navigateur : `https://sht-frontend-XXXX.onrender.com`
2. ⏱️ Première connexion = 30-60s (réveil du backend endormi)
3. Page de login SHT s'affiche
4. Connecte-toi :
   - Email : `admin@sht-td.com`
   - Mot de passe : `Admin@SHT2025`
5. Tu arrives sur le dashboard ✅

---

## 🎁 Bonus : déployer le frontend sur Vercel à la place

Vercel est **plus rapide** (pas de cold start) pour le frontend. Si tu veux :

1. Va sur **https://vercel.com** → "Sign in with GitHub"
2. **"Add New..."** → **"Project"** → importe `sht-portail`
3. Configure :
   - **Root Directory** : `client`
   - **Framework Preset** : Vite (auto-détecté)
4. **Environment Variables** :
   - `VITE_API_URL` = `https://sht-backend-XXXX.onrender.com`
5. **"Deploy"**

Ton frontend sera sur `https://sht-portail.vercel.app` (chargement instantané).

Pense à mettre à jour `CLIENT_URL` sur Render avec l'URL Vercel.

---

## 🔧 Problèmes fréquents

### "Internal Server Error" au login
→ Vérifie que `DATABASE_URL` est bien la Neon URL complète dans Render.

### "CORS error" dans la console
→ Vérifie que `CLIENT_URL` sur le backend = URL du frontend (sans `/` à la fin).

### "Cannot connect to API"
→ Vérifie que `VITE_API_URL` sur le frontend = URL du backend Render.
→ Redéploie le frontend après changement (Vite inline les env vars au build).

### Backend "sleeping" - chargement lent au premier appel
→ Normal sur free tier Render. Solution : ping `/api/health` toutes les 10 min avec **https://cron-job.org** (gratuit).

### Pas de données dans l'app
→ Le seed tourne au premier déploiement. Pour refaire le seed :
- Dashboard Render → `sht-backend` → **Shell** → `SEED_FORCE=true node prisma/seed.js`

### Comment voir les logs ?
→ Dashboard Render → ton service → onglet **"Logs"** (live tail).

---

## 💰 Évolution payante (si besoin)

Si un jour tu dépasses les limites free :

| Upgrade | Coût | Avantage |
|---|---|---|
| Render Starter | $7/mois | Backend toujours actif (pas de cold start) |
| Neon Scale | $19/mois | 10 Go DB + branches |
| Vercel Pro | $20/mois | Plus de bande passante |
| VPS (Hetzner/OVH) | 4€/mois | Tout-en-un sur ton serveur |

Pour un usage interne SHT en prod réelle, je recommande un **VPS Hetzner à 4€/mois** qui héberge tout (PostgreSQL, Redis, Node, Nginx) avec SSL Let's Encrypt.

---

## ✅ Check-list finale

- [ ] Neon DB créée et URL copiée
- [ ] Blueprint Render déployé (2 services)
- [ ] `DATABASE_URL` configurée sur backend
- [ ] `CLIENT_URL` configurée sur backend (avec URL frontend)
- [ ] `VITE_API_URL` configurée sur frontend (avec URL backend)
- [ ] Les 2 services en statut **"Live"** (vert)
- [ ] Login fonctionne avec `admin@sht-td.com` / `Admin@SHT2025`

🎉 **Ton portail SHT est en ligne gratuitement !**
