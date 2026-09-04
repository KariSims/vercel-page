# Audit technique — Landing Page KumpaX

Date de l'audit initial : 2026-07-27
Dernière mise à jour : 2026-09-04 (audit complet du code physique post-commit : tout le travail accumulé depuis le 2026-08-25 committé et poussé sur `origin/main` par l'utilisateur — `kumpax_hub:witness` — voir §1, §7 ; `VITE_WEB3FORMS_ACCESS_KEY` renseignée et vérifiée fonctionnelle, un premier essai avait échoué faute de rebuild Docker après ajout de la clé — voir §4.1 ; `dist/` partiellement nettoyé du suivi git (`dist/assets/*` désormais ignoré, `dist/index.html`/`robots.txt`/`sitemap.xml` toujours suivis) — voir §7 ; `App.tsx` a grossi à ~1770 lignes, commentaire JSX obsolète au-dessus de la section Témoignages corrigé — voir §3.1 ; nouveau constat : `default_shadcn_theme.css` orphelin à la racine — voir §3 ; état au 2026-09-03 : témoignages, 4 retours clients réels fournis par l'utilisateur en FR, traduits en EN — voir §4.7)
Méthode : lecture intégrale du code physique du dépôt.

## 1. Résumé exécutif

Le projet est un **export brut de Figma Make** ("Premium SaaS Showcase Website") à l'origine. Il contient désormais une landing page fonctionnelle et entièrement rédigée en français/anglais pour KumpaX (hero avec carte de présence Afrique animée — pays affichés, plus villes —, section confiance "Pour KumpaX", méthode de travail "Notre approche", 4 produits, domaines d'expertise, Odoo, chiffres clés animés, **témoignages clients (contenu réel depuis le 2026-09-03, voir §4.7)**, contact, footer), débarrassée du scaffold shadcn/ui inutilisé, et **prête à être conteneurisée pour le déploiement**. La section "Notre équipe" a été retirée le 2026-08-12 (voir `docs/HISTORIQUE.md`) — les données `TEAM` fictives n'existent plus dans le code.

État actuel :

