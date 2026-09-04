# KumpaX — Landing Page

Landing page marketing pour **KumpaX**, éditeur de 4 solutions SaaS (KumpaX Store, VisitApp, MaxImmo, KumpaCard) et intégrateur Odoo, présent au Sénégal, en Gambie, en Guinée et en RD Congo.

Basée à l'origine sur un export Figma Make ("Premium SaaS Showcase Website"), depuis largement nettoyée et retravaillée — voir `docs/HISTORIQUE.md` pour le détail complet des sessions, et `docs/AUDIT.md` pour l'état technique du projet.

## Développement local

```bash
npm i
cp .env.example .env   # puis renseigner VITE_WEB3FORMS_ACCESS_KEY, voir CLAUDE.md
npm run dev
```

Le formulaire de contact appelle directement `https://api.web3forms.com/submit` depuis le navigateur (aucun backend à lancer en parallèle) — voir CLAUDE.md pour le détail.

## Build de production

```bash
npm run build
```

Génère les fichiers statiques dans `dist/`. `VITE_WEB3FORMS_ACCESS_KEY` doit être renseignée dans `.env` **avant** ce build : Vite l'inline dans le bundle JS à la compilation, elle ne peut pas être changée après coup sans rebuilder.

## Déploiement (Docker)

```bash
cp .env.example .env   # renseigner VITE_WEB3FORMS_ACCESS_KEY avant de démarrer, voir CLAUDE.md
docker compose up -d --build
```

Un seul service : le site (nginx, image finale ~40 Mo, pas de runtime Node en production, pas de backend applicatif). Le formulaire de contact appelle web3forms directement depuis le navigateur. Voir `CLAUDE.md` pour le détail de la configuration (cache, en-têtes de sécurité, healthcheck, formulaire de contact).

## Documentation

- [`CLAUDE.md`](CLAUDE.md) — vue d'ensemble du projet et de la stack, pour reprendre le contexte rapidement.
- [`docs/AUDIT.md`](docs/AUDIT.md) — audit technique : dette restante, recommandations priorisées avec statut.
- [`docs/HISTORIQUE.md`](docs/HISTORIQUE.md) — journal détaillé de toutes les sessions de développement.
