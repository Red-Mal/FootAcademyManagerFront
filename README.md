# academy-frontend

Frontend de FootAcademyManager — application de gestion d'académie de football
(équipes, joueurs, entraîneurs, séances).

> **Statut** : fondations uniquement. Cette première étape pose la structure du
> projet, le client API, l'authentification, le layout et le routage protégé,
> ainsi qu'une page de connexion fonctionnelle reliée au vrai backend. Les
> pages métier (équipes, joueurs, planning, ...) seront implémentées dans une
> étape ultérieure.

## Stack

- React 18 + Vite + TypeScript (strict)
- React Router v6 (data routers)
- TanStack Query v5
- React Hook Form + Zod
- Zustand (state global léger : auth, UI)
- Axios
- TailwindCSS v3 + shadcn/ui
- react-i18next (français pour le MVP)
- date-fns (locale `fr`)
- Vitest + React Testing Library

## Prérequis

- Node.js 20 (voir `.nvmrc`)
- Le backend FootAcademyManager lancé sur `http://localhost:8080`

## Démarrage

```bash
npm install
npm run dev
```

L'application est servie sur `http://localhost:5173`. Le serveur de
développement Vite proxifie les requêtes `/api` et `/uploads` vers
`http://localhost:8080` afin d'éviter les soucis de CORS en local.

## Variables d'environnement

Voir `.env.example`. Les fichiers `.env.development` et `.env.production`
définissent les valeurs par défaut pour chaque mode (`VITE_API_BASE_URL`,
`VITE_APP_NAME`).

## Scripts

| Commande               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Lance le serveur de développement Vite          |
| `npm run build`        | Vérifie les types puis build pour la prod       |
| `npm run preview`      | Prévisualise le build de production             |
| `npm run lint`         | Lint avec ESLint                                |
| `npm run format`       | Formate le code avec Prettier                   |
| `npm run format:check` | Vérifie le formatage sans modifier les fichiers |
| `npm run test`         | Lance les tests en mode watch (Vitest)          |
| `npm run test:run`     | Lance les tests une fois                        |
| `npm run test:ui`      | Lance les tests avec l'interface Vitest UI      |

## Structure

```
src/
├── app/            # bootstrap : App, providers, router, query client
├── features/       # logique métier par domaine (ex : auth)
├── pages/          # pages routées
├── shared/
│   ├── api/        # client HTTP (axios), erreurs, types axios
│   ├── components/ # layout, ui (shadcn), feedback, form
│   ├── hooks/      # hooks partagés
│   ├── i18n/       # configuration et traductions
│   ├── lib/        # helpers (cn, dates, formats)
│   ├── routes/     # garde-fous de routage (auth, rôles)
│   └── types/      # types miroirs du domaine backend
└── test/           # setup et utilitaires de test
```

## Authentification

L'authentification repose sur un JWT (access + refresh token) stocké via un
store Zustand persistant (`localStorage`).

> ⚠️ Stocker un JWT en `localStorage` expose l'application au XSS. C'est un
> compromis acceptable pour ce MVP. Une migration vers des cookies `HttpOnly`
> avec un endpoint de rafraîchissement basé sur cookie est documentée comme
> piste d'évolution en phase 2 (voir le commentaire en tête de
> `src/features/auth/auth.store.ts`).

## Tests

```bash
npm run test:run
```

Les tests utilisent Vitest, React Testing Library et un utilitaire
`renderWithProviders` (`src/test/utils.tsx`) qui enveloppe les composants avec
les providers nécessaires (i18n, React Query, routeur en mémoire).