- ✅ SEO : `noindex, nofollow` retiré, canonical + Open Graph + Twitter Card ajoutés, `robots.txt`/`sitemap.xml` créés.
- ✅ Coordonnées de contact harmonisées (un seul email, TODO explicite sur le téléphone placeholder, liens sociaux morts retirés).
- ✅ Code mort et dépendances inutilisées **nettoyés** (voir section 3) — `node_modules` et le bundle CSS ont considérablement réduit.
- ✅ Lockfile racine régénéré le 2026-08-18 (`npm i`) après avoir constaté sa disparition plus tôt dans la journée.
- ✅ `docker/nginx.conf` — **manquant physiquement** jusqu'au 2026-08-18 (le dossier `docker/` n'existait pas du tout, malgré les références dans `Dockerfile`/`docker-compose.yml`/`CLAUDE.md`), recréé et testé en conditions réelles ce jour (`docker compose up -d --build` → conteneur `healthy`, caching `/assets/` immutable vérifié par `curl`).
- ✅ **Dockerisation** : `Dockerfile` multi-stage (build Node → nginx), `docker-compose.yml`, `docker/nginx.conf`, testés en conditions réelles (`docker build` + `docker run` + `curl`).
- ✅ Animations retravaillées (scroll-reveal, micro-interactions, motif signature sur la carte du hero, bande de logos défilante) — CSS natif, `prefers-reduced-motion` respecté partout.
- ✅ **Formulaire de contact branché et fonctionnel** à [web3forms](https://web3forms.com), appelé **directement depuis le navigateur** (`App.tsx`, `fetch` vers `https://api.web3forms.com/submit`) — plus aucun backend applicatif (l'API Express dédiée `server/`/Resend, en place du 2026-08-18 au 2026-08-27, a été retirée ce jour-là à la demande explicite de l'utilisateur). Honeypot anti-spam côté client, gestion d'erreur explicite. **`VITE_WEB3FORMS_ACCESS_KEY` renseignée et vérifiée le 2026-09-03/04** (clé confirmée présente dans le bundle JS du conteneur Docker reconstruit) — voir §4.1 pour le piège de rebuild rencontré en conditions réelles. Reste ouvert : restreindre la clé par domaine sur le dashboard web3forms.
- ✅ **Favicon** généré depuis le logo (`public/kumpax-logo.png`) et référencé dans `index.html` (`.ico` multi-résolution + PNG dédiés + `apple-touch-icon`) — voir §4.6.
- ✅ Dépôt git initialisé, avec remote `origin` sur GitHub (`Kumpax/landing-page`, branche `main` suivie et **à jour avec `origin/main`**) — constaté le 2026-08-25 ; **4 commits** (`Initial commit`, `landing-page : init and nice page`, `kumpa hub : landing page valide`, `kumpax_hub:witness` — ce dernier du 2026-09-04, committé et poussé par l'utilisateur, contient tout le travail accumulé depuis le 2026-08-25). L'initialisation a eu lieu hors session Claude Code documentée (aucune entrée `docs/HISTORIQUE.md` ne la mentionne) — historique antérieur au premier commit non récupérable.
- ✅ **Travail non commité — résolu le 2026-09-04** : le commit `kumpax_hub:witness` regroupe tous les correctifs et le nouveau contenu produits depuis le 2026-08-25 (crash React #130, section Témoignages, retrait de `server/`, bascule web3forms, favicon, 2e bureau Gambie). `git status` propre. Voir §4.3, §4.7, §7 et `docs/HISTORIQUE.md` pour le détail chronologique.
- ⚠️ **`dist/` (build de production) suivi par git, partiellement nettoyé** — le commit `kumpax_hub:witness` a fait disparaître `dist/assets/*` du suivi (`.gitignore` s'applique désormais correctement à ces fichiers hashés) ; **`dist/index.html`, `dist/robots.txt`, `dist/sitemap.xml` restent suivis** (`git ls-files dist/`), donc `dist/index.html` continuera d'apparaître modifié à chaque `npm run build` local. Voir §7.
- Aucun test, lint, ou vérification de types dans le script de build.

Rien de cela n'empêche de tester le site en local (`npm i && npm run dev`) ou de le déployer (`docker compose up -d --build`, un seul service désormais). Le formulaire de contact est désormais opérationnel de bout en bout ; il reste à restreindre la clé web3forms par domaine et à traiter les points restants de la section 7 (téléphones/adresse placeholder, SEO, `dist/` à finir de nettoyer) avant une mise en production réelle.

## 2. Stack technique observée

| Élément | Constat |
|---|---|
| Framework | React 18.3.1 — en `dependencies` directe (déplacée depuis `peerDependencies` lors du nettoyage du 2026-07-27 : plus aucune autre dépendance ne la tirait en tant que peer une fois MUI/Radix retirés) |
| Build | Vite 6.3.5 + `@vitejs/plugin-react` + `@tailwindcss/vite` |
| CSS | Tailwind CSS 4 (`src/styles/tailwind.css`, `theme.css`, `fonts.css`) via variables CSS (`--primary`, `--background`, etc. dans `theme.css`) |
| TypeScript | Toujours **aucun `tsconfig.json` pour l'app** (`vite build` reste une transpilation esbuild seule, sans vérification de types sur `App.tsx`/`main.tsx`/etc.). Depuis le 2026-08-18, `tsconfig.i18n.json` type-check strictement `src/i18n/fr.ts`+`en.ts` (`npm run typecheck:i18n`, exécuté avant `vite build` dans `npm run build`) — scope volontairement limité à ces deux fichiers pour garantir que `en.ts` reste `typeof fr` sans faire dépendre le build du reste de l'app, jamais type-checkée jusqu'ici |
| Gestionnaire de paquets | `pnpm-workspace.yaml` présent mais le projet est historiquement installé/buildé avec **npm** — incohérence à noter : soit retirer `pnpm-workspace.yaml`, soit migrer réellement vers pnpm. `package-lock.json` régénéré le 2026-08-18 après avoir disparu du dossier (voir `docs/HISTORIQUE.md`) |
| Linting/formatage | Aucun (`.eslintrc`, `prettier.config`, etc. absents) |
| Tests | Aucun framework de test configuré |
| Contrôle de version | Dépôt git initialisé, remote `origin` → `https://github.com/Kumpax/landing-page.git`, branche `main` à jour avec `origin/main` (constaté le 2026-08-25) |
| Backend | **Aucun** — retiré le 2026-08-27 (l'API Express dédiée `server/`/Resend a existé du 2026-08-18 au 2026-08-27, voir §4.1). Le formulaire de contact appelle web3forms directement depuis le navigateur. |

## 3. Architecture du code

```
src/
  main.tsx              → monte <App /> dans #root
  app/
    App.tsx              → COMPOSANT UNIQUE (~1770 lignes) : toute la page
  styles/
    index.css  → importe fonts.css + tailwind.css + theme.css
    theme.css   → tokens de couleur/design (palette KumpaX : #1234B0, #3B5BFF, #22D3EE...)
    fonts.css, tailwind.css → tokens d'animation (.reveal, .marquee-*, .map-*, prefers-reduced-motion)
public/
  robots.txt, sitemap.xml → servis tels quels par Vite/nginx à la racine
  kumpax-logo.png → logo réel de la marque, version couleur (fond blanc retiré, puis recadré sur la silhouette visible le 2026-08-12) — utilisé dans le header (`Logo` sans prop `light`)
  kumpax-logo-blue.png → variante bleu (#3B5BFF)→blanc à contraste étiré du même logo (générée le 2026-08-12, remplace une première version noir-blanc ; recadrée comme l'original), utilisée dans le footer (`<Logo light />`) pour rester lisible sur fond sombre tout en gardant une teinte de marque
Dockerfile, docker-compose.yml, .dockerignore, docker/nginx.conf → déploiement du front, un seul service (voir CLAUDE.md) — plus de backend/proxy applicatif depuis le retrait de server/ le 2026-08-27
.env.example → une seule variable, VITE_WEB3FORMS_ACCESS_KEY (inlinée par Vite au build) — copier en .env, jamais commis
default_shadcn_theme.css → fichier orphelin à la racine, aucun import nulle part dans src/ (constaté le 2026-09-04) — résidu probable du nettoyage shadcn/ui du 2026-07-27 (voir §3.2), à supprimer si confirmé inutile
```

**`guidelines/Guidelines.md`** (constaté le 2026-08-18) : n'est plus le template vierge décrit lors des audits précédents — contient désormais un design system complet pour un « hub KumpaX » (page mère de groupe, redirigeant vers des filiales/produits comme KumpaStore, bilingue FR/EN, tokens couleur/typo, composants UI détaillés). Ce document décrit une architecture de site sensiblement différente de l'implémentation actuelle d'`App.tsx` (page unique tout-en-un, en français uniquement, sans notion de filiales séparées ni de sélecteur de langue) — à traiter comme une direction produit envisagée, pas comme une spec de l'état actuel du code. Aucune action de code n'a été prise sur ce point ; signalé ici pour que la prochaine session en tienne compte si une refonte structurelle est demandée.

### 3.0 Système d'animation

`App.tsx` définit deux composants réutilisés dans toutes les sections : `Reveal` (fade-in + translateY au scroll via IntersectionObserver, prop `delayMs` pour les cascades) et `AnimatedStat` (compteur numérique animé). Le motif "signature" du site (voir `docs/HISTORIQUE.md`, suite 11) est un signal animé qui voyage le long des lignes de connexion de la carte du hero (`.map-connection`/`.map-ping` dans `tailwind.css`). `prefers-reduced-motion` est respecté à deux niveaux partout : un garde-fou global dans `tailwind.css` (neutralise transitions/animations) et une vérification `matchMedia` explicite dans chaque composant animé en JS.

### 3.1 Monolithe `App.tsx`

Toute la page (navbar, hero, section confiance "Pour KumpaX", méthode de travail "Notre approche", 4 blocs produits avec mock UI dessinées à la main en JSX/SVG, domaines d'expertise, section Odoo, chiffres clés animés, témoignages (contenu réel, voir §4.7), formulaire de contact, footer) est dans un seul fichier de composant. Toujours pas un bug en soi, mais la maintenabilité continue de se dégrader à mesure que le fichier grossit. La section "Notre équipe" (et les données `TEAM` associées) a été retirée le 2026-08-12.

**Recommandation** : si le projet doit continuer à évoluer, découper `App.tsx` en composants par section (`Hero.tsx`, `ProductsSection.tsx`, `ApproachSection.tsx`, `ContactForm.tsx`, `Footer.tsx`) et déplacer les données (`PRODUCTS`, `APPROACH_STEPS`, `IMPACT_STATS`, etc.) dans un fichier `data.ts`. Ce point reste ouvert.

### 3.2 Code mort — ✅ nettoyé le 2026-07-27

Les éléments suivants, identifiés lors de l'audit initial comme non référencés par `App.tsx`, ont été supprimés (vérifié par recherche d'import dans tout `src/` avant suppression, y compris dans les sections ajoutées depuis) :

- `src/app/components/ui/` (48 composants shadcn/ui, dont `accordion.tsx` — confirmé qu'aucune section FAQ n'existe réellement dans le code, malgré une supposition initiale en sens contraire).
- `src/app/components/figma/ImageWithFallback.tsx`.
- `src/imports/image.png`.
- `src/styles/globals.css` (fichier vide, non importé).
- Dossiers `src/app/components/` et `src/imports/` retirés entièrement (devenus vides).

**Dépendances `package.json` retirées** (toutes confirmées inutilisées par recherche d'import) : `@emotion/react`, `@emotion/styled`, `@mui/material`, `@mui/icons-material`, `@popperjs/core`, la totalité de `@radix-ui/*` (y compris `react-accordion`), `canvas-confetti`, `class-variance-authority`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `motion`, `next-themes`, `react-day-picker`, `react-dnd` + `react-dnd-html5-backend`, `react-hook-form`, `react-popper`, `react-resizable-panels`, `react-responsive-masonry`, `react-router`, `react-slick`, `recharts`, `sonner`, `tailwind-merge`, `vaul`.

Dépendances conservées : `react`, `react-dom` (déplacées de `peerDependencies` vers `dependencies` — nécessaire car plus aucune autre dépendance ne déclenchait leur installation automatique en tant que peer une fois les packages ci-dessus retirés), `lucide-react`, `react-icons`, `tw-animate-css`, + tooling `vite`/`@vitejs/plugin-react`/`@tailwindcss/vite`/`tailwindcss`.

**Effet mesuré** : après `npm i` (200 paquets supprimés de `node_modules`) et `npm run build`, le bundle CSS est passé d'environ 105 Ko à ~39 Ko (Tailwind ne scanne plus les classes des composants shadcn/ui supprimés) ; le bundle JS est resté identique (le tree-shaking de Vite excluait déjà ce code mort du bundle final avant le nettoyage).

## 4. Fonctionnalités incomplètes / trompeuses

### 4.1 Formulaire de contact — ✅ branché à web3forms (sans backend), ✅ fonctionnel depuis le 2026-09-04
**Historique** : du 2026-08-18 au 2026-08-27, ce formulaire passait par une API Express dédiée (`server/index.js`) envoyant l'email via [Resend](https://resend.com). Retiré le 2026-08-27 à la demande explicite de l'utilisateur, qui a opté pour [web3forms](https://web3forms.com) — service pensé pour fonctionner sans backend, plus léger à opérer.

`App.tsx` (`handleSubmit`) fait désormais un `POST` JSON **directement depuis le navigateur** vers `https://api.web3forms.com/submit` (états `sending`/`submitError`/succès toujours gérés explicitement, succès déterminé par `data.success` dans la réponse). Détail complet dans `CLAUDE.md` §Formulaire de contact.

**Pourquoi un appel direct au navigateur est acceptable ici (contrairement à Resend)** : la clé d'accès web3forms est conçue pour être publique — contrairement à une clé API classique de type Resend, elle est faite pour vivre dans un bundle JS côté client (web3forms la rate-limite et permet de la restreindre par domaine autorisé depuis leur dashboard). Elle est donc inlinée sans risque via `VITE_WEB3FORMS_ACCESS_KEY` (Vite l'embarque au moment du `build`, pas au runtime).

**Fait** : honeypot anti-spam (`website`, champ invisible côté formulaire — vérifié en tout début de `handleSubmit`, avant tout appel réseau), gestion d'erreur bout en bout (bannière rouge dans le formulaire si l'envoi échoue, jamais de faux "Message envoyé !" silencieux). `Dockerfile`/`docker-compose.yml` mis à jour pour passer `VITE_WEB3FORMS_ACCESS_KEY` en build arg (nécessaire pour qu'elle soit inlinée dans l'image). Plus aucun proxy `/api/` (`docker/nginx.conf`, `vite.config.ts`) — le navigateur appelle web3forms en cross-origin directement, dev comme prod.

**✅ Résolu (2026-09-03/04)** : l'utilisateur a créé un compte web3forms et renseigné `VITE_WEB3FORMS_ACCESS_KEY` dans `.env`. **Piège rencontré en conditions réelles** : la clé avait d'abord été ajoutée sans rebuild du conteneur Docker en cours d'exécution — Vite inline les vars `VITE_*` au moment du build, pas au runtime, donc le bundle servi continuait d'envoyer `access_key: ""` (constaté dans la console navigateur : réponse web3forms `"Form must include a ... 'access_key' field"`). Corrigé par `docker compose up -d --build` ; vérifié en grep-ant la valeur de la clé dans le bundle JS reconstruit (`dist/assets/*.js` du conteneur).

**Reste ouvert** : restreindre la clé au domaine `kumpax.com` depuis le dashboard web3forms (actuellement utilisable depuis n'importe quel domaine — pas un risque immédiat vu la conception publique de la clé, mais une bonne pratique à appliquer avant la mise en production réelle). Validation stricte des champs (regex email, longueurs max) et rate limiting n'existent plus côté applicatif — délégués à web3forms côté serveur (leur propre anti-spam automatique + rate limit, voir leur doc) ; `required`/`type="email"` HTML restent la seule validation côté front, jugée suffisante pour ce volume.

### 4.2 SEO — ✅ résolu
`noindex, nofollow` retiré ; canonical, Open Graph, Twitter Card, `robots.txt` et `sitemap.xml` ajoutés. Reste ouvert : `og:image`/`twitter:image` non actifs (TODO commenté dans `index.html`) — le logo réel `public/kumpax-logo.png` existe depuis le 2026-08-12 (recadré à 279×217 le même jour, voir §3 et `docs/HISTORIQUE.md` suite 8), pas au format 1200×630 attendu pour un partage social ; une image dédiée reste à fournir. `<title>` et `<meta name="description">` toujours des résidus Figma Make (en anglais, génériques) non mis à jour.

### 4.3 Coordonnées — ✅ harmonisées
- Email unifié sur `contact@kumpax.com` partout (`hello@kumpax.com` retiré du footer).
- Téléphone : format passé de `+237 6XX XXX XXX` (Cameroun) à `+221 7X XXX XX XX` (Sénégal) le 2026-08-12, à la demande explicite de l'utilisateur — **toujours un placeholder** (aucun vrai numéro fourni). Correction du décompte (2026-08-25, relecture du code physique) : **2** `TODO` explicites dans `App.tsx` (section Contact ligne ~1444, footer ligne ~1645) — le 3e usage évoqué par une version antérieure de ce document, le tableau `contacts` du mock UI KumpaCard, est en réalité rendu par un `.map()` générique (`App.tsx` ligne ~406) sur les données `src/i18n/{fr,en}.ts`, qui ne porte pas de `TODO` dédié. Reste à fournir le vrai numéro avant mise en production. Voir aussi §4.5 (incohérence géographique).
- **2026-08-27** : le 2e numéro (indicatif gambien, ajouté hors session le 2026-08-25 comme 4e élément du tableau `contacts` — avait causé le crash §7) a été fusionné dans le champ du 1er numéro (`"+221 7X XXX XX XX / +220 7X XXX XX"`, `contacts` repassé à 3 éléments), hors session Claude Code également. Cette correction a fait ressurgir le même type de désalignement en sens inverse : `contactIcons` (`App.tsx` ligne 383) était resté à 4 icônes (`[Mail, Phone, Phone, Globe]`) pour un tableau désormais revenu à 3 éléments — l'icône du contact "site web" (`kumpax.com`) affichait un téléphone au lieu d'un globe (pas de crash cette fois, juste une icône incorrecte). Recorrigé (`[Mail, Phone, Globe]`), `npm run build` + `docker compose up -d --build` revérifiés. Le 2e numéro (7 chiffres) est **volontairement** plus court que le 1er (9 chiffres) : format gambien correct, pas une incohérence.
- **2026-08-27 (même jour)** : section Contact (`#contact`, colonne à côté du formulaire) étendue avec un 2e bloc adresse + téléphone pour le bureau gambien — `t.contact.{addressLabel2,addressValue2,phoneLabel2,phoneValue2}` (`src/i18n/{fr,en}.ts`), rendu juste après le bloc Sénégal dans `App.tsx`. Pays choisi par l'utilisateur (Gambie) pour rester cohérent avec le 2e numéro déjà présent dans le mock KumpaCard (voir point précédent). **Contenu 100% placeholder** : ville entre crochets (`"[Ville], Gambie"`), numéro au format `+220 7X XXX XX` (même convention de X que le 1er) — 2 `TODO` explicites dans `App.tsx` juste avant chaque bloc, à remplacer avant mise en production.
- Liens réseaux sociaux morts (LinkedIn, X/Twitter, Instagram, tous en `href="#"`) retirés lors de la session du 2026-07-27. L'icône Mail du footer a été conservée mais convertie en lien fonctionnel `mailto:contact@kumpax.com`.
- **2026-08-12** : WhatsApp, Instagram et Facebook réintroduits dans le footer à côté de Mail (icônes de marque via `react-icons/fa` — `FaWhatsapp`, `FaInstagram`, `FaFacebook`), à la demande explicite de l'utilisateur. Contrairement à la première tentative (retirée pour liens `href="#"` morts), ceux-ci sont volontairement en `href="#"` avec un **TODO explicite par lien** (même traitement que le téléphone, décision confirmée avec l'utilisateur) — à brancher sur les vraies URLs/handle avant mise en production.

### 4.4 Pages légales inexistantes
Footer référence "Confidentialité", "CGU", "Mentions légales" — tous en `href="#"`. Aucune page n'existe. À prévoir si mise en ligne réelle (obligation légale d'affichage de mentions légales pour une entreprise).

### 4.5 Incohérence géographique Sénégal / Yaoundé — ✅ résolue le 2026-08-12
Le siège affiché sur la carte du hero (`AfricaMapVisual`, badge "KumpaX · Sénégal"), le téléphone (format sénégalais `+221 7X XXX XX XX`) et l'adresse de la section Contact pointent désormais tous vers le même pays : l'adresse Contact est passée de "Yaoundé, Cameroun" à **"Dakar, Sénégal"** à la demande explicite de l'utilisateur. Plus aucune occurrence de "Yaoundé"/"Cameroun" dans `src/` (vérifié par recherche). La ligne "Vue d'ensemble" de `CLAUDE.md` a aussi été corrigée dans la foulée (entreprise confirmée basée à Dakar, Sénégal) — plus aucune trace de Yaoundé/Cameroun dans le projet.

### 4.6 Favicon — ✅ résolu le 2026-08-27
Généré depuis `public/kumpax-logo.png` (le pictogramme seul, déjà recadré en PNG transparent — pas de texte à gérer) : `favicon.ico` (multi-résolution 16/32/48, embarque des PNG plutôt que le format bitmap classique — supporté par tous les navigateurs modernes et Windows depuis Vista), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180×180, composé sur fond blanc opaque plutôt que transparent — iOS peut mal afficher la transparence sur l'écran d'accueil). Générés via un script one-off (PowerShell + `System.Drawing`, aucun outil d'imagerie — ImageMagick/sharp/Pillow — n'était disponible dans l'environnement). Référencés dans `index.html` (`<link rel="icon">` ×3 + `apple-touch-icon`). Pas de source vectorielle du logo dans le projet, donc pas de `favicon.svg`.

### 4.7 Témoignages — section ajoutée le 2026-08-25, contenu réel depuis le 2026-09-03
Section `#temoignages` (`App.tsx`, entre "Impact" et "Contact") — carrousel de cartes citation/auteur. Contenu placeholder jusqu'au 2026-09-03 (texte entre crochets, décision prise avec l'utilisateur pour ne pas fabriquer de faux témoignages attribués à de vraies entreprises) ; **✅ résolu le 2026-09-03** : l'utilisateur a fourni 4 vrais témoignages clients (ABLO MOTORS, EMAB SARL, Harmony Life Shop, OCAF — tous des retours sur des intégrations Odoo) directement dans `src/i18n/fr.ts`. Le `TODO`/commentaire placeholder a été retiré (n'a plus lieu d'être). `en.ts` traduit dans le même mouvement — voir suite ci-dessous.

**Traduction EN + nettoyage (2026-09-03)** : `en.ts` contenait encore les 4 items placeholder génériques (texte anglais mais non spécifique) — traduits en anglais professionnel adapté au contexte métier (ERP/Odoo, gestion de stock, comptabilité), rôles localisés (`"PDG"` → `"CEO"`, `"Responsable financier"` → `"Finance Manager"`, `"Entrepreneure"` → `"Entrepreneur"`, `"Chargé des opérations"` → `"Operations Manager"`), noms d'entreprise et d'auteur conservés tels quels (identité réelle, non traduisible). Guillemets français « » qui n'entouraient que le 1er témoignage (incohérent avec les 3 autres et redondant avec l'icône `Quote` déjà rendue dans le JSX) retirés dans `fr.ts` pour homogénéité. Deux résidus de français oubliés dans `en.ts` corrigés au passage (hors section Témoignages, repérés pendant le même audit) : `contact.addressValue2` (`"Gambie"` → `"Gambia"`) et `contact.phoneLabel2` (entièrement en français, → `"Phone or Whatsapp (Gambia)"`). `npm run build` (typecheck i18n strict + vite build) revérifié après coup.

**Résidu corrigé le 2026-09-04** : le commentaire JSX au-dessus de la section (`App.tsx` ligne ~1432) disait encore `{/* ── TÉMOIGNAGES ── Contenu placeholder (TODO) ── */}`, resté inchangé lors de l'ajout des vrais témoignages la veille — trouvé lors d'un audit de la doc contre le code physique. Retiré (n'a plus lieu d'être).

**Bug corrigé le 2026-08-27** : le `.map()` rendant ces cartes utilisait `key={item.author}` — comme les 3 placeholders partagent le même `author` (`"[Prénom Nom]"`), les clés React étaient dupliquées, cassant la réconciliation (constaté en conditions réelles : rendu à 5 cartes mal alignées avec texte en double, alors que les données n'en contiennent que 3 — voir `docs/HISTORIQUE.md`). Corrigé en `key={i}`. Profitant du correctif, animation d'entrée enrichie d'une légère rotation par carte (`--tilt`, `TESTIMONIAL_TILTS`, classe `.testimonial-card` dans `tailwind.css`) qui revient à 0° une fois visible, sans jamais sortir de la grille.

**Carrousel avec flèches (2026-08-27, même jour)** : à la demande de l'utilisateur, la grille statique `grid-cols-3` a été remplacée par un carrousel horizontal (défilement natif `overflow-x-auto` + `scroll-snap`, 1/2/3 cartes visibles selon la largeur d'écran, flèches `ChevronLeft`/`ChevronRight` qui se masquent automatiquement quand rien à défiler). Prévu pour monter jusqu'à **10 témoignages** (contrainte explicite de l'utilisateur) sans changement de code — purement `data-driven` sur `t.testimonials.items.length`. Détail technique complet dans `CLAUDE.md`.

**4e témoignage placeholder ajouté (2026-08-28)** : à la demande de l'utilisateur (le carrousel doit refléter le nombre réel disponible, actuellement 4, capacité système jusqu'à 10) — `t.testimonials.items` passe de 3 à 4 (même convention placeholder, angle "durée de la collaboration / fidélité"). Aucun changement de code requis côté carrousel, purement data-driven.

