# Charmy 💘

Charmy est une app de coaching relationnel assisté par IA. L'utilisateur décrit une situation avec un contact (partenaire, ami, collègue...) et l'IA génère des suggestions de messages adaptées au ton et à l'objectif recherché.

L'app est 100% gratuite — aucun système de paiement, toutes les fonctionnalités sont accessibles sans limite.

## Stack technique

| | |
|---|---|
| **Backend** | Django + Django REST Framework, JWT (simplejwt), PostgreSQL |
| **IA** | Groq (Llama 3.3 70B) |
| **Frontend** | React 19 + Vite, Tailwind CSS 4, TanStack Query, Zustand |
| **Mobile** | Capacitor (Android / iOS) |
| **Déploiement** | Backend → Render, Frontend → Vercel |

## Structure du repo

```
Charmy/
├── charmy-backend/     # API Django REST
│   ├── apps/
│   │   ├── accounts/       # utilisateurs, auth (email + JWT)
│   │   ├── relations/      # contacts, relations, journal
│   │   ├── conversations/  # sessions de coaching, suggestions IA
│   │   └── ai/              # appel au LLM (Groq) + construction du prompt
│   ├── config/              # settings, urls, wsgi/asgi
│   ├── build.sh             # script de build Render (install/collectstatic/migrate)
│   └── render.yaml          # définition Blueprint Render (optionnel)
└── charmy-frontend/    # SPA React
    ├── src/
    │   ├── api/              # clients axios par domaine
    │   ├── pages/             # écrans (Auth, Home, Relation, Coach, Profile...)
    │   ├── components/        # layout + UI partagés
    │   ├── store/              # état global (Zustand)
    │   └── hooks/               # hooks custom (thème, auth)
    ├── android/ ios/            # projets natifs Capacitor
    └── vercel.json               # rewrite SPA pour Vercel
```

## Fonctionnalités

- **Auth** par email/mot de passe, tokens JWT (access 2h, refresh 7j, rotation)
- **Relations** : contacts + fiche relation (type, ton, objectif, historique, stratégie, score de santé)
- **Coach IA** : colle une conversation → 3 suggestions de messages générées par l'IA, chacune avec son ton et son explication stratégique
- **Journal relationnel** : notes libres, étapes, conflits, moments positifs par relation
- **Historique** des sessions de coaching par relation
- **Dashboard** : stats globales (relations actives, sessions de la semaine, messages envoyés)

## Développement local

### Prérequis

- Python 3.13+, Node 20+
- PostgreSQL (ou tout DB compatible `DATABASE_URL`)
- Une clé API [Groq](https://console.groq.com)

### Backend

```bash
cd charmy-backend
python -m venv venv
./venv/Scripts/activate      # ou source venv/bin/activate sur macOS/Linux
pip install -r requirements.txt
cp .env.example .env         # puis renseigne SECRET_KEY, DATABASE_URL, GROQ_API_KEY...
python manage.py migrate
python manage.py createsuperuser   # optionnel
python manage.py runserver
```

L'API tourne sur `http://localhost:8000`.

### Frontend

```bash
cd charmy-frontend
npm install
cp .env.example .env.local   # VITE_API_URL=http://localhost:8000/api
npm run dev
```

L'app tourne sur `http://localhost:5173`.

## Variables d'environnement

### Backend (`charmy-backend/.env`)

| Variable | Requise | Description |
|---|---|---|
| `SECRET_KEY` | oui | clé secrète Django |
| `DEBUG` | oui | `True` en local, `False` en prod |
| `DATABASE_URL` | oui | ex : `postgres://user:pass@host:5432/dbname` |
| `ALLOWED_HOSTS` | non | liste séparée par virgules (Render `.onrender.com` déjà autorisé) |
| `GROQ_API_KEY` | oui | clé API Groq pour les suggestions IA |
| `CLOUDINARY_URL` | non | stockage média persistant en prod (sinon stockage local, non recommandé sur Render — disque éphémère) |
| `FRONTEND_URL` | non | URL du frontend, utilisée dans quelques liens |
| `CORS_ALLOWED_ORIGINS` | oui en prod | origine(s) autorisée(s) à appeler l'API |
| `CSRF_TRUSTED_ORIGINS` | oui en prod | idem pour les requêtes non-safe |
| `DJANGO_SUPERUSER_EMAIL` / `DJANGO_SUPERUSER_PASSWORD` | non | si définies, `build.sh` crée automatiquement ce compte admin au déploiement (idempotent) |

Voir [charmy-backend/.env.example](charmy-backend/.env.example).

### Frontend (`charmy-frontend/.env.local` ou variables Vercel)

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL de base de l'API, avec `/api` (ex : `https://charmy-backend.onrender.com/api`) |

Voir [charmy-frontend/.env.example](charmy-frontend/.env.example).

## Déploiement

- **Backend → Render** : Web Service Python, `Build Command: ./build.sh`, `Start Command: gunicorn config.wsgi:application`, + base PostgreSQL managée. `render.yaml` permet aussi un déploiement en un clic via Render Blueprints.
- **Frontend → Vercel** : import du repo avec **Root Directory = `charmy-frontend`**, Vite détecté automatiquement, variable `VITE_API_URL` à définir.

Après déploiement, mets à jour `FRONTEND_URL` / `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` sur Render avec l'URL Vercel réelle.

## Build mobile (Capacitor)

```bash
cd charmy-frontend
npm run build
npx cap sync
npx cap open android   # ou: npx cap open ios
```

## Licence

Projet privé — tous droits réservés.