## 5. Accessibilité

- Boutons icône (menu burger, réseaux sociaux) ont des `aria-label` — bon point.
- Les nombreux SVG décoratifs (carte Afrique, mock UIs produits) n'ont pas systématiquement `aria-hidden="true"` ; certains ont un `aria-label` (`AfricaMapVisual`), d'autres non. À uniformiser.
- Contrastes : la palette (`#1234B0` sur blanc, texte gris `#4B5163`/`#6B7491` sur fond clair) semble globalement correcte visuellement mais n'a pas été vérifiée avec un outil (Lighthouse/axe).

## 6. Sécurité

- **Formulaire de contact** : première surface d'entrée utilisateur réelle du projet. Du 2026-08-18 au 2026-08-27, validation + rate limiting étaient portés côté serveur (`server/index.js`, retiré). Depuis le 2026-08-27 (bascule web3forms), ces contrôles sont délégués au service tiers (anti-spam + rate limit côté web3forms) ; honeypot anti-spam (`website`) conservé côté client. Pas de captcha (jugé disproportionné pour ce volume ; à reconsidérer si du spam passe).
- `VITE_WEB3FORMS_ACCESS_KEY` est **volontairement** dans le bundle front (`VITE_*`) — à la différence de `RESEND_API_KEY` (secrète, retirée avec `server/`), cette clé est conçue par web3forms pour être publique (rate-limitée et restreignable par domaine depuis leur dashboard, pas par nous). Voir CLAUDE.md §Formulaire de contact pour le raisonnement complet.
- `.env` (contient la clé une fois renseignée) est exclu de `.dockerignore` et `.gitignore` — ne jamais la committer ni la coller dans `docs/`/`HISTORIQUE.md`, même si elle est destinée à être publique une fois buildée (éviter de la faire fuiter avant d'avoir pu la restreindre par domaine sur web3forms).
- `npm audit` n'a pas pu être exécuté sur le front (pas de `node_modules`/lockfile installés au moment de l'audit initial) — à faire après un premier `npm i`. Plus de `server/` à auditer séparément depuis le 2026-08-27.

## 7. Recommandations priorisées

| Priorité | Action | Effort | Statut |
|---|---|---|---|
| 🟠 Moyenne | Restreindre `VITE_WEB3FORMS_ACCESS_KEY` au domaine `kumpax.com` depuis le dashboard web3forms | Faible | Ouvert (clé fonctionnelle mais utilisable depuis n'importe quel domaine pour l'instant) |
| 🟠 Moyenne | Finir de nettoyer `dist/` du suivi git (`git rm -r --cached dist`, un commit dédié) — `dist/assets/*` déjà hors suivi depuis le 2026-09-04, mais `dist/index.html`/`robots.txt`/`sitemap.xml` toujours suivis | Faible | Ouvert (réduit le 2026-09-04, voir §1) |
| 🟡 Basse | Supprimer `default_shadcn_theme.css` (racine du projet) — fichier orphelin, aucun import nulle part | Faible | Ouvert (constaté le 2026-09-04) |
| 🟠 Moyenne | Fournir le vrai numéro de téléphone Sénégal (remplace les 2 `TODO` dans `App.tsx` + le placeholder du tableau `contacts` KumpaCard) | Faible | Ouvert |
| 🟠 Moyenne | Fournir la vraie ville + numéro du bureau gambien (2e bloc adresse/téléphone ajouté le 2026-08-27, section Contact — `t.contact.{addressValue2,phoneValue2}`) | Faible | Ouvert |
| 🟠 Moyenne | Remplacer les témoignages placeholder par de vrais retours clients | Faible-Moyen | ✅ Résolu le 2026-09-03 (4 témoignages réels en FR, traduits en EN) |
| 🟠 Moyenne | Fournir les vraies URLs WhatsApp/Instagram/Facebook (footer, 3 `TODO` ajoutés le 2026-08-12) | Faible | Ouvert |
| 🟠 Moyenne | Fournir une image `og:image`/`twitter:image` (1200×630px) | Faible | Ouvert |
| 🟠 Moyenne | Mettre à jour `<title>` et `<meta name="description">` (résidus Figma Make) | Faible | Ouvert |
| 🟠 Moyenne | Ajouter un `tsconfig.json` + intégrer `tsc --noEmit` dans le script `build` pour attraper les erreurs de types | Faible | Ouvert |
| 🟡 Basse | Clarifier npm vs pnpm (`pnpm-workspace.yaml` présent mais le projet tourne en npm) | Faible | Ouvert |
| 🟡 Basse | Retirer le plugin `figmaAssetResolver` de `vite.config.ts` (pointe vers `src/assets`, dossier inexistant — résidu inerte de l'export Figma Make) | Faible | Ouvert |
| 🟡 Basse | Découper `App.tsx` en composants par section (fichier encore grossi depuis l'audit initial) | Moyen-Élevé | Ouvert |
| 🟡 Basse | Créer les pages légales (mentions légales, CGU, confidentialité) | Moyen | Ouvert |
| ✅ Fait | Retirer `noindex, nofollow` + ajouter meta SEO (canonical, OG, Twitter, robots.txt, sitemap.xml) | — | Résolu |
| ✅ Fait | Harmoniser les coordonnées (email unique, téléphone signalé, liens sociaux morts retirés) | — | Résolu |
| ✅ Fait | Committer un lockfile (`package-lock.json`) — avait disparu du dossier, régénéré le 2026-08-18 | — | Résolu |
| ✅ Fait | Recréer `docker/nginx.conf` — le dossier `docker/` n'existait pas physiquement, `docker compose up --build` échouait ; recréé et testé en conditions réelles le 2026-08-18 | — | Résolu |
| ✅ Fait | Supprimer les composants shadcn/ui et dépendances inutilisés | — | Résolu |
| ✅ Fait | Dockeriser pour le déploiement (Dockerfile multi-stage + nginx, testé en conditions réelles) | — | Résolu |
| ✅ Fait | Aligner l'incohérence géographique Sénégal (carte hero, téléphone) / Yaoundé (adresse Contact) | — | Résolu |
| ✅ Fait | Retravailler les animations (scroll-reveal, hover, motif signature, bande de logos), `prefers-reduced-motion` partout | — | Résolu |
| ✅ Fait | Aligner `App.tsx` sur les tokens du design system (`theme.css`/`fonts.css`/`Guidelines.md`) — polices h1/h2 forcées en Outfit au lieu de Fraunces, ~35 couleurs dupliquant les tokens en hex codé en dur, champs de formulaire en `bg-white` au lieu de `--input-background`, états focus/actif manquants sur plusieurs boutons — corrigé le 2026-08-18 | — | Résolu |
| ✅ Fait | Corriger le crash page blanche (React error #130) causé par `contactIcons` (`App.tsx` `KumpaCardMockUI`, 3 icônes) désynchronisé du tableau `contacts` (4 éléments à ce moment) — voir `docs/HISTORIQUE.md` 2026-08-25 (suite) | — | Résolu |
| ✅ Fait | Recorriger `contactIcons` (`App.tsx` ligne 383) après fusion hors session des 2 numéros de téléphone dans `contacts` (retour à 3 éléments) — désalignement inverse, icône "site web" devenue "Phone" au lieu de "Globe" (pas de crash) ; `[Mail, Phone, Globe]` rétabli le 2026-08-27 | — | Résolu |
| ✅ Fait | Committer tout le travail accumulé depuis le 2026-08-25 (correctifs, section Témoignages, retrait de `server/`, bascule web3forms, favicon, 2e bureau Gambie) — commit `kumpax_hub:witness`, poussé sur `origin/main` | — | Résolu le 2026-09-04 |
| ✅ Fait | Renseigner `VITE_WEB3FORMS_ACCESS_KEY` et vérifier le formulaire de contact de bout en bout | — | Résolu le 2026-09-03/04 (voir §4.1) |
| ✅ Fait | Traduire les témoignages réels en anglais (`en.ts`) et corriger les incohérences relevées au passage (guillemets, résidus de français Gambie) | — | Résolu le 2026-09-03 |
| ✅ Fait | Initialiser un dépôt git — fait hors session Claude Code documentée (entre le 2026-07-27 et le 2026-08-19), remote `origin` GitHub configuré ; constaté et documenté ici le 2026-08-25 | — | Résolu |
| ✅ Fait | Brancher le formulaire de contact à un vrai service d'envoi — API Express dédiée (`server/`) + Resend, validation serveur, honeypot, rate limiting, gestion d'erreur explicite, stack complète testée via `docker compose up -d --build` (2 conteneurs `healthy`) le 2026-08-18. Remplacé le 2026-08-27 (voir ligne suivante) | — | Résolu, puis remplacé |
| ✅ Fait | Retirer le backend `server/`/Resend et brancher le formulaire de contact à web3forms (appel direct navigateur, sans backend) — décision explicite de l'utilisateur le 2026-08-27 ; `docker-compose.yml`/`Dockerfile` mis à jour (build arg `VITE_WEB3FORMS_ACCESS_KEY`), proxy `/api/` retiré de `docker/nginx.conf` et `vite.config.ts`, build local revérifié (`npm run build` passe, bundle référence bien `api.web3forms`). Ne manque que `VITE_WEB3FORMS_ACCESS_KEY` (voir ligne 🔴 Haute ci-dessus) | — | Résolu (plomberie) |
| ✅ Fait | Générer un favicon depuis `public/kumpax-logo.png` et le référencer dans `index.html` (`favicon.ico` multi-résolution, `favicon-16x16.png`/`favicon-32x32.png`, `apple-touch-icon.png`) — 2026-08-27 | — | Résolu |
