# Historique des sessions — Landing Page KumpaX

Ce fichier consigne, session par session, ce qui a été fait sur ce projet avec Claude Code. Chaque entrée doit rester courte : date, ce qui a été fait, décisions prises, et ce qui reste ouvert.

---

## 2026-09-04 — Documentation resynchronisée avec le code physique (post-commit)

**Contexte** : demande explicite de l'utilisateur — "mets à jour toute la documentation du projet en fonction du code physique". `git status` était propre au début de cette session, contrairement à toutes les sessions précédentes documentées : un commit `kumpax_hub:witness` (2026-09-04 04:05:11, hors session Claude Code) avait entre-temps regroupé et poussé sur `origin/main` tout le travail accumulé depuis le 2026-08-25 (correctifs, retrait de `server/`, bascule web3forms, section Témoignages, favicon, 2e bureau Gambie, mises à jour de doc de la session précédente). `CLAUDE.md`/`docs/AUDIT.md` décrivaient encore ce travail comme non commité — écart à corriger en priorité.

**Fait** — relecture intégrale du code physique et comparaison avec `CLAUDE.md`/`docs/AUDIT.md`/`README.md`, corrections apportées :
- **Statut git** : `CLAUDE.md` (Vue d'ensemble, point 6) et `docs/AUDIT.md` (résumé exécutif, §7) mis à jour — 4 commits (pas 3), branche à jour avec `origin/main`, plus de travail non commité. Les entrées `✅ Fait` de `docs/AUDIT.md` §7 qui portaient encore la mention "correctif non commité" (crash React #130, `contactIcons`) nettoyées.
- **`dist/` suivi par git** : constaté que le commit `kumpax_hub:witness` avait déjà réglé une partie du problème signalé aux sessions précédentes — `dist/assets/*` (fichiers hashés) ont disparu du suivi (`.gitignore` s'applique désormais correctement dessus), mais `dist/index.html`/`robots.txt`/`sitemap.xml` restent suivis (`git ls-files dist/`). Statut affiné de "ouvert" à "partiellement résolu" dans les deux docs.
- **Formulaire de contact** : `VITE_WEB3FORMS_ACCESS_KEY` était documentée comme "pas encore renseignée" dans les deux fichiers — obsolète depuis la session précédente (clé renseignée et vérifiée fonctionnelle après un `docker compose up -d --build`, voir entrée du 2026-09-03 ci-dessous). Section réécrite dans `CLAUDE.md` (point 1) et `docs/AUDIT.md` (§1, §4.1, §7) ; ne reste ouvert que la restriction de la clé par domaine sur le dashboard web3forms.
- **Taille d'`App.tsx`** : `wc -l` donne désormais 1767 lignes (vs "~1670" documenté) — mis à jour dans `CLAUDE.md` et `docs/AUDIT.md` §3.
- **Commentaire JSX obsolète** : `App.tsx` ligne ~1432, juste au-dessus de la section Témoignages, disait encore `{/* ── TÉMOIGNAGES ── Contenu placeholder (TODO) ── */}` — resté inchangé la veille lors de l'ajout des vrais témoignages (session du 2026-09-03, qui n'avait touché que `src/i18n/`). Retiré (n'a plus lieu d'être). `npm run build` revérifié après coup.
- **Fichier orphelin découvert** : `default_shadcn_theme.css` à la racine du projet, aucun import nulle part dans `src/` (`grep` sur tout le dépôt) — résidu probable du nettoyage shadcn/ui du 2026-07-27, jamais documenté jusqu'ici. Signalé dans `CLAUDE.md` et `docs/AUDIT.md` (§3, §7) comme à supprimer, pas supprimé cette session (pas demandé, et pas 100% certain qu'il ne serve pas de référence de style pour une reprise future — décision laissée à l'utilisateur).
- `README.md` relu en entier : déjà cohérent avec le code physique (commandes `npm i`/`cp .env.example .env`/`npm run dev`/`docker compose up -d --build` toutes exactes) — aucune modification nécessaire.

**Vérifié** : `npm run build` (typecheck i18n strict + vite build) passe après le retrait du commentaire JSX obsolète.

**Ouvert** — rien de nouveau par rapport à la session précédente, à l'exception du fichier orphelin et du `dist/` partiellement nettoyé (voir ci-dessus) : téléphones Sénégal/Gambie toujours placeholder, liens sociaux (WhatsApp/Instagram/Facebook) toujours `href="#"`, `og:image`/`twitter:image` désactivés, `<title>`/description toujours résidus Figma Make, pages légales absentes, `App.tsx` toujours un monolithe, ambiguïté npm/pnpm non tranchée. Ce travail de documentation lui-même n'est pas encore commité.

---

## 2026-09-03 — Témoignages réels (FR fournis par l'utilisateur, traduits en EN) + web3forms débloqué

**Contexte 1 (formulaire)** : l'utilisateur avait renseigné `VITE_WEB3FORMS_ACCESS_KEY` dans `.env`, mais le formulaire échouait encore (`access_key: ""` dans le payload observé côté navigateur). Diagnostic : le conteneur Docker tournait sur un bundle construit *avant* que la clé soit renseignée — Vite inline les vars `VITE_*` au build, pas au runtime, donc un `.env` mis à jour ne change rien sans rebuild (piège déjà documenté dans `CLAUDE.md`). Corrigé par `docker compose up -d --build` ; vérifié en grep-ant la valeur de la clé dans le bundle JS servi par le conteneur reconstruit.

**Contexte 2 (témoignages)** : l'utilisateur a remplacé les 3 témoignages placeholder de `src/i18n/fr.ts` par 4 vrais retours clients (ABLO MOTORS, EMAB SARL, Harmony Life Shop, OCAF — tous des retours sur des intégrations Odoo), directement dans le fichier via son éditeur, hors session Claude Code. Demande : adapter `en.ts` (toujours 4 items placeholder à ce moment) et auditer/corriger les incohérences du projet.

**Fait** :
- `src/i18n/en.ts` : les 4 items placeholder traduits en anglais professionnel, adapté au contexte métier (ERP/Odoo, gestion de stock, comptabilité) plutôt que traduits mot à mot — noms d'auteur et d'entreprise conservés tels quels (identité réelle), rôles localisés (`"PDG"` → `"CEO"`, `"Responsable financier"` → `"Finance Manager"`, `"Entrepreneure"` → `"Entrepreneur"`, `"Chargé des opérations"` → `"Operations Manager"`). Commentaire `TODO`/placeholder au-dessus de la clé `testimonials` retiré (`en.ts` et `fr.ts`) — n'a plus lieu d'être.
- `src/i18n/fr.ts` : guillemets français « » qui n'entouraient que le 1er témoignage (ABLO MOTORS) retirés — incohérent avec les 3 autres items et redondant avec l'icône `Quote` déjà rendue dans le JSX juste avant chaque citation (`App.tsx`).
- Audit plus large de `en.ts` (`grep` sur les caractères accentués français) : 2 résidus de français oubliés lors d'une session précédente, hors section Témoignages — `contact.addressValue2` (`"Gambie"` → `"Gambia"`) et `contact.phoneLabel2` (entièrement en français, `"Téléphone ou Whatsapp (Gambie)"` → `"Phone or Whatsapp (Gambia)"`).
- `CLAUDE.md` et `docs/AUDIT.md` (§4.7, §7, en-tête) mis à jour pour refléter que les témoignages ne sont plus placeholder.

**Vérifié** : `npm run build` passe (typecheck i18n strict + vite build) après chaque étape.

**Ouvert** : le contenu des témoignages est désormais réel, mais toujours pas commité — reste dans le lot de travail non commité déjà volumineux (voir `CLAUDE.md` point 6, `docs/AUDIT.md` §7). `VITE_WEB3FORMS_ACCESS_KEY` renseignée et fonctionnelle (conteneur rebuild), reste à restreindre la clé par domaine sur le dashboard web3forms. Reste inchangé par ailleurs : téléphones/adresse Gambie toujours placeholder, `dist/` suivi par git, og:image, title/description SEO.

---

## 2026-08-28 — 4e témoignage placeholder ajouté

**Contexte** : après la mise en place du carrousel (suite précédente), demande de l'utilisateur — "affiche selon la disponibilité des témoignages, actuellement il y en a 4, mais prévois un max de 10 dans le système pour afficher juste 4 pour le moment". Vérification faite : `src/i18n/fr.ts`/`en.ts` ne contenaient que **3** items à ce moment, pas 4. Plutôt que de deviner, question posée à l'utilisateur (`AskUserQuestion`) : ajouter un 4e placeholder, laisser à 3, ou l'utilisateur avait-il un vrai 4e témoignage à dicter ? Réponse : ajouter un 4e placeholder, même convention que les 3 autres.

**Fait** : `t.testimonials.items` (`src/i18n/fr.ts`/`en.ts`) passe de 3 à 4 — nouvel item avec un angle différent des 3 existants (problème résolu / bénéfice concret / qualité de service) : la **durée de la collaboration et la fidélité** au client. Texte entre crochets (`"[Prénom Nom]"`/`"[First Last]"` etc.), même style que les 3 autres, pas de `TODO` dédié supplémentaire (le commentaire `TODO` global au-dessus de la clé `testimonials` couvre déjà tous les items).

**Vérifié** : `npm run build` passe (typecheck i18n strict + vite build). `grep -c "quote:"` confirme 4 dans les deux fichiers. Le carrousel (suite précédente) est purement `data-driven` sur `t.testimonials.items.length` — aucun changement de code nécessaire pour afficher 4 au lieu de 3 ; la capacité jusqu'à 10 avait déjà été testée en conditions réelles (voir suite précédente).

**Ouvert** : rien de nouveau sur ce point — reste inchangé par ailleurs (contenu encore 100% placeholder pour les 4 témoignages, `VITE_WEB3FORMS_ACCESS_KEY`, commit en attente, etc., voir suites précédentes).

---

## 2026-08-27 (suite 5) — Témoignages en carrousel (flèches gauche/droite), prêt pour jusqu'à 10 cartes

**Contexte** : suite du correctif de clé React dupliquée (suite précédente) — demande de proposer une animation par carte façon carrousel, avec une flèche de navigation à gauche/droite, en prévoyant que le nombre de témoignages augmente (jusqu'à 10 maximum).

**Fait** :
- `src/app/App.tsx` : la grille `grid grid-cols-1 lg:grid-cols-3 gap-6` remplacée par un défilement horizontal natif — `overflow-x-auto snap-x snap-mandatory scroll-smooth`, scrollbar masquée (nouvelle classe `.no-scrollbar`, `tailwind.css`). Largeur de carte responsive : `w-[85%]` sur mobile (la carte suivante dépasse légèrement pour signaler qu'on peut glisser), `sm:w-[calc((100%-1.5rem)/2)]` (2 par vue), `lg:w-[calc((100%-3rem)/3)]` (3 par vue, calc() plutôt que fraction fixe pour rester exact avec `gap-6`).
- Deux boutons flèche (icônes `ChevronLeft`/`ChevronRight`, import `ChevronLeft` ajouté à la liste `lucide-react` existante) déclenchent un `container.scrollBy({ left: cardWidth + gap, behavior: "smooth" })` — largeur de carte mesurée dynamiquement via `firstElementChild.getBoundingClientRect().width` (s'adapte à la largeur réelle à tout instant, pas de calcul de breakpoint dupliqué en JS). État `canScrollTestimonialsPrev`/`Next` (2 nouveaux `useState`, recalculés au `onScroll` du conteneur et au `resize` de la fenêtre) masque automatiquement (`disabled:opacity-0 disabled:pointer-events-none`) la flèche inutile — notamment les deux flèches disparaissent d'elles-mêmes sur desktop tant qu'il n'y a que 3 témoignages (tout tient dans la vue, rien à défiler), et réapparaissent dès qu'il y en a plus.
- `t.testimonials.{prevAriaLabel,nextAriaLabel}` ajoutées (`src/i18n/{fr,en}.ts`) pour les `aria-label` des boutons.
- `Reveal` (composant partagé, `App.tsx`) : nouveau prop `style` optionnel (déjà ajouté lors du correctif précédent) réutilisé pour passer `--tilt` par carte — l'animation d'entrée "flocon" (rotation légère à l'apparition) est conservée, elle se redéclenche naturellement pour chaque carte au fur et à mesure qu'elle entre dans la zone visible du carrousel (l'`IntersectionObserver` de `Reveal` tient compte du clipping du conteneur `overflow-x-auto`, donc les cartes au-delà de la 3e ne s'animent qu'au moment où l'utilisateur les fait défiler en vue).
- **Scalabilité jusqu'à 10** (contrainte donnée par l'utilisateur) : aucune limite codée en dur nulle part — le rendu est purement `t.testimonials.items.map(...)`, le défilement natif + `scroll-snap` n'a pas de plafond de nombre de cartes. Vérifié en ajoutant temporairement des items de test en local (7 puis 10) : le défilement, les flèches et l'activation/désactivation fonctionnent identiquement quel que soit le nombre ; items de test retirés avant de committer.

**Vérifié** : `npm run build` passe (typecheck i18n strict + vite build). `npm run dev` + `curl` : page et bundle servis (200). Pas de vérification visuelle réelle dans un navigateur (`browse`/gstack toujours bloqué par la politique de contrôle applicatif Windows sur cette machine, cf. sessions précédentes) — revue faite par lecture attentive du JSX généré et test fonctionnel du serveur dev.

**Ouvert** : rien de nouveau sur ce point précis — reste inchangé par ailleurs (contenu placeholder des témoignages, `VITE_WEB3FORMS_ACCESS_KEY`, commit en attente, etc., voir suites précédentes).

---

## 2026-08-27 (suite 4) — Cartes Témoignages "éparpillées" : clé React dupliquée, pas un bug CSS

**Contexte** : capture d'écran fournie par l'utilisateur (`D:\img_dsc\temoignages.png`, hors dépôt) montrant la section Témoignages avec **5 cartes** mal alignées façon puzzle (texte en double pour 2 des 3 témoignages), demande de rendre les cartes "animées en forme de flocon mais pas désordonnées comme actuellement".

**Diagnostic** : `t.testimonials.items` (`src/i18n/{fr,en}.ts`) ne contient que **3** items — la capture ne peut donc pas correspondre à un rendu normal du code actuel. En lisant le `.map()` (`App.tsx`), la clé utilisée était `key={item.author}` ; les 3 items placeholder partagent tous le même `author` (`"[Prénom Nom]"`, pas encore de vrais témoignages — voir `docs/AUDIT.md` §4.7), donc les 3 clés générées étaient **identiques**. Une clé React dupliquée dans une liste casse la réconciliation (React ne peut plus faire correspondre correctement les éléments entre deux rendus, notamment ici avec l'observer `IntersectionObserver` de `Reveal` qui déclenche un `setState` par carte) — cohérent avec un rendu observé à 5 cartes mal positionnées avec du texte dupliqué. Pas un problème de CSS/grid (`grid grid-cols-1 lg:grid-cols-3 gap-6` est un CSS Grid standard, qui aurait aligné les cartes correctement même à 3 ou 5 items).

**Fait** :
- `App.tsx` : `key={item.author}` → `key={i}` (index) — légitime ici, liste statique dont l'ordre ne change jamais ; à revoir si `testimonials.items` devient un jour dynamique/réordonnable (il faudrait alors un identifiant stable par item).
- Animation d'entrée enrichie pour répondre à la 2e partie de la demande ("flocon mais pas désordonné") : chaque carte reçoit désormais une légère rotation d'entrée (`--tilt`, valeurs alternées `[-3, 4, -2]deg` dans la nouvelle constante `TESTIMONIAL_TILTS`) en plus du fondu/`translateY` standard de `Reveal` — la carte "se pose" avec un angle qui revient à 0° une fois visible, sans jamais sortir de son emplacement dans la grille (pas de positionnement absolu). Nouvelle classe CSS `.testimonial-card` dans `tailwind.css`, appliquée uniquement à cette section.
- `Reveal` (composant partagé) : nouveau prop optionnel `style` (fusionné avec le `transitionDelay` existant) pour pouvoir passer `--tilt` par carte sans dupliquer le composant.

**Vérifié** : `npm run build` passe. Pas de vérification visuelle réelle possible (`browse`/gstack toujours bloqué par la politique de contrôle applicatif Windows sur cette machine, voir sessions précédentes) — diagnostic fait par lecture de code, à partir de la capture fournie par l'utilisateur.

**Ouvert** : rien de nouveau sur ce point précis. Reste inchangé par ailleurs (voir suites précédentes du même jour) — notamment le contenu placeholder des témoignages, qui a directement causé cette collision de clé (une fois les vrais noms/entreprises renseignés, les clés redeviendront naturellement uniques, mais `key={i}` reste la correction robuste indépendamment de ça).

---

## 2026-08-27 (suite 3) — Favicon généré depuis le logo

**Contexte** : l'utilisateur avait constaté que `docs/AUDIT.md` §4.6 signalait le favicon comme absent (aucun fichier, aucune référence dans `index.html`) — l'onglet du navigateur retombait sur une icône par défaut au chargement de la page. Demande : générer un favicon à partir du logo du projet et le placer où il faut.

**Contrainte rencontrée** : aucun outil d'imagerie disponible dans l'environnement (ni ImageMagick, ni le module Node `sharp`, ni Python Pillow). Contournée avec PowerShell + `System.Drawing` (.NET, disponible nativement sous Windows) pour le redimensionnement, et un script Node one-off pour assembler le `.ico` final (format ICONDIR standard embarquant directement des PNG par frame — supporté par tous les navigateurs modernes et Windows depuis Vista, plus simple à construire correctement que le format bitmap historique).

**Fait** :
- Source : `public/kumpax-logo.png` (279×217, RGBA transparent) — c'est déjà le pictogramme seul (le "X" stylisé), sans le texte "KumpaX", donc directement utilisable tel quel comme icône.
- Généré (PowerShell, canvas carré transparent, logo centré avec une marge, interpolation bicubique) : `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png` (ce dernier supprimé ensuite, seulement utile comme frame intermédiaire du `.ico`), `apple-touch-icon.png` (180×180, **fond blanc opaque** plutôt que transparent — iOS peut afficher un fond noir sur les icônes d'accueil transparentes). Deux tailles PWA (192/512) générées puis supprimées car non référencées nulle part (pas de `manifest.json` dans ce projet — inutile de laisser des fichiers orphelins).
- Assemblé (Node) : `favicon.ico` à partir des 3 PNG 16/32/48 (3493 octets) — validé en le rechargeant via `System.Drawing.Icon` en PowerShell (chargement OK).
- `index.html` : 4 nouvelles balises `<link>` juste après le `<link rel="canonical">` — `rel="icon" href="/favicon.ico" sizes="any"`, 2× `rel="icon" type="image/png"` (32×32, 16×16), `rel="apple-touch-icon" sizes="180x180"`.

**Vérifié** : `npm run build` copie bien les 4 fichiers dans `dist/` et `dist/index.html` référence les bons chemins. `npm run dev` lancé brièvement + `curl` : `/favicon.ico`, `/favicon-32x32.png`, `/apple-touch-icon.png` répondent tous 200.

**Ouvert** : rien de nouveau — le favicon est un mark seul (pas de variante avec texte à gérer), aucune décision en attente sur ce point. Reste inchangé par ailleurs (voir suites précédentes du même jour).

---

## 2026-08-27 (suite 2) — 2e bloc adresse/téléphone (bureau gambien) dans la section Contact

**Contexte** : en attendant la clé `VITE_WEB3FORMS_ACCESS_KEY`, demande de prévoir dans la section Contact (colonne d'info, à côté du formulaire) une 2e adresse fixe et un 2e numéro de téléphone. Question posée avant implémentation (`AskUserQuestion`) sur le pays à afficher : réponse retenue — **Gambie**, pour rester cohérent avec le 2e numéro (indicatif `+220`) déjà présent dans le mock UI KumpaCard depuis les sessions du 2026-08-25/27 (voir suites précédentes).

**Fait** :
- `src/i18n/fr.ts`/`en.ts` : nouvelles clés `t.contact.addressLabel2`/`addressValue2`/`phoneLabel2`/`phoneValue2`, contenu placeholder (`"[Ville], Gambie"` / `"+220 7X XXX XX"`, même convention de X que le 1er numéro sénégalais), commentaire `TODO` juste au-dessus. Labels existants (`addressLabel`/`phoneLabel`) suffixés `"(Sénégal)"` pour rester cohérents une fois deux pays affichés côte à côte.
- `src/app/App.tsx` : 2 nouveaux blocs dans la colonne d'info de `#contact`, juste après le bloc téléphone Sénégal et avant l'email — même pattern visuel que les blocs existants, séparés par une bordure fine (`border-t border-gray-100`) pour marquer visuellement le changement de bureau. Email repoussé après les 2 blocs Gambie (partagé entre les deux bureaux, pas dupliqué).
- Corrigé au passage : `t.contact.form.errorNetwork` (fr/en) faisait encore référence à "contacter le serveur" — résidu de l'ancien backend Express, retiré le 2026-08-27 (suite précédente) au profit de web3forms. Reformulé en "impossible d'envoyer votre message" pour ne plus présupposer de serveur applicatif.

**Vérifié** : `npm run build` passe (typecheck i18n strict + vite build).

**Ouvert** : ville réelle du bureau gambien + les deux vrais numéros (Sénégal et Gambie) restent à fournir — voir `docs/AUDIT.md` §7. Reste inchangé par ailleurs : `VITE_WEB3FORMS_ACCESS_KEY` toujours vide, committer le travail en cours, nettoyer `dist/` du suivi git, témoignages placeholder, favicon, og:image, title/description, npm/pnpm, `figmaAssetResolver`, découpage d'`App.tsx`, pages légales.

---

## 2026-08-27 (suite) — Retrait du backend `server/`/Resend, bascule du formulaire de contact vers web3forms

**Contexte** : demande explicite de l'utilisateur — le backend Express dédié (`server/`, Resend) avait été prévu pour le formulaire de contact au cas où, mais il a changé d'avis en faveur de [web3forms](https://web3forms.com), un service qui ne nécessite aucun backend (le formulaire poste directement vers leur API depuis le navigateur, avec une clé publique restreignable par domaine).

**Fait** :
- `server/` (API Express, `resend`, ses propres `package.json`/`package-lock.json`/`Dockerfile`) supprimé entièrement.
- `docker-compose.yml` : service `api` retiré, `depends_on` retiré de `kumpax-landing` ; ajout de `build.args: VITE_WEB3FORMS_ACCESS_KEY` (docker compose résout cette variable depuis `.env` à la racine).
- `Dockerfile` : `ARG`/`ENV VITE_WEB3FORMS_ACCESS_KEY` ajoutés avant `npm run build` — nécessaire car Vite inline les vars `VITE_*` **au moment du build**, pas au runtime du conteneur (contrainte différente de l'ancien `RESEND_API_KEY`, qui était lue au runtime par `server/`).
- `docker/nginx.conf` et `vite.config.ts` : proxy `/api/` retiré (plus de backend à proxifier — en dev comme en prod, le navigateur appelle `https://api.web3forms.com/submit` en cross-origin directement).
- `src/app/App.tsx` : `handleSubmit` réécrit — `fetch` JSON direct vers `https://api.web3forms.com/submit` (`access_key` = `WEB3FORMS_ACCESS_KEY`, nouvelle constante module-level lisant `import.meta.env.VITE_WEB3FORMS_ACCESS_KEY`, plus `subject`/`from_name` calculés + les champs du formulaire), succès déterminé par `data.success`. Le honeypot (`website`) est resté le même champ/même JSX, mais la vérification ("si rempli, simuler un succès sans rien envoyer") est passée côté client en tout début de `handleSubmit`, faute de serveur pour la porter.
- `.env.example`/`.env` : `RESEND_API_KEY`/`RESEND_FROM`/`CONTACT_TO` remplacées par une seule variable, `VITE_WEB3FORMS_ACCESS_KEY` (vide localement — reste à fournir par l'utilisateur, voir `docs/AUDIT.md` §7).
- `README.md`, `CLAUDE.md`, `docs/AUDIT.md` mis à jour en profondeur pour refléter l'architecture 100% statique (plus de section "Backend", plus de service `api` dans la doc Docker, section "Formulaire de contact" réécrite).

**Vérifié** : `npm run build` passe (typecheck i18n + vite build). Bundle `dist/assets/*.js` grep-é : contient `api.web3forms`, plus aucune trace de `/api/contact`.

**Ouvert** : `VITE_WEB3FORMS_ACCESS_KEY` toujours vide — à créer un compte web3forms et renseigner la clé (avec un rebuild ensuite, la variable étant inlinée au build et non au runtime). Reste par ailleurs inchangé : committer le travail en cours (désormais encore plus volumineux avec ce retrait de `server/`), nettoyer `dist/` du suivi git, remplacer le contenu placeholder des témoignages, vrai numéro de téléphone, favicon, og:image, title/description, npm/pnpm, `figmaAssetResolver`, découpage d'`App.tsx`, pages légales.

---

## 2026-08-27 — Le 2e numéro fusionné hors session fait ressurgir le désalignement `contactIcons`/`contacts` (sens inverse)

**Contexte** : nouvelle demande de mettre à jour toute la documentation du projet, deux jours après la session du 2026-08-25. `git log` inchangé (toujours les 3 mêmes commits, rien de nouveau poussé), mais `git diff` sur `src/i18n/fr.ts`/`en.ts` a révélé une modification survenue hors session Claude Code entre le 2026-08-25 et aujourd'hui.

**Constat** : le tableau `contacts` du mock UI KumpaCard, qui comptait 4 éléments depuis le 2026-08-25 (email, tél. 1, tél. 2, site web — voir crash React #130 de cette date), est repassé à **3 éléments** : les deux numéros de téléphone ont été fusionnés dans un seul champ, `"+221 7X XXX XX XX / +220 7X XXX XX"`. Correction bienvenue sur le fond (le format du 2e numéro était incomplet/incohérent, signalé le 2026-08-25), mais elle a fait ressurgir le désalignement avec `contactIcons` (`App.tsx` ligne 383) — resté à 4 icônes (`[Mail, Phone, Phone, Globe]`) pour un tableau de nouveau à 3 éléments. Cette fois pas de crash (accéder à un index valide du tableau `contactIcons`, juste le 4e jamais atteint) mais un bug visuel silencieux : l'icône du contact "site web" (`kumpax.com`, dernier élément du tableau) affichait un téléphone (`contactIcons[2]`) au lieu d'un globe.

**Fait** :
- `src/app/App.tsx` ligne 383 : `contactIcons` recorrigé à `[Mail, Phone, Globe]` (3 icônes pour 3 contacts).
- `npm run build` puis `docker compose up -d --build` revérifiés — 2 conteneurs `healthy`.
- `CLAUDE.md` (points 2 et 6) et `docs/AUDIT.md` (§4.3, §7 — 2 lignes : nouvelle ligne ✅ Fait + mise à jour de la ligne 🔴 Haute sur le commit en attente) mis à jour pour refléter la chronologie complète des deux désalignements successifs (trop peu d'icônes le 2026-08-25, trop d'icônes le 2026-08-27).

**Leçon retenue** : `contactIcons[i]` indexé sur la longueur de `t.contacts` (i18n) est un couplage fragile — toute modification du nombre de contacts dans `fr.ts`/`en.ts` sans toucher `App.tsx` (ou l'inverse) casse le rendu ou l'icône affichée, dans un sens ou dans l'autre, et rien ne le signale à la compilation (`contactIcons[i]` hors limites vaut simplement `undefined` côté TypeScript non strict sur ce fichier). Pas de correctif structurel appliqué cette fois (changerait le pattern établi de `KumpaCardMockUI`) — signalé comme fragilité à surveiller si la liste de contacts est retouchée à nouveau.

**Ouvert** : le 2e numéro fusionné reste plus court que le 1er (un groupe de chiffres manquant, `+220 7X XXX XX` vs `+221 7X XXX XX XX`) — cosmétique, à corriger avec le vrai numéro. Reste par ailleurs inchangé : committer le travail en cours, nettoyer `dist/` du suivi git, remplacer le contenu placeholder des témoignages, RESEND_API_KEY, favicon, og:image, title/description, npm/pnpm, `figmaAssetResolver`, découpage d'`App.tsx`, pages légales.

---

## 2026-08-25 (suite 4) — Passe de cohérence sur toute la documentation

**Contexte** : demande explicite de mettre à jour toute la documentation du projet, après les 3 sessions du même jour (recalage git, correctif crash React #130, section Témoignages) dont les additions incrémentales avaient rendu `CLAUDE.md` §"Points d'attention immédiats" verbeux et `docs/AUDIT.md` légèrement en retard sur certains détails.

**Fait** :
- `docs/AUDIT.md` : résumé exécutif (§1) mis à jour pour mentionner la section Témoignages et le nouveau constat `dist/` ; taille d'`App.tsx` corrigée à sa valeur réelle (`wc -l` → 1667 lignes, arrondi ~1670 ; les mentions précédentes à ~1600/~1700/~1740 étaient des estimations jamais vérifiées) dans §3 et `CLAUDE.md` ; nouvelle §4.7 documentant le contenu placeholder de Témoignages ; §7 mise à jour (ligne git/i18n reformulée pour couvrir aussi `App.tsx`, nouvelle ligne sur `dist/` suivi par git).
- **Nouveau constat** : `dist/` (5 fichiers : `index.html`, `robots.txt`, `sitemap.xml`, `assets/*`) est toujours suivi par git alors que `.gitignore` l'exclut — commité lors d'une session antérieure à l'ajout de cette règle ; git ne désindexe pas rétroactivement, donc chaque `npm run build` local fait apparaître ces fichiers comme modifiés (noms hashés par Vite qui changent à chaque build). Documenté dans `CLAUDE.md` et `docs/AUDIT.md` §1/§7 — correctif proposé (`git rm -r --cached dist`) mais pas exécuté (action git non demandée explicitement).
- `CLAUDE.md` §"Points d'attention immédiats" point 6 réécrit (moins verbeux, renvoie vers `docs/HISTORIQUE.md` pour la chronologie complète plutôt que de la dupliquer) ; nouveau point 7 sur `dist/`.

**Ouvert** : inchangé par rapport aux 3 sessions précédentes du même jour — committer le travail en cours (App.tsx + i18n), corriger le format du 2e numéro de téléphone, nettoyer `dist/` du suivi git, remplacer le contenu placeholder des témoignages, RESEND_API_KEY, favicon, og:image, title/description, npm/pnpm, `figmaAssetResolver`, découpage d'`App.tsx`, pages légales.

---

## 2026-08-25 (suite 3) — Nouvelle section "Témoignages" (contenu placeholder)

**Contexte** : demande de prévoir une section témoignages clients. Question posée avant implémentation (`AskUserQuestion`, pas de contenu réel fourni) : contenu réel vs placeholder à compléter, et emplacement dans le flux de page. Réponses retenues : **contenu placeholder explicite (TODO)**, à remplacer par de vrais retours clients avant mise en production — décision prise pour éviter de fabriquer de faux témoignages attribués à des entreprises précises (aurait été un faux avis client, problématique même en interne) ; **emplacement entre "Impact" et "Contact"** (preuve sociale juste avant l'appel à l'action).

**Découverte en cours de route** : la description de `CLAUDE.md`/l'implémentation des bandeaux de couture (`SeamBanner`) mentionnait encore "5 bandeaux ... de 'Impact' vers 'Contact' (2 coutures)" — en réalité, la couture avant Contact a été retirée le 2026-08-19 (voir suite du même jour plus bas) et il n'en reste que 4 (`SEAM_STYLES[0..3]`, `t.seams` de longueur 4), déjà documenté correctement dans le commentaire au-dessus de `seams` dans `fr.ts`. Pas de couture à repositionner pour cette nouvelle section — insérée directement entre `</section id="impact">` et `<section id="contact">`, sans toucher aux coutures existantes.

**Fait** :
- `src/i18n/fr.ts`/`en.ts` : nouvelle clé `testimonials` (badge, title, intro, `items` — 3 témoignages placeholder avec `quote`/`author`/`role`/`company`, texte entre crochets type `[Nom de l'entreprise]` + commentaire `TODO` explicite juste au-dessus de la clé dans les deux fichiers), insérée entre `impact` et `contact` pour rester lisible dans le même ordre que le rendu.
- `src/app/App.tsx` : nouvelle section `id="temoignages"` (fond blanc, entre `#impact` et `#contact`) — header standard (badge + h2 + intro, même pattern que la section "Pour KumpaX") puis une grille de 3 cartes (`bg-card border border-border rounded-2xl`, `Reveal` avec cascade `delayMs={i*150}`) : icône `Quote` (import ajouté à la liste `lucide-react` existante), citation, puis un pied de carte avatar générique (icône `Users`, déjà importée — pas d'initiales dérivées d'un nom placeholder) + nom/fonction/entreprise. Aucun nouveau composant réutilisable créé — même pattern que les sections existantes.
- Pas d'entrée ajoutée à la nav (`nav.links`/`NAV_HREFS`) — non demandé, décision de portée non tranchée, à revoir si l'utilisateur veut un lien de nav dédié.

**Vérifié** : `npm run build` (typecheck i18n + vite build) passe. `docker compose up -d --build` : 2 conteneurs `healthy`, `curl http://localhost:8080/assets/*.js | grep "Ce que disent nos clients"` confirme le texte présent dans le bundle servi. Pas de vérification visuelle réelle possible (`browse`/gstack toujours bloqué par la politique de contrôle applicatif Windows sur cette machine, voir suite précédente).

**Ouvert** :
- Contenu placeholder de `testimonials.items` à remplacer par de vrais témoignages clients avant mise en production (ajouté à `docs/AUDIT.md` §7).
- Lien de nav dédié à la section (non ajouté, à trancher si besoin).
- CLAUDE.md à mettre à jour pour documenter la nouvelle section dans la structure du code (fait dans la foulée, voir diff de ce fichier).

---

## 2026-08-25 (suite 2) — Badge "50+ Entreprises" du hero désynchronisé de la stat "5+"

**Contexte** : capture d'écran fournie par l'utilisateur (`D:\img_dsc\nb_ese.png`, hors dépôt) montrant la bande de stats du hero à jour (`5+ Entreprises`, `4 Pays`, `5 Plateformes`, `99.9% Satisfaction`) mais une carte flottante à droite ("ENTREPRISES 50+") encore sur l'ancienne valeur.

**Cause** : cette carte n'est pas alimentée par `hero.stats[0].value` (déjà passé à `"5+"` lors des modifications non commitées de la session précédente) mais par une clé i18n distincte, `hero.map.companiesValue` (`src/i18n/{fr,en}.ts`), restée à `"50+"` — oubliée lors de ce même changement.

**Fait** : `hero.map.companiesValue` corrigé en `"5+"` dans `fr.ts` et `en.ts`. `npm run build` puis `docker compose up -d --build` relancés.

**Ouvert** : `hero.map.presenceValue` ("4 pays"/"4 countries") était déjà cohérent avec la stat "Pays"/"Countries", pas touché. Reste par ailleurs le format du 2e numéro de téléphone et le fait que `src/i18n/` (+ `App.tsx` `contactIcons`) reste non commité — voir suite précédente du même jour.

---

## 2026-08-25 (suite) — Bug bloquant : page blanche (React error #130) causée par les modifications non commitées

**Contexte** : suite de la session précédente (même jour) — l'utilisateur signale que `docker compose up -d --build` démarre bien les 2 conteneurs (`healthy`) mais que rien ne s'affiche dans le navigateur sur `http://localhost:8080`. Console navigateur : `Error: Minified React error #130` (type d'élément invalide — `undefined` passé à `createElement`).

**Cause identifiée** : exactement les modifications non commitées repérées dans la session précédente. `src/i18n/{fr,en}.ts` — tableau `contacts` du mock UI KumpaCard passé de 3 à 4 éléments (ajout d'un 2e numéro de téléphone `+220 7X XXX XX`), sans mise à jour de `contactIcons` dans `App.tsx` (`KumpaCardMockUI`, ligne 383), resté à 3 icônes (`[Mail, Phone, Globe]`). Au rendu, `contactIcons[3]` (le `.map()` sur `t.contacts`, ligne 406-407) vaut `undefined` → `<Icon .../>` avec un type de composant `undefined` → React error #130 → l'app entière échoue à se monter (`#root` reste vide, page blanche), sans error boundary pour isoler le composant fautif.

**Fait** : `src/app/App.tsx` ligne 383 — `contactIcons` complété à `[Mail, Phone, Phone, Globe]` (4 icônes pour les 4 contacts désormais affichés). `npm run build` revérifié (typecheck i18n + vite build, passe). `docker compose up -d --build` relancé — 2 conteneurs `healthy`, `curl http://localhost:8080/` → HTTP 200.

**Note méthodologique** : l'outil `browse` (gstack) n'a pas pu être utilisé pour vérifier le rendu réel dans un navigateur — `browse.exe` est bloqué par une politique de contrôle applicatif Windows sur cette machine (« An Application Control policy has blocked this file »), aussi bien en Bash (Git Bash, `Permission denied`) qu'en PowerShell. Le diagnostic a été fait par lecture de code (le pattern `array[i]` avec des tableaux de longueurs désormais différentes) une fois l'erreur React communiquée par l'utilisateur via la console navigateur — pas de vérification visuelle automatisée possible dans cette session.

**Ouvert** :
- Le format du 2e numéro de téléphone (`+220 7X XXX XX`, indicatif gambien, un groupe de chiffres manquant par rapport au 1er numéro, espace final superflu côté `en.ts` uniquement) reste à corriger ou clarifier avec l'utilisateur — non touché ici, le correctif de cette session porte uniquement sur le crash (voir aussi la session précédente du même jour et `docs/AUDIT.md` §7).
- Les modifications sur `src/i18n/` restent non commitées (avec, désormais, le correctif `App.tsx` en plus) — à committer une fois le format du 2e numéro validé.
- `browse`/gstack indisponible sur cette machine (politique de contrôle applicatif) — à garder en tête pour les prochaines sessions nécessitant une vérification visuelle réelle (screenshot, console navigateur) ; se rabattre sur une inspection manuelle du code + logs serveur, ou demander à l'utilisateur de rapporter la console.

---

## 2026-08-25 — Recalage de la doc (`CLAUDE.md`/`docs/`) sur l'état physique du code

**Contexte** : demande explicite de reprendre le contexte du projet par rapport au code physique et de remettre `CLAUDE.md`, l'historique et le suivi de session à jour dans `docs/` — session de relecture/audit, pas d'implémentation de fonctionnalité.

**Constats (relecture intégrale du dépôt)** :
1. **Dépôt git désormais initialisé**, ce que `CLAUDE.md` et `docs/AUDIT.md` (jusqu'à cette session) affirmaient encore absent. 3 commits (`Initial commit` et `landing-page : init and nice page`, tous deux du 2026-07-27 ; `kumpa hub : landing page valide` du 2026-08-19), remote `origin` → `https://github.com/Kumpax/landing-page.git`, branche `main` à jour avec `origin/main`. Cette initialisation a eu lieu hors session Claude Code documentée — aucune entrée de ce fichier ne la mentionne, origine non retraçable au-delà du premier commit.
2. **Modifications non commitées** détectées (`git status` : `src/i18n/en.ts`, `src/i18n/fr.ts`), non liées à cette session et d'origine inconnue : `nav.login` commenté (retrait du lien "Se connecter"/"Log in" de la nav sans suppression du code) ; stats du hero changées (`50+`→`5+` Entreprises, `5`→`4` Pays, `98%`→`99.9%` Satisfaction) ; un 2e numéro ajouté au tableau `contacts` du mock UI KumpaCard (`+220 7X XXX XX`, indicatif gambien) — format incomplet (un groupe de chiffres manquant par rapport au 1er numéro) et incohérent entre `fr.ts` et `en.ts` (espace final superflu côté `en.ts` uniquement). **Non corrigé dans cette session** (périmètre = documentation, pas le code) — laissé tel quel pour arbitrage utilisateur, documenté dans `CLAUDE.md` et `docs/AUDIT.md`.
3. **Décompte des `TODO` téléphone corrigé** : `CLAUDE.md` et `docs/AUDIT.md` §4.3 affirmaient 3 `TODO` explicites dans `App.tsx` (mock UI KumpaCard, section Contact, footer). Vérification par `grep` : seuls 2 existent réellement dans `App.tsx` (ligne ~1403 section Contact, ligne ~1604 footer) — le tableau `contacts` du mock UI KumpaCard est rendu par un `.map()` générique (ligne ~406) sur les données i18n, qui ne peut pas porter de `TODO` par élément.
4. Reste vérifié conforme à la doc existante : structure du code (`App.tsx`, `src/i18n/`, `server/`, Docker), `vite.config.ts` (`figmaAssetResolver` toujours présent, résidu inerte), `index.html` (`<title>`/description toujours résidus Figma Make, `og:image` toujours commenté), `package.json` (`pnpm-workspace.yaml` vs npm toujours incohérent), favicon toujours absent.

**Fait** : mise à jour de `CLAUDE.md` (statut git, section "Points d'attention immédiats" — retrait du point git résolu, correction du décompte `TODO` téléphone, ajout d'un point sur les modifications non commitées) et de `docs/AUDIT.md` (§1 résumé exécutif, §2 tableau stack, §4.3 coordonnées, §7 tableau de priorités — ligne git passée en ✅ Fait, nouvelle ligne 🔴 Haute sur les modifications non commitées). Aucun changement de code.

**Ouvert** :
- Arbitrer les modifications non commitées sur `src/i18n/` : corriger le format du 2e numéro de téléphone (ou le retirer) puis committer, ou `git restore src/i18n/en.ts src/i18n/fr.ts` si elles ne sont pas voulues.
- Reste de `docs/AUDIT.md` §7 inchangé par ailleurs (RESEND_API_KEY à renseigner, vrai numéro de téléphone, URLs réseaux sociaux, `og:image`, `<title>`/description, favicon, npm/pnpm, `figmaAssetResolver`, découpage d'`App.tsx`, pages légales).

---

## 2026-08-19 (suite) — Paragraphe de disponibilité dans la section Contact

**Contexte** : demande d'un paragraphe dans la section Contact précisant qu'on peut écrire à KumpaX de n'importe où, et que des interventions à distance ou des déplacements sont envisageables — formulé en langage B2B diplomatique (ne pas sur-promettre, cadrer "selon les besoins du projet").

**Fait** : nouvelle clé `t.contact.availabilityNote` (`fr.ts`/`en.ts`) ; paragraphe ajouté dans `App.tsx`, colonne gauche de la section Contact, juste après le bloc adresse/téléphone/email (séparé par une bordure fine), à côté du formulaire.

**Retour immédiat** : jugé trop discret à cet endroit (petit texte gris sous une bordure, après les coordonnées). Fusionné dans `t.contact.intro` à la place (une seule clé, `availabilityNote` supprimée) — le texte hérite ainsi de la taille normale de l'intro (`text-base md:text-lg`, pas `text-sm`) et de sa position bien visible, juste sous le H2 "Parlons de votre projet". Note en passant : l'édition manuelle faite entretemps sur `fr.ts` contenait une erreur de syntaxe (`<br>` littéral dans une chaîne TS, deuxième chaîne orpheline) — corrigée au passage en fusionnant proprement les deux phrases en un seul paragraphe.

**2e retour** : surligner cette phrase en turquoise. Reséparée en deux clés `t.contact.intro` (1re phrase) / `t.contact.introHighlight` (phrase sur la disponibilité), rendues dans le même `<p>` — la 2e est enveloppée dans un `<span className="bg-turquoise/25 rounded px-1 [box-decoration-break:clone] ...">`. Couleur de texte volontairement inchangée (gris, comme le reste du paragraphe) : seul un fond turquoise translucide est ajouté façon surligneur, pour rester lisible — le token `--turquoise` (#22D3EE) utilisé en couleur de texte pleine sur fond clair aurait un contraste trop faible pour du texte de paragraphe.

**Vérifié** : `npm run build` passe à chaque itération. `browse` (gstack) : rendu confirmé en FR, desktop 1440px — surlignage turquoise visible, continu sur les 4 lignes que la phrase occupe (`box-decoration-break: clone` empêche le fond de se couper bizarrement au retour à la ligne), texte toujours lisible.

**Ouvert** : rien de nouveau.

---

## 2026-08-19 (suite) — Système typographique réduit à 2 polices (Merienda + Inter)

**Contexte** : demande explicite — le wordmark "KumpaX" du header en Merienda (gras), et pour le reste du texte un contraste entre exactement 2 polices ("pas de 3 polices"), avec une bonne hiérarchie titres/sous-titres/paragraphes.

**Décision** : Merienda réservée aux plus gros titres (H1/H2) + au wordmark du header, toujours en gras — c'est la police "de marque", faite pour se remarquer. Inter pour absolument tout le reste (H3/H4, paragraphes, UI/boutons/nav/labels) — neutre, très lisible même en petit. Outfit, Fraunces et Lora (chargées mais de moins en moins utilisées au fil des sessions précédentes) sont retirées : elles auraient fait une 3e/4e police, contrairement à la demande.

**Fait** :
- `src/styles/fonts.css` : import Google Fonts réduit à `Merienda` + `Inter` (axe `wght` étendu à 100..900 sur Inter, normal + italique, pour couvrir tous les poids Tailwind utilisés — `font-medium` à `font-black` — qui pointaient auparavant vers Outfit).
- `src/styles/theme.css` : `--font-ui` repointée sur `"Inter"` (au lieu d'Outfit) ; `--font-accent`/`--font-signature` (Fraunces/Lora) supprimées, plus référencées nulle part dans le code. `h3`/`h4` basculés de `--font-title` vers `--font-ui` (Inter) — seuls h1/h2 restent en Merienda, pour un vrai contraste titres/sous-titres plutôt qu'une police de marque appliquée uniformément à 4 niveaux.
- `src/app/App.tsx` : composant `Logo` — le span "KumpaX" passe de `var(--font-ui)` à `var(--font-title)` (déjà en `font-black`/900, donc déjà gras).
- `guidelines/Guidelines.md` §4, `ATTRIBUTIONS.md` : mis à jour pour documenter le système à 2 polices (au lieu de 5 rôles).

**Vérifié en conditions réelles** : `npm run build` sans erreur. `npm run dev` + `browse` (gstack) : logo "KumpaX" et H1 du hero en Merienda gras confirmés visuellement (desktop 1440px et mobile 390px) ; H2 "Pour KumpaX" en Merienda avec ses 3 cartes H3 ("Expertise technologique" etc.) bien en Inter en dessous — contraste titres/sous-titres net et lisible aux deux tailles testées.

**Ouvert** : rien de nouveau — reste de `docs/AUDIT.md` §7 inchangé.

---

## 2026-08-19 — Bandeaux obliques : retrait de la couture avant Contact, couture Odoo collée à la section

**Contexte** : deux retours utilisateur sur les coutures posées la veille (suite 10 de 2026-08-18).

**Fait** :
1. **Couture avant Contact retirée** — jugée superflue (`SEAM_STYLES[4]` supprimé, 5e entrée de `t.seams` retirée dans `fr.ts`/`en.ts`, classe CSS `.seam-5-marquee-track` retirée de `tailwind.css`, appel `<SeamBanner>` retiré d'`App.tsx`). La section Contact est revenue à son état d'avant les coutures (transition simple, sans bandeau).
2. **Couture avant "Intégration Odoo" collée à la section** — l'utilisateur a remarqué un écart visible entre le bas du bandeau et le début de la section Odoo (capture `D:\img_dsc\last_bann.png` en référence). Cause n°1 : le conteneur du bandeau (`SeamBanner`) a une hauteur fixe de 134px alors que le ruban + son feuillet d'écho n'occupent que les ~96 premiers pixels, laissant 38px de vide en bas avant la section suivante. Ajout d'une prop `heightPx` optionnelle à `SeamBanner` (134 par défaut), utilisée à 96 uniquement pour cette couture — corrige ce cas précis sans toucher à l'espace au-dessus du bandeau (l'utilisateur a explicitement dit qu'il était suffisant) ni aux 3 autres coutures.
   - **Persistant après ce premier correctif** : l'utilisateur signale toujours un léger espace. Vérification au pixel près (`getBoundingClientRect`) : l'écart de mise en page entre le conteneur et la section suivante est exactement 0px. Le résidu visible vient d'ailleurs — un ruban **incliné** ne touche pas le bas de son conteneur de façon uniforme sur toute sa largeur (une extrémité remonte, l'autre descend, d'environ ±largeur/2 × sin(angle) — jusqu'à ~40px de plus à 1920px de large pour 1,8°). Corrigé en ajoutant une prop `glueBottomColor` à `SeamBanner` : un rectangle plein (non incliné) de la couleur de la section suivante, peint en dessous du ruban/écho, qui comble tout écart résiduel quelle que soit la largeur d'écran — utilisée uniquement sur cette couture avec `#080C1E` (couleur de fond de la section Odoo).

**Vérifié** : `npm run build` passe à chaque itération. `browse` (gstack) : écart de 0px confirmé via `getBoundingClientRect` avant le 2e correctif ; après le 2e correctif, transition testée sans aucun liseré visible à 1920px (cas le plus défavorable) et à 390px (mobile) ; section Contact revérifiée sans bandeau.

**Ouvert** : inchangé depuis la suite 10 (sort de "Domaines d'expertise"/"Impact", qui restent sans couture dédiée).

---

## 2026-08-18 (suite 10) — Bandeaux obliques typographiques entre les segments (implémentation réelle)

**Contexte** : suite des sessions "KumpaX Separations" (canvas de design, suites précédentes) — l'utilisateur a partagé un fichier de référence externe (`D:\img_dsc\KumpaX Solutions v3.dc.html`, hors dépôt) réalisant déjà la piste "bandeau oblique typographique" avec du vrai contenu (pas des squelettes) et une géométrie de ruban correcte (contrairement à ma première tentative). Après une itération sur la maquette pour ajouter un effet "3D" (second feuillet empilé derrière chaque ruban, validé par capture d'écran), l'utilisateur a demandé l'implémentation réelle sur `App.tsx`.

**Décision de portée non explicitement tranchée par l'utilisateur, prise ici** : le brief ("01→04 puis Prestations et Contact, 5 coutures") ne mentionne pas les sections "Domaines d'expertise" et "Impact / chiffres clés", qui existent pourtant entre Solutions→Prestations et Prestations→Contact dans le site réel. Plutôt que de casser l'invariant "le bandeau annonce le segment qui suit vraiment" (ce qui aurait été le cas en plaçant une couture directement après KumpaCard en annonçant "Prestations" alors que "Domaines d'expertise" suit en réalité), les 2 coutures de fin ont été repositionnées : couture 4 entre "Domaines d'expertise" et "Prestations" (Odoo), couture 5 entre "Impact" et "Contact". "Domaines d'expertise" et "Impact" n'ont pas de couture dédiée (non demandé) et gardent leur transition actuelle inchangée. À revoir si l'utilisateur voulait autre chose (ex. supprimer/fusionner ces 2 sections).

**Fait** :
- `src/app/App.tsx` : nouveau composant `SeamBanner` (bandeau oblique + feuillet d'écho 3D + marquee) et constante `SEAM_STYLES` (angle/fond/couleurs par couture, langue-agnostique). Import de `Fragment` ajouté (nécessaire pour retourner un couple `<div produit> + <SeamBanner>` depuis `products.map` avec une seule clé). 5 instances posées : 3 à l'intérieur de la boucle `products.map` (entre Store/VisitApp/MaxImmo/KumpaCard), 2 entre sections (`</section id="expertise">` → couture 4 → `<section id="services">`, et `</section id="impact">` → couture 5 → `<section id="contact">`).
- `src/i18n/fr.ts`/`en.ts` : nouvelle clé `seams` (tableau de 5 `{ keywords: string[] }`, 3 mots-clés par couture) — texte affiché par le marquee, traduit comme le reste du site.
- `src/styles/tailwind.css` : classes `.seam-marquee-track` + `.seam-1-marquee-track` à `.seam-5-marquee-track` (durée fixe par couture en CSS plutôt qu'une custom property inline — une inline aurait une spécificité plus forte que la media query mobile et l'empêcherait de s'appliquer), media query `max-width:767px` qui uniformise toutes les coutures à 120s (bande plus courte en mobile, même vitesse de défilement → boucle plus rapide), et ajout au bloc `prefers-reduced-motion: reduce` existant (`.seam-marquee-track{animation:none}`, `.seam-marquee-duplicate{display:none}` — contrairement au marquee de logos existant, pas de `flex-wrap` en repli : un bandeau oblique de hauteur fixe ne peut pas accueillir du texte multi-ligne sans casser la mise en page).

**Vérifié en conditions réelles** : `npm run build` (typecheck i18n + vite build) passe. `npm run dev` + `browse` (gstack) : les 5 coutures inspectées individuellement en zoom (1440px) — géométrie propre, feuillet d'écho visible, texte/diamants corrects, chaque couture annonce bien la section qui suit immédiatement dans le DOM. Testé à 390px (mobile) : pas d'artefact de coin (la marge géométrique validée sur la maquette est encore plus confortable à largeur réduite). `animationDuration` calculé confirmé à `120s` sous 767px via `getComputedStyle`. Règles `prefers-reduced-motion` confirmées présentes dans le CSS de prod buildé (`grep` sur `dist/assets/*.css`). Bascule FR→EN vérifiée sur une couture (texte traduit affiché correctement). Serveur dev arrêté après vérification.

**Ouvert** : le sort de "Domaines d'expertise" et "Impact" (voir décision de portée ci-dessus) — actuellement inchangés, sans couture. Reste de `docs/AUDIT.md` §7 inchangé (git init, téléphone/liens sociaux placeholder, `og:image`, title/description résidus Figma Make, favicon absent).

---

## 2026-08-18 (suite 9) — Internationalisation FR/EN (provider maison typé)

**Contexte** : demande explicite avec spec précise — provider maison typé (`fr.ts` source de vérité, `en.ts: typeof fr` pour qu'une clé manquante casse le build), migration de toutes les chaînes hors `App.tsx`, sélecteur segmenté FR|EN dans le header, persistance + hreflang, critères d'acceptation. Question posée avant implémentation sur la seule zone non tranchée par la spec : la stratégie d'URL pour `hreflang` (le site n'a pas de routeur). Réponse retenue : **toggle client simple, hreflang minimal** (pas de nouvelle URL par langue — voir plus bas).

**Fait** :
- `src/i18n/fr.ts` : source de vérité, ~300 clés couvrant tout le texte visible d'`App.tsx` (nav, hero + carte Afrique, section confiance, timeline "Notre approche", 4 produits + leurs mock UI (contenu de démo inclus — tables, statuts, noms d'exemple), domaines d'expertise, section Odoo, chiffres clés, formulaire de contact + succès/erreurs, footer, aria-labels, sélecteur de langue).
- `src/i18n/en.ts` : traduction complète, typée `const en: typeof fr = {...}`. Les identifiants internes non traduisibles (ex. `status: "paid"/"pending"/"late"` utilisés pour choisir la couleur du badge MaxImmo) restent identiques dans les deux fichiers ; seul le texte affiché (`statusLabels`) change.
- `tsconfig.i18n.json` (nouveau, racine) : type-check strict scopé à `src/i18n/fr.ts`+`en.ts` uniquement — **décision volontaire** de ne pas étendre le type-checking au reste de l'app (jamais type-checkée, aucun `@types/react` installé) pour ne pas risquer de casser le build sur des erreurs de types préexistantes et sans rapport avec l'i18n.
- `package.json` : nouveau script `typecheck:i18n` (`tsc -p tsconfig.i18n.json`), `build` devient `npm run typecheck:i18n && vite build` — une clé manquante dans `en.ts` fait donc échouer `npm run build` avec un code de sortie non nul. `typescript` ajouté en devDependency (absente du projet jusqu'ici).
- `src/i18n/LocaleProvider.tsx` : contexte React (`useLocale()` → `{ locale, setLocale, t }`), monté dans `src/main.tsx` autour d'`<App />`. Persistance dans `localStorage` (clé `kumpax-locale`, défaut `"fr"`), synchronise `document.documentElement.lang` à chaque changement.
- `src/app/App.tsx` : réécriture complète pour consommer `t` au lieu de littéraux — plus aucune chaîne française en dur (vérifié par grep, y compris dans les 4 composants mock UI qui reçoivent désormais leur tranche de traduction en prop). Les tableaux de données (`PRODUCTS_BASE`, `TRUST_ICONS`, `DOMAIN_ICONS`, `IMPACT_ICONS_VALUES`, `ODOO_SERVICE_ICONS`, `ODOO_MODULE_ICONS`) ne gardent que l'icône/couleur/id/nombre (langue-agnostique), fusionnés avec le texte traduit par index ou par id au rendu. Nouveau composant `LangSwitch` (sélecteur segmenté, dupliqué nav desktop + menu mobile).
- `index.html` : `<html lang="en">` (résidu Figma Make) corrigé en `lang="fr"` (valeur par défaut avant hydratation ; mise à jour dynamique ensuite par `LocaleProvider`). `<link rel="alternate" hreflang="x-default">` ajouté, avec commentaire expliquant pourquoi pas de `hreflang="fr"`/`"en"` distincts (pas de routeur, une seule URL pour les deux langues — des hreflang pointant vers la même URL seraient ignorés par les moteurs de recherche).

**Vérifié en conditions réelles** :
- `npm run typecheck:i18n` seul : passe sans erreur.
- Test de non-régression positif : suppression volontaire de `nav.contact` dans `en.ts` → `npm run typecheck:i18n` échoue avec `TS2741: Property 'contact' is missing...` ; `npm run build` complet hérite de l'échec (code de sortie 2). Clé restaurée, `npm run build` repasse au vert.
- `npm run build` (état nominal) : passe, bundle généré sans erreur.
- `npm run dev` + `browse` (gstack) : page FR par défaut (`<html lang="fr">`), clic sur "EN" → toute la page bascule (nav, hero, carte Afrique avec villes traduites, un produit avec son mock UI VisitApp entièrement traduit, formulaire de contact avec placeholders traduits, footer) sans rechargement ; `<html lang>` passe à `"en"` et `localStorage.kumpax-locale` à `"en"` ; **persistance confirmée** après `reload()` (repart bien en EN). Menu mobile (390×844) : sélecteur FR|EN présent et fonctionnel au même endroit que sur desktop. Aucune erreur console à aucune étape.

**Doc** : `CLAUDE.md` (stack + nouvelle section structure décrivant `src/i18n/`), `docs/AUDIT.md` (ligne TypeScript du §2 mise à jour).

**Critères d'acceptation** (pour référence future / validation) :
1. `npm run build` échoue (code non nul) si `en.ts` n'a pas exactement les mêmes clés que `fr.ts` (testé, voir ci-dessus).
2. Aucune chaîne de texte visible codée en dur en français ou anglais ne subsiste dans `App.tsx` (vérifié par grep sur les caractères accentués + mots français courants).
3. Le sélecteur FR|EN est visible et cliquable dans le header, en version desktop et en menu mobile.
4. Changer de langue met à jour l'intégralité du texte visible sur la page (nav, hero, les 4 sections produits et leurs mock UI, footer, formulaire) sans rechargement de page.
5. Le choix de langue survit à un rafraîchissement de page (`localStorage`).
6. `document.documentElement.lang` reflète toujours la langue active.
7. `index.html` porte un tag `hreflang` cohérent avec l'absence de routage par langue (x-default uniquement — pas de `hreflang` mensonger pointant deux langues vers la même URL).

**Ouvert** :
- Le reste de l'app (`App.tsx`, `main.tsx`, etc.) n'est toujours pas type-checké — décision volontaire pour ce chantier, mais un futur passage à un vrai `tsconfig.json` app-wide (+ `@types/react`/`@types/react-dom`) reste une amélioration possible, hors périmètre ici.
- Si une vraie stratégie SEO multilingue est souhaitée plus tard (indexation Google séparée par langue), il faudra revisiter le choix "toggle simple" retenu ici — cela demande un routeur (path-based `/en` recommandé) et une regénération de `hreflang` avec de vraies URLs distinctes, chantier plus lourd explicitement écarté cette fois.
- Reste de `docs/AUDIT.md` §7 inchangé (git init, téléphone/liens sociaux placeholder, `og:image`, title/description résidus Figma Make, favicon absent).

---

## 2026-08-18 (suite 8) — Police de titre : essai Merienda à la place de Winky Sans

**Contexte** : demande explicite de l'utilisateur d'essayer [Merienda](https://fonts.google.com/specimen/Merienda) (Google Fonts, variable, manuscrite/arrondie) comme police de titre à la place de Winky Sans (mise en place à la suite 6). Portée identique déjà tranchée à la suite 6 (rôle `--font-title`, tous les H1-H4) — pas de nouvelle question de portée, simple substitution de la famille de police sur l'infrastructure déjà en place.

**Fait** :
- `src/styles/fonts.css` : import Google Fonts remplacé (`Winky+Sans` → `Merienda:wght@300..900` ; Merienda n'a pas d'axe italique contrairement à Winky Sans, axe retiré en conséquence). Commentaire d'en-tête mis à jour.
- `src/styles/theme.css` : `--font-title` pointe désormais vers `"Merienda", ui-serif, Georgia, serif` (pile de repli changée de sans-serif à serif — Merienda est une police à empattements/manuscrite, pas géométrique comme l'était Winky Sans). Les graisses par niveau (H1 800 / H2 700 / H3 600 / H4 500) inchangées, Merienda étant elle aussi un variable font sur le même axe `wght`.
- `guidelines/Guidelines.md` §4 et `ATTRIBUTIONS.md` : références à "Winky Sans" remplacées par "Merienda".

**Vérifié en conditions réelles** : `npm run build` sans erreur. `npm run dev` + `browse` (gstack, viewport 1440×900) : `getComputedStyle(h1).fontFamily` confirme `"Merienda, ui-serif, Georgia, serif"` ; screenshots du hero (H1) et de la section "Pour KumpaX" (H2 + cartes H3) confirmant le rendu manuscrit/arrondi caractéristique de Merienda sur les trois niveaux.

**Ouvert** : choix final entre Winky Sans et Merienda (ou une autre piste) toujours à l'appréciation de l'utilisateur — considérer ceci comme un essai, pas une décision figée.

---

## 2026-08-18 (suite 7) — Agrandissement des textes courants (paragraphes) sur desktop

**Contexte** : retour utilisateur que le texte "simple" (paragraphes hors titres) paraissait petit sur ordinateur.

**Fait** — dans `src/app/App.tsx`, ajout d'une graisse/taille responsive (`md:`/`lg:` selon le cas) sur les paragraphes de corps de texte, sans toucher aux titres, badges, boutons ni labels :
- Paragraphes d'intro de section (sous-texte hero, intros "Pour KumpaX"/"Notre approche"/"Solutions"/"Domaines d'expertise"/Odoo/Contact) : `text-base` → `text-base md:text-lg` (16px → 18px à partir de 768px).
- Description de chaque produit (section Solutions) et items de la liste de fonctionnalités associée : `text-base`/`text-sm` → `+ md:text-lg`/`+ md:text-base`.
- Textes secondaires en carte (taglines "Pour KumpaX", descriptions timeline "Notre approche", descriptions "Domaines d'expertise") : `text-sm` → `text-sm md:text-base`.
- Description de la timeline "Notre approche" en version desktop horizontale (`lg:block`), qui était en `text-xs` (12px, trop petit) : → `text-xs lg:text-sm`.

Mobile inchangé (les breakpoints `md`/`lg` ne s'appliquent qu'à partir de 768px/1024px) — seul l'affichage desktop est concerné, conformément à la demande.

**Vérifié** : `npm run build` sans erreur ; rendu vérifié visuellement via `browse` (gstack) en viewport 1440×900 sur le hero et la section Solutions — texte nettement plus lisible, aucun débordement ni régression de mise en page (listes de fonctionnalités, cartes produit, mockups UI à droite du texte restent alignés).

**Ouvert** : le reste des textes très secondaires (badges, footer, mentions légales, infos de contact `text-sm`) volontairement laissé inchangé — périmètre limité au texte de lecture principal. À revoir si l'utilisateur juge que d'autres zones restent trop petites.

---

## 2026-08-18 (suite 6) — Police de titre remplacée par Winky Sans (H1 à H4)

**Contexte** : demande explicite de l'utilisateur d'utiliser [Winky Sans](https://fonts.google.com/specimen/Winky+Sans) (Google Fonts, variable) comme police des titres, "et ses différentes déclinaisons". Question posée avant modification pour clarifier la portée (`AskUserQuestion`) : H1/H2 uniquement (remplaçant Fraunces, rôle `--font-accent`) ou tous les titres H1-H4 (remplaçant aussi Outfit sur H3/H4). L'utilisateur a choisi la portée large.

**Fait** :
- `src/styles/fonts.css` : ajout de l'import Google Fonts pour Winky Sans, variable complet (`ital,wght@0,300..900;1,300..900`), à côté des imports existants (Outfit, Inter, Fraunces, Lora — tous conservés).
- `src/styles/theme.css` : nouvelle variable `--font-title: "Winky Sans", ...` (déclarée dans `:root` et réexposée dans `@theme inline`, même schéma que les autres rôles). Les règles `h1`/`h2`/`h3`/`h4` de `@layer base` pointent désormais toutes vers `--font-title`, avec une graisse différente par niveau comme déclinaison du variable font (H1 800, H2 700, H3 600, H4 500) — ces graisses ne s'appliquent que là où `App.tsx` n'impose pas déjà une classe Tailwind `font-bold`/`font-semibold` explicite (la plupart des titres du fichier en ont une, qui prime naturellement sur la règle de base ; vérifié que cela reste cohérent visuellement, cf. section Vérifié).
- `--font-accent` (Fraunces) et `--font-ui` (Outfit) restent définis mais ne sont plus utilisés par les H1-H4 : Fraunces reste disponible pour un usage ponctuel hors titres (citations courtes, comme documenté dans Guidelines.md), Outfit reste la police UI (nav, boutons, labels, badges).
- `guidelines/Guidelines.md` §4 (Typographie) : passé de 4 à 5 rôles de police documentés, rôle `--font-title` ajouté en tête, description de `--font-accent` recentrée sur son usage résiduel (citations, plus les titres).
- `ATTRIBUTIONS.md` : liste des polices Google Fonts mise à jour (Winky Sans ajoutée ; Fraunces et Lora, absentes de la liste depuis leur introduction, ajoutées au passage — écart préexistant, non lié à ce changement, corrigé ici).

**Vérifié en conditions réelles** : `npm run dev` lancé en local (port 5183), page ouverte via `browse` (gstack) — screenshots du hero (H1) et de la section "Pour KumpaX" (H2) confirmant le rendu Winky Sans (lettrage rond et distinctif, net contraste avec Outfit sur la nav). Vérification JS complémentaire (`getComputedStyle`) sur H1/H2/H3 : les trois retournent bien `"Winky Sans", ui-sans-serif, system-ui, sans-serif` comme `font-family` calculée. Serveur dev arrêté après vérification.

**Ouvert** : rien de nouveau côté formulaire/déploiement (inchangé depuis la suite 5). Reste de `docs/AUDIT.md` §7 inchangé (git init, téléphone/liens sociaux placeholder, `og:image`, title/description résidus Figma Make, favicon absent).

---

## 2026-08-18 (suite 5) — Formulaire de contact branché à Resend via une nouvelle API dédiée

**Contexte** : demande explicite de brancher le formulaire de contact à un vrai service d'envoi (point 🔴 le plus urgent de `docs/AUDIT.md` §7 depuis le tout premier audit). Le projet n'ayant pas de backend, plusieurs options client-only ont été proposées (Web3Forms, Formspree, EmailJS) ; l'utilisateur a choisi **Resend**, avec le compte à créer plus tard de son côté — la demande explicite était de "prévoir déjà le nécessaire" pour qu'il ne reste plus qu'à brancher la clé.

**Contrainte identifiée avant d'écrire du code** : Resend exige une clé API secrète côté serveur — l'appeler directement depuis le navigateur exposerait cette clé dans le bundle JS public (n'importe qui pourrait alors envoyer des emails depuis le compte Resend de l'utilisateur). Un simple `fetch` client-side, comme pour Web3Forms/Formspree, n'était donc pas une option pour Resend : il fallait un minimum de backend, ce que le projet n'avait jamais eu jusqu'ici (déploiement 100% statique nginx).

**Fait — nouveau dossier `server/`, projet npm séparé et isolé du front** :
- `server/index.js` : API Express minimale, un seul endpoint utile `POST /api/contact` (+ `GET /health` pour le healthcheck Docker). Validation serveur (nom/email/message obligatoires, regex email, longueurs max par champ), honeypot anti-spam (`website`, silencieusement ignoré s'il est rempli — réponse succès sans envoi, pour ne pas signaler au bot qu'il a été détecté), rate limiting en mémoire (5 requêtes/IP/10 min, `Map` simple — volume attendu trop faible pour justifier Redis). Envoi via le SDK officiel `resend`, avec `replyTo` = l'email du visiteur (répondre au mail reçu répond directement au lead) et `RESEND_FROM`/`CONTACT_TO` configurables par env var (défaut : adresse sandbox Resend qui fonctionne sans domaine vérifié, et `contact@kumpax.com`).
- `server/package.json` (dépendances : `express`, `resend`, lockfile généré), `server/Dockerfile` (image `node:24-alpine`, `npm ci --omit=dev`), `server/.dockerignore`.

**Fait — plomberie réseau, pour que le navigateur n'appelle jamais directement le port de l'API** :
- `docker-compose.yml` : nouveau service `api` (build `./server`, jamais de port publié sur l'hôte, `env_file: .env`), `kumpax-landing` en dépend (`depends_on`).
- `docker/nginx.conf` : nouvelle `location /api/` qui proxifie vers `http://api:3001/api/` (réseau interne docker compose) avec les en-têtes `X-Forwarded-*` habituels — le navigateur ne voit qu'une requête même origine, aucun CORS à gérer côté API.
- `vite.config.ts` : proxy dev `/api` → `http://localhost:3001`, même chemin qu'en prod, pour que `npm run dev` fonctionne à l'identique en pointant vers une API lancée localement (`node server/index.js`).
- `.env.example` (racine) documente `RESEND_API_KEY`/`RESEND_FROM`/`CONTACT_TO` ; `.gitignore` créé (le projet n'a pas encore de dépôt git, mais autant l'anticiper maintenant qu'un secret existe) et `.dockerignore` déjà à jour excluent `.env`.

**Fait — `src/app/App.tsx`** :
- `handleSubmit` devient async : `POST /api/contact` en JSON, gère 3 états explicites (`sending` → bouton en spinner `Loader2` + texte "Envoi en cours…" au lieu de "Envoyer le message" ; `submitError` → bannière rouge `role="alert"` au-dessus des champs si l'API répond une erreur ou est injoignable ; succès → écran de remerciement existant, inchangé). Plus aucun faux "Message envoyé !" silencieux comme avant.
- Champ honeypot `website` ajouté à l'état du formulaire et au JSX (input positionné hors écran, `tabIndex={-1}`, `aria-hidden`, jamais `display:none` pour rester "visible" aux bots qui l'ignoreraient sinon).
- `src/styles/tailwind.css` : `.animate-spin` (spinner du bouton) ajouté au bloc `prefers-reduced-motion` existant — même raison que `.map-connection`/`.map-ping` déjà présents (une boucle infinie accélérée à 0.01ms par le garde-fou global clignoterait au lieu d'être figée, leçon déjà tirée à la suite 11 du 2026-07-27).

**Vérifié en conditions réelles** :
- `node server/index.js` en local : `/health` → `{"status":"ok"}` ; `/api/contact` avec champs manquants/email invalide → 400 avec message clair ; honeypot rempli → 200 sans tentative d'envoi (log serveur confirmé) ; sans `RESEND_API_KEY` → 500 explicite (pas de crash au démarrage, message de log clair).
- `npm run build` (front) passe sans erreur après les changements `App.tsx`/`tailwind.css`.
- **Stack Docker complète** : `cp .env.example .env` (clé vide, valeurs par défaut) puis `docker compose up -d --build` → les 2 conteneurs (`api`, `kumpax-landing`) démarrent et passent `healthy` ; `curl http://localhost:8080/` → 200 ; `curl -X POST http://localhost:8080/api/contact` (via nginx, pas directement sur le port de l'API) → même réponse 500 "service non configuré" que le test direct, confirmant que le proxy `/api/` fonctionne bout en bout. Stack arrêtée (`docker compose down`) une fois la vérification faite, `.env` local laissé en place (valeurs vides, prêt à être complété).

**Doc** : `CLAUDE.md` (nouvelle section "Formulaire de contact", stack/déploiement/points d'attention mis à jour), `docs/AUDIT.md` (§1, §2, §3, §4.1, §6, §7 mis à jour — le point 🔴 le plus ancien de l'audit passe de "Ouvert" à "Résolu (plomberie)", remplacé par un nouveau point 🔴 plus précis : fournir la clé), `README.md` (instructions dev/déploiement pour les 2 services).

**Ouvert** : `RESEND_API_KEY` à fournir par l'utilisateur une fois le compte Resend créé (`.env`, jamais commis) ; `RESEND_FROM` à faire pointer vers un domaine `kumpax.com` vérifié avant une vraie mise en production (l'adresse sandbox actuelle suffit pour tester) ; reste de `docs/AUDIT.md` §7 inchangé (git init, téléphone/liens sociaux réels, `og:image`, title/description, favicon).

---

## 2026-08-18 (suite 4) — Nouvelle passe de vérification : doc toujours conforme, un résidu corrigé

**Contexte** : demande explicite de mettre à jour toute la documentation.

**Méthode** : re-vérification point par point de tout ce qu'affirment `CLAUDE.md`, `docs/AUDIT.md`, `README.md`, `ATTRIBUTIONS.md` contre l'état physique réel (pas de confiance aveugle dans la doc) : `ls` racine/`docker/`/`public/`, contenu de `index.html` (title/meta/OG/favicon), `grep TODO` sur `App.tsx` (6 occurrences), nombre de lignes d'`App.tsx` (1592), `vite.config.ts` (`figmaAssetResolver` toujours présent), `package-lock.json`/`docker/nginx.conf` toujours présents, `git status` (toujours aucun dépôt), `docker ps` (aucun conteneur `kumpax-landing`/`landingpage-*` actif).

**Résultat : aucun écart entre la doc et le code physique.** Tout ce que `CLAUDE.md`/`docs/AUDIT.md`/`README.md`/`ATTRIBUTIONS.md` affirment reste exact — la passe d'alignement de la suite 3 (même jour) est bien celle qui a résorbé les derniers écarts.

**Un résidu corrigé, hors périmètre `docs/`** : le commentaire au-dessus de la règle `h1`/`h2` dans `src/styles/theme.css` (`@layer base`) citait encore la police **"Moren"** comme accent de marque — décision abandonnée avant même la suite 3 (voir `Guidelines.md` §4, note historique : Moren écartée pour licence "Free For Personal Use" non commerciale, remplacée par **Fraunces**). Le code fonctionnel était déjà correct (`var(--font-accent)` → Fraunces, jamais Moren), seul le commentaire mentait sur la police réellement utilisée. Corrigé en "Fraunces". `npm run build` revérifié après coup (aucune régression, changement de commentaire uniquement).

**Non modifié** : `CLAUDE.md`, `docs/AUDIT.md`, `README.md`, `ATTRIBUTIONS.md` — tous déjà exacts, aucune ligne à corriger.

**Ouvert** : inchangé — voir `docs/AUDIT.md` §7 (formulaire de contact non fonctionnel toujours le point le plus urgent ; téléphone et 3 liens sociaux toujours en placeholder ; `og:image`/`twitter:image`, `<title>`/description résidus Figma Make, favicon absent, pas de dépôt git ; divergence Guidelines.md "hub + filiales" vs implémentation page unique toujours non tranchée).

---

## 2026-08-18 (suite 3) — Alignement d'`App.tsx` sur le design system (theme.css / fonts.css / Guidelines.md)

**Contexte** : demande explicite de vérifier que le design system du hub KumpaX (tokens couleur/police dans `theme.css`/`fonts.css`, règles dans `guidelines/Guidelines.md`) est bien respecté dans `App.tsx` et le reste de `src/`, et de corriger les oublis (polices, radius, couleurs, états interactifs) sans toucher aux valeurs des tokens eux-mêmes.

**Méthode** : lecture intégrale de `theme.css` (4 rôles de police `--font-ui`/`--font-body`/`--font-accent`/`--font-signature`, 9 tokens de couleur, `--radius-sm/md/lg/xl`, règles `@layer base` qui assignent déjà h1/h2→`--font-accent`, h3/h4/label/button→`--font-ui`, body/input→`--font-body`) et de `Guidelines.md` (§3 couleurs, §4 typographie, §5 radius, §6 composants/états). Puis recherche systématique (`grep`) dans `App.tsx` de tout `fontFamily` codé en dur, tout hex dupliquant un token, et tout `rounded-none`/bouton sans état focus/actif.

**Écarts trouvés et corrigés dans `src/app/App.tsx`** :
- **Tous les h1/h2 du fichier (8 titres) étaient forcés en Outfit par un `style={{ fontFamily: "'Outfit', sans-serif" }}` codé en dur**, qui écrasait la règle `@layer base` de `theme.css` assignant `--font-accent` (Fraunces) aux h1/h2 — contradiction directe avec Guidelines.md §4 ("h1/h2 portent l'accent élégant Fraunces"). Supprimé sur les 8 titres (Hero, "Pour KumpaX", "Notre approche", "Solutions", "Domaines d'expertise", "Intégration Odoo", "Notre impact en chiffres", "Parlons de votre projet") — la règle de base s'applique désormais, plus aucune police codée en dur sur un titre.
- **5 h3 avaient le même style inline Outfit** — strictement redondant avec la règle `@layer base` (h3 = `--font-ui` = Outfit déjà), supprimé par cohérence/nettoyage, aucun changement visuel.
- **~35 couleurs dupliquant exactement un token existant, codées en hex, dans les zones structurelles réelles** (navbar, hero, en-têtes de section, cartes produits, formulaire de contact, footer) — `#1234B0`→`primary`, `#080C1E`→`foreground`, `#F7F8FC`→`background`, `#EEF1FF`→`secondary`, remplacées par les classes Tailwind (`bg-primary`, `text-foreground`, etc.) déjà générées par le bloc `@theme inline` de `theme.css`. Certaines sections (Pour KumpaX, Notre approche, Domaines d'expertise, Impact) utilisaient déjà correctement ces classes — la dérive ne touchait que Hero, Solutions/Produits, une partie d'Odoo/Services, et Contact, désormais alignés sur le même système.
- **Les hex codés en dur des mockups décoratifs (Logo SVG, `AfricaMapVisual`, mock UIs KumpaCard/VisitApp/MaxImmo/Store, charte couleur Odoo `#875A7B`/`#714B67`, couleur par produit `product.color`) ont été laissés tels quels**, conformément à la consigne explicite de l'utilisateur — vérifié qu'aucun résidu de token dupliqué ne subsiste hors de ces zones (`grep` final : tous les hex restants sont dans les composants de mock UI, avant le `return` du composant principal).
- **Champs du formulaire de contact en `bg-white`** au lieu de `--input-background` (`#F0F2F8`) demandé par Guidelines.md §6 ("Champs avec fond `--input-background`") — corrigé sur les 6 champs (`bg-input-background`).
- **États interactifs manquants** : `focus-visible:ring-2 focus-visible:ring-primary/40` + `active:scale-[0.98]` ajoutés sur les boutons/liens réels qui n'avaient que le survol (CTA nav, CTA hero primaire/secondaire, bouton "En savoir plus" par produit — anneau `ring-current` pour s'adapter à la couleur de chaque produit —, bouton submit du formulaire, bouton "Envoyer un autre message"), plus `disabled:opacity-50 disabled:pointer-events-none` sur les vrais `<button>` (aucun n'est actuellement désactivé dynamiquement, classes posées par anticipation comme l'exige Guidelines.md §6, sans ajouter de logique de désactivation qui n'existe pas encore).
- **Non touché** : les valeurs des tokens elles-mêmes (`theme.css`/`fonts.css` intacts, comme demandé), le radius (`rounded-none` trouvé une fois dans `AfricaMapVisual` sur un calque de fond décoratif en pointillés sans coin visible — laissé), les hover déjà personnalisés en teinte plus foncée (`hover:bg-[#0F2A90]`, pas un doublon de token), les couleurs sans token correspondant (`#4B5163` du sous-titre hero — ne duplique aucun token existant).

**Vérifié** : `npm run build` passe sans erreur après tous les changements ; `grep` final confirme zéro `fontFamily` codé en dur restant et zéro hex dupliquant un token hors des mockups décoratifs.

**Non vérifié visuellement** : tentative de screenshot via `/browse` (Playwright headless) — échoue toujours, cette fois sur un exécutable Chromium manquant (`chrome-headless-shell.exe` introuvable dans `ms-playwright`), variante du blocage déjà rencontré aux suites 6/7/8/9/10 (`/browse` indisponible sur cette machine). Serveur `npm run dev` lancé et testé fonctionnel via `curl` (200 OK) avant d'être arrêté proprement en fin de session. Recommandé de confirmer visuellement en local (`npm run dev`) que les titres rendent bien en Fraunces (serif à empattements marqués) et non plus en Outfit (sans-serif géométrique).

**Doc** : nouvelle ligne ✅ résolu ajoutée à `docs/AUDIT.md` §7 (aucune section §3.x dédiée aux tokens n'existait avant cette session — la dérive polices/couleurs n'avait jamais été documentée comme dette technique).

**Ouvert** : vérification visuelle en attente (blocage `/browse`) ; reste de `docs/AUDIT.md` §7 inchangé par ailleurs (formulaire non fonctionnel toujours le point le plus urgent, `og:image`, favicon, etc.).

---

## 2026-08-18 (suite 2) — Nouvelle passe de vérification : doc toujours conforme au code physique

**Contexte** : nouvelle demande de reprendre le contexte du projet par rapport au code physique et de le garder à jour dans `docs/` (probablement une nouvelle session sans mémoire des deux entrées précédentes du jour, celles-ci ayant déjà fait ce travail).

**Méthode** : relecture des deux entrées précédentes du jour ci-dessous, puis re-vérification point par point sur le disque plutôt que de faire confiance à la doc : `ls` racine/`src/app`/`src/styles`/`public`, `package.json`, `index.html` (title/meta/OG), `grep TODO` sur `App.tsx`, présence de `docker/nginx.conf` et `package-lock.json`, `git status` (confirme toujours l'absence de dépôt), `docker ps`.

**Résultat : aucun écart trouvé.** Tout ce qu'affirment `CLAUDE.md`, `docs/AUDIT.md` et les entrées précédentes de ce fichier correspond à l'état réel du code au moment de cette vérification :
- `package-lock.json` présent à la racine (régénéré lors de la suite précédente).
- `docker/nginx.conf` présent (recréé lors de la suite précédente).
- `index.html` : `<title>` toujours "Premium SaaS Showcase Website" (résidu Figma Make anglais), `<meta name="description">` toujours l'ancienne description générique anglaise, `og:image`/`twitter:image` toujours commentés — seuls `og:title`/`og:description`/`twitter:title`/`twitter:description` sont déjà en français et à jour (KumpaX, Dakar).
- `App.tsx` : 6 `TODO` confirmés (3 sur le téléphone placeholder — mock UI KumpaCard, section Contact, footer ; 3 sur les liens sociaux WhatsApp/Instagram/Facebook du footer).
- Toujours aucun dépôt git (`git status` → `fatal: not a git repository`).
- `guidelines/Guidelines.md` toujours le design system "hub KumpaX" (page mère + filiales, bilingue) décrit dans les entrées précédentes — toujours en décalage avec l'implémentation actuelle (page unique en français), non tranché.

**Un point corrigé par rapport à la suite précédente** : celle-ci notait le conteneur `landingpage-kumpax-landing-1` "toujours en cours au moment de la rédaction" sur le port 8080, à arrêter si inutilisé. Vérifié via `docker ps` : **le conteneur ne tourne plus** (absent de la liste des conteneurs actifs de la machine) — soit arrêté entre-temps, soit la machine a redémarré. Aucune action nécessaire, le port 8080 est libre.

**Aucune modification de code ni de doc de fond** : `CLAUDE.md`/`docs/AUDIT.md` restent corrects tels quels, seule cette entrée est ajoutée à `docs/HISTORIQUE.md` pour tracer l'échange.

**Ouvert** : inchangé — voir `docs/AUDIT.md` §7 (formulaire de contact non fonctionnel toujours le point le plus urgent ; téléphone et 3 liens sociaux toujours en placeholder ; `og:image`/`twitter:image`, `<title>`/description résidus Figma Make, favicon absent, pas de dépôt git).

---

## 2026-08-18 (suite) — Premier lancement Docker réel : 2 blocages trouvés et corrigés

**Contexte** : demande de lancer le projet avec Docker, avec autorisation explicite de tout régler en cas de souci. Aucun lancement Docker réel n'avait en fait jamais été effectué dans cette conversation malgré les mentions "testé en conditions réelles" dans `docs/AUDIT.md` (probablement vrai lors d'une session antérieure, mais l'état du dossier a depuis régressé sur deux points).

**Blocage 1 — lockfile racine absent** (déjà repéré lors de la resynchronisation documentaire un peu plus tôt aujourd'hui, voir entrée ci-dessous) : `Dockerfile` fait `COPY package.json package-lock.json ./` puis `npm ci`, qui échouent sans lockfile. **Fait** : `npm i` à la racine pour régénérer `package-lock.json`.

**Blocage 2 — `docker/nginx.conf` inexistant** (nouveau, pas détecté lors de la resynchronisation documentaire précédente car celle-ci n'avait pas vérifié le contenu du dossier `docker/` — seul son existence était supposée d'après `CLAUDE.md`) : le dossier `docker/` lui-même n'existait pas physiquement, alors que `Dockerfile`, `docker-compose.yml`, `README.md` et `CLAUDE.md` le référencent tous. `docker compose up --build` échouait sur `COPY docker/nginx.conf ...: not found`. **Fait** : recréé `docker/nginx.conf` en reprenant le comportement déjà documenté dans `CLAUDE.md` ("cache long sur `/assets/`, `index.html` jamais caché") — gzip activé, `location /assets/` en `Cache-Control: public, max-age=31536000, immutable`, `location = /index.html` en `no-cache`, fallback SPA `try_files $uri $uri/ /index.html` (pas de client-side routing actuellement dans `App.tsx`, mais un fallback SPA reste inoffensif et couvre une éventuelle évolution future), `robots.txt`/`favicon.ico` avec logs désactivés.

**Vérifié en conditions réelles** : `docker compose up -d --build` réussit (build ~15s : `npm ci` 87 paquets, `vite build` → `dist/index.html` 2.5 kB, `dist/assets/*.css` 41 kB, `dist/assets/*.js` 225 kB) ; conteneur `landingpage-kumpax-landing-1` démarre et passe **`healthy`** (healthcheck `wget http://127.0.0.1/`) ; `curl -I http://localhost:8080/` → `200 OK`, `Cache-Control: no-cache` sur `index.html` ; `curl -I http://localhost:8080/assets/index-*.css` → `200 OK`, `Cache-Control: public, max-age=31536000, immutable` — les deux comportements de cache voulus sont bien actifs.

**Décision** : le lockfile régénéré (`package-lock.json`) et le nouveau `docker/nginx.conf` sont laissés en place dans le dossier de travail (pas de dépôt git pour les "committer" formellement — voir `docs/AUDIT.md` §7, toujours ouvert).

**Ouvert** : `docs/AUDIT.md` §7 — la ligne 🔴 "régénérer le lockfile" peut passer à résolu ; ajouter un nouveau point sur `docker/nginx.conf` qui avait disparu (à faire à la prochaine mise à jour de l'audit). Le conteneur tourne toujours sur le port 8080 au moment de la rédaction de cette entrée — à arrêter (`docker compose down`) si non utilisé, pour libérer le port.

---

## 2026-08-18 — Resynchronisation de la documentation sur l'état physique du code

**Contexte** : demande explicite de reprendre le contexte du projet en le confrontant au code physique réel, et de garder ce contexte (CLAUDE.md), l'historique et les échanges de session dans les fichiers appropriés du dossier `docs/` (déjà existant depuis les sessions précédentes — `docs/AUDIT.md` et `docs/HISTORIQUE.md`).

**Méthode** : relecture du dossier racine, de `src/`, `public/`, `index.html`, `package.json`, `vite.config.ts`, `guidelines/Guidelines.md`, `README.md`, `ATTRIBUTIONS.md`, et comparaison ligne à ligne avec `CLAUDE.md` et `docs/AUDIT.md`.

**Écarts trouvés entre la doc et le code physique, corrigés dans `CLAUDE.md` et `docs/AUDIT.md`** :
- **Lockfile racine disparu** : `CLAUDE.md` et `docs/AUDIT.md` affirmaient qu'un `package-lock.json` (généré le 2026-07-27) était présent. Vérification (`ls`, `Glob *lock*`) : **absent** — ni `package-lock.json` ni `pnpm-lock.yaml` à la racine, seul `node_modules/.package-lock.json` (fichier interne npm, pas le lockfile du projet) subsiste. Cause de la disparition non identifiée (pas de dépôt git pour retracer l'historique). Remonté en priorité 🔴 dans `docs/AUDIT.md` §7 — à régénérer via `npm i` avant tout déploiement.
- **Dimensions du logo obsolètes dans la doc** : `CLAUDE.md` et `docs/AUDIT.md` citaient encore `public/kumpax-logo.png` à 375×285, alors que la suite 8 du 2026-08-12 (déjà consignée plus bas dans ce fichier) l'a recadré à 279×217. Vérifié par inspection réelle du fichier (`System.Drawing`, PowerShell) : **279×217 confirmé**. Corrigé aux deux endroits.
- **`guidelines/Guidelines.md` n'est plus un template vierge** : `CLAUDE.md` le décrivait comme "jamais rempli", mais le fichier contient désormais un design system complet pour un concept de **hub KumpaX** (page mère de groupe redirigeant vers des filiales/produits comme KumpaStore, bilingue FR/EN, tokens couleur/typo, composants UI, formulaires). Ce document décrit une architecture différente de l'implémentation actuelle d'`App.tsx` (page unique, tout-en-un, en français uniquement, sans notion de filiales séparées ni de sélecteur de langue). Aucune modification de code n'a été faite sur ce point — signalé dans `CLAUDE.md` et `docs/AUDIT.md` §3 comme direction produit potentielle à clarifier avec l'utilisateur avant toute implémentation, pas comme une spec actuelle.

**Non modifié (vérifié conforme à la doc existante)** : structure `src/` (`main.tsx`, `app/App.tsx` à 1604 lignes, `styles/`), absence de dépôt git, absence de `tsconfig.json`, `og:image`/`twitter:image` toujours commentés dans `index.html`, `<title>`/description toujours résidus Figma Make en anglais, favicon toujours absent, `vite.config.ts` toujours avec le plugin `figmaAssetResolver` résiduel pointant vers `src/assets` (dossier inexistant), `public/` contient bien `kumpax-logo.png`, `kumpax-logo-blue.png`, `robots.txt`, `sitemap.xml`.

**Ouvert** : reste de `docs/AUDIT.md` §7 inchangé, plus le nouveau point 🔴 sur le lockfile manquant. La divergence entre `guidelines/Guidelines.md` (vision "hub + filiales" bilingue) et l'implémentation actuelle (page unique en français) n'a pas été tranchée — à clarifier avec l'utilisateur si une évolution structurelle du site est envisagée.

---

## 2026-08-12 (suite 10) — Odoo : "Notre approche" (4 étapes) passée en horizontal

**Contexte** : dans la section "Intégration Odoo" (`#services`), le mini-bloc "Notre approche" (4 étapes) était une liste verticale coincée dans la colonne de gauche (moitié de largeur, à côté de la colonne "Modules Odoo maîtrisés"). Demande de le passer en horizontal, via `/frontend-design`.

**Décision de layout** : passer les 4 étapes en horizontal *dans* la colonne à moitié largeur aurait cassé la lisibilité (libellés assez longs : "Audit et découverte des besoins", etc., dans ~280px de large avec 4 colonnes). Le bloc a donc été **sorti de la colonne "Services"** et replacé en **pleine largeur de section**, sous les deux colonnes Services/Modules, séparé par une bordure (`border-t border-white/[0.08]`) — cohérent avec le motif déjà utilisé ailleurs sur le site pour ce genre de séparation (ex. footer).

**Fait (`src/app/App.tsx`, section `#services`)** :
- Repris le motif visuel de la section "Notre approche" principale du site (`#approche`, timeline 6 étapes avec ligne + cercles numérotés) plutôt que d'inventer un nouveau style — cohérence avec le système déjà en place.
- Grille `grid-cols-2 sm:grid-cols-4` (2×2 en mobile, 4 en ligne dès `sm:`), ligne de connexion horizontale (`left-[12.5%] right-[12.5%]`, calcul identique à la section principale mais pour 4 colonnes au lieu de 6) en dégradé de la teinte Odoo (`rgba(135,90,123,0.35)`) — line masquée en dessous de `sm:` pour ne pas casser visuellement le passage en grille 2×2.
- Cercles numérotés (`w-10 h-10`, fond `#080C1E` identique au fond de section pour que la ligne passe visuellement derrière, bordure/texte `#875A7B` — couleur de marque Odoo déjà utilisée partout dans cette section) au lieu des petits cercles `w-6 h-6` alignés à gauche du texte.
- Cascade `Reveal` (`delayMs={i * 100}`) réappliquée à chacune des 4 étapes, comme sur la section principale — cohérent avec le système d'animation du site (voir `docs/AUDIT.md` §3.0).

**Vérifié** : `npm run build` passe sans erreur.

**Non vérifié visuellement** : blocage `/browse` toujours en place — recommandé de confirmer en local via `npm run dev`, en particulier le rendu de la grille 2×2 en mobile (sans ligne de connexion) et le passage à 4 colonnes en `sm:`.

**Ouvert** : vérification visuelle en attente ; reste de `docs/AUDIT.md` §7 inchangé.

---

## 2026-08-12 (suite 9) — Footer : ajout WhatsApp, Instagram, Facebook

**Contexte** : l'icône Mail du footer paraissait isolée. Demande d'ajouter WhatsApp, Instagram et Facebook à côté.

**Décision** : pas de vraies URLs disponibles (question posée explicitement) — l'utilisateur a choisi de les ajouter en placeholder `href="#"` avec un `TODO` par lien, comme pour le téléphone, plutôt que d'attendre les vraies informations. Différent de la session du 2026-07-27 où des liens sociaux `href="#"` similaires avaient été **retirés** car considérés comme des liens morts trompeurs — ici c'est un choix explicite et documenté de l'utilisateur, pas un oubli.

**Fait (`src/app/App.tsx`)** :
- Nouvel import `import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";` (icônes de marque authentiques, cohérent avec l'usage existant de `react-icons/si` pour les logos tech de la section "Domaines d'expertise" — déjà une dépendance du projet, pas de nouveau package).
- 3 nouveaux boutons ajoutés dans le footer à côté de Mail, même style exact (`w-8 h-8 rounded-lg bg-white/[0.07]`, icône `text-white/45`, hover `bg-white/[0.14]`) — cohérence visuelle avec le bouton Mail existant.
- Chacun avec `aria-label` (WhatsApp/Instagram/Facebook) et un commentaire `TODO` explicite juste au-dessus (même convention que le téléphone) indiquant quoi renseigner avant mise en production (URL wa.me pour WhatsApp, handle Instagram, page Facebook).

**Vérifié** : `npm run build` passe sans erreur.

**Doc** : `docs/AUDIT.md` §4.3 et §7 mis à jour (nouvelle ligne "Ouvert" pour les 3 TODO).

**Ouvert** : les 3 vraies URLs sociales à fournir (comme le téléphone) ; reste de `docs/AUDIT.md` §7 inchangé.

---

## 2026-08-12 (suite 8) — Cause réelle du "trop d'espace" trouvée : marge invisible dans le PNG

**Contexte** : l'utilisateur restait insatisfait de l'espace entre le logo et "KumpaX" malgré 2 réductions successives du `gap` CSS (suites 6 et 7). Avant de réduire le gap une 3e fois à l'aveugle, investigation de la cause réelle.

**Root cause trouvée** : le fichier `kumpax-logo.png` fourni par l'utilisateur a une **marge transparente importante intégrée au PNG**, pas centrée — mesurée par inspection programmatique des pixels (bounding box des pixels non-transparents sur un canvas de 375×285) : 56px de marge à gauche, **46px à droite**, 36px en haut, 38px en bas. Avec `object-contain` sur une image `h-11 w-auto`, cette marge invisible est rendue proportionnellement (~7px de vide à droite du mark, en plus du `gap` CSS) — donc réduire le `gap` seul ne pouvait pas suffire, l'essentiel de l'espace perçu venait de l'image elle-même, pas du CSS.

**Fait** : les deux fichiers `public/kumpax-logo.png` et `public/kumpax-logo-blue.png` ont été **recadrés sur leur silhouette visible** (bounding box des pixels avec alpha>10, +3px de marge de sécurité pour l'anti-aliasing) via un script PowerShell/`System.Drawing` — canvas réduit de 375×285 à **279×217** pour les deux fichiers (bbox identique, confirmant que c'est bien le même tracé de base). Le `gap-1` du composant `Logo` n'a pas été retouché dans cette entrée : maintenant que l'image n'a plus de marge cachée, ce même `gap-1` produit un résultat visuellement bien plus serré qu'avant sans qu'il ait changé.

**Vérifié** : `npm run build` passe sans erreur ; image recadrée inspectée visuellement (silhouette bien collée aux bords du fichier, plus de marge blanche/transparente visible).

**Non vérifié visuellement dans le navigateur** : blocage `/browse` toujours en place (voir suite 6) — recommandé de confirmer en local via `npm run dev` que l'espace logo/texte convient enfin ; si ce n'est toujours pas assez serré, le `gap-1` (4px) actuel est désormais le seul levier restant (l'image elle-même est déjà rognée au plus près).

**Ouvert** : vérification visuelle en attente ; reste de `docs/AUDIT.md` §7 inchangé.

---

## 2026-08-12 (suite 7) — Header encore plus collé, footer en bleu-blanc (remplace le noir-blanc)

**Contexte** : ajustement de la suite précédente — le `gap-1.5` du header n'était visiblement pas assez serré, et pour le footer l'utilisateur préfère finalement une version **bleu-blanc** du logo plutôt que noir-blanc (générée à la suite précédente). Passage par le skill `/frontend-design` comme demandé.

**Fait (`src/app/App.tsx`, composant `Logo`)** :
- `gap-1.5` → **`gap-1`** (4px) entre le mark et "KumpaX" — encore plus resserré.
- `light` pointe maintenant vers **`/kumpax-logo-blue.png`** au lieu de `/kumpax-logo-mono.png` pour le footer.

**Fait — nouveau fichier `public/kumpax-logo-blue.png`, remplace `kumpax-logo-mono.png` (supprimé)** : même technique de contraste étiré par luminance que la version noir-blanc précédente (script PowerShell/`System.Drawing`, deux passes min/max puis remap), mais au lieu d'interpoler vers du gris/noir achromatique, chaque pixel est interpolé entre le **bleu de marque `#3B5BFF`** (luminance basse d'origine) et **blanc** (luminance haute d'origine) — garde une teinte de marque reconnaissable tout en assurant un bon contraste sur le fond très sombre du footer (`#080C1E`).

**Vérifié** : `npm run build` passe sans erreur.

**Non vérifié visuellement** : le blocage `/browse` (politique Application Control de la machine, voir suite 6) n'a pas été retenté — toujours recommandé de valider en local via `npm run dev`.

**Ouvert** : vérification visuelle en attente ; reste de `docs/AUDIT.md` §7 inchangé.

---

## 2026-08-12 (suite 6) — Header : logo agrandi et rapproché du texte ; footer : logo noir-blanc agrandi

**Contexte** : 3 demandes — rapprocher le logo et le texte "KumpaX" dans le header, agrandir le logo (quitte à retoucher le header en général), et sur le footer utiliser une version noir-blanc du logo (pas noir-bleu) en plus grand. Passage par le skill `/frontend-design` pour la partie header, comme demandé explicitement ("en tant qu'expert").

**Fait — nouveau fichier `public/kumpax-logo-mono.png`** : le logo couleur (navy + bleu) a une plage de luminance étroite et sombre (min ≈8/255, max ≈69/255 sur les pixels visibles — même les zones "bleues" sont assez sombres), donc une simple désaturation en niveaux de gris serait restée quasi invisible sur le fond très sombre du footer (`#080C1E`). Généré à la place une version à **contraste étiré** : la luminance de chaque pixel est renormalisée pour occuper toute la plage 0–255 (script PowerShell/.NET, `System.Drawing`, deux passes : min/max puis remap), ce qui donne un vrai dégradé noir→blanc avec un blanc qui ressort nettement sur fond sombre, plutôt que le navy/bleu d'origine peu lisible en l'état.

**Fait (`src/app/App.tsx`, composant `Logo`)** :
- `gap-2.5` → **`gap-1.5`** entre le mark et le texte "KumpaX" (rapprochement demandé).
- Taille du mark : passée d'un carré fixe `w-8 h-8` (32px) à `h-11 w-auto` (44px, header) — l'image garde son ratio naturel (375×285) au lieu d'être contrainte dans un carré, qui la faisait paraître plus petite qu'elle ne l'est.
- `light` détermine maintenant aussi **la source de l'image** (`kumpax-logo.png` en couleur pour le header, `kumpax-logo-mono.png` en noir-blanc pour le footer) — pas seulement la couleur du texte comme avant.
- Taille du mark en mode `light` (footer) : **`h-14`** (56px) — nettement plus grand que le header, comme demandé.
- Texte "KumpaX" : taille montée de `1.05rem` à `1.3rem` pour rester proportionné au mark agrandi (ajustement d'ensemble du header, cohérent avec la demande de retoucher le header si besoin).

**Fait (header, `App.tsx`)** : hauteur de la navbar `h-16` (64px) → **`h-20`** (80px) pour donner de l'air au mark agrandi (44px) ; `padding-top` du hero (`pt-16` → `pt-20`) ajusté en conséquence pour rester calé sous la navbar fixe désormais plus haute.

**Non vérifié visuellement** : tentative de captures d'écran via le skill `/browse` (Chromium headless) — bloquée par une **politique Application Control de la machine** qui refuse d'exécuter `browse.exe` (`"An Application Control policy has blocked this file"`, confirmé via PowerShell), en plus d'un souci de permissions similaire côté Git Bash. Recommandé de vérifier en local via `npm run dev`, en particulier : l'équilibre visuel du header à la nouvelle hauteur, le rendu du logo noir-blanc sur le fond très sombre du footer, et que rien ne déborde en mobile (menu burger).

**Vérifié** : `npm run build` passe sans erreur.

**Ouvert** : vérification visuelle en attente (cf. ci-dessus) ; reste de `docs/AUDIT.md` §7 inchangé.

---

## 2026-08-12 (suite 5) — Correctifs logo : texte en graisse plus épaisse, fond retiré

**Fait (`src/app/App.tsx`, composant `Logo`)** : le texte "KumpaX" à côté du mark passe de `font-bold` (700) à **`font-black`** (900, disponible dans `fonts.css` pour Outfit) — écriture plus épaisse, comme demandé.

**Fait (`public/kumpax-logo.png`)** : le fichier fourni par l'utilisateur avait un fond **blanc opaque intégré au PNG** (canal alpha présent mais figé à 255 partout, vérifié par inspection programmatique des pixels — pas un simple fond transparent mal exploité). Retraité via un script PowerShell/.NET (`System.Drawing`) : pour chaque pixel, nouvel alpha = `255 - min(R,G,B)` puis dé-prémultiplication de la couleur (technique standard pour retirer un fond blanc d'un visuel anti-aliasé dessiné dessus) — le blanc pur devient totalement transparent, les traits bleu/marine du logo gardent leur couleur avec un anti-aliasing propre sur les bords. Vérifié après coup : les 4 coins et le centre de l'image sont bien à `alpha=0`.

**Vérifié** : `npm run build` passe sans erreur.

**Ouvert** : identique à `docs/AUDIT.md` §7 — rien de nouveau.

---

## 2026-08-12 (suite 4) — Refresh complet de la documentation

**Contexte** : demande explicite de mettre à jour toute la documentation, après les 3 sessions précédentes du jour (hero/logo/téléphone/équipe, alignement Sénégal, correction CLAUDE.md).

**Fait** : relecture complète de `README.md`, `ATTRIBUTIONS.md`, `CLAUDE.md`, `docs/AUDIT.md` contre l'état réel du code.
- `README.md` : déjà à jour (mentionnait déjà les 4 pays de présence, dont le Sénégal — pas de changement nécessaire).
- `ATTRIBUTIONS.md` : corrigé — affirmait encore "plus aucune image ne subsiste dans le dépôt", devenu faux depuis l'ajout de `public/kumpax-logo.png` (2026-08-12). Précisé que ce logo est une ressource propriétaire KumpaX fournie par l'utilisateur, pas un asset tiers — aucune attribution requise.
- `CLAUDE.md` (point 4) et `docs/AUDIT.md` (§4.2) : corrigés — affirmaient encore "aucune image de marque adaptée dans le projet" pour justifier l'absence d'`og:image`. Mis à jour : le logo existe désormais mais fait 375×285 (vérifié via les en-têtes IHDR du PNG), pas au format 1200×630 attendu pour un partage social — l'image dédiée reste donc à fournir, mais pour une raison différente (format inadapté, pas absence totale d'image).
- `docs/AUDIT.md` : date de dernière mise à jour actualisée.

**Vérifié** : uniquement de la documentation modifiée dans cette entrée — aucun fichier source touché, pas de build nécessaire.

**Ouvert** : identique à `docs/AUDIT.md` §7 — rien de nouveau.

---

## 2026-08-12 (suite 3) — Confirmation : l'entreprise est basée à Dakar

**Fait (`CLAUDE.md`, § Vue d'ensemble)** : l'utilisateur a confirmé que l'entreprise est réellement basée à Dakar (Sénégal) — le point laissé en suspens en fin de session précédente est donc tranché. Ligne corrigée : "entreprise basée à Yaoundé (Cameroun)" → **"entreprise basée à Dakar (Sénégal)"**.

**Fait aussi (`index.html`)** : recherche complémentaire dans tout le projet (hors `docs/`, où l'historique garde volontairement les mentions passées) qui a révélé 2 dernières occurrences oubliées — les meta `og:description` et `twitter:description` mentionnaient encore "à Yaoundé et dans toute l'Afrique de l'Ouest et centrale". Corrigées en "à Dakar et dans toute l'Afrique de l'Ouest et centrale".

**Vérifié** : `npm run build` passe ; recherche de "Yaoundé"/"Cameroun" sur tout le projet (hors `node_modules`) ne renvoie plus que des mentions historiques dans `docs/HISTORIQUE.md`/`docs/AUDIT.md` (traçabilité intentionnelle) — plus aucune trace dans le code ou `CLAUDE.md`.

**Doc** : `docs/AUDIT.md` §4.5 complété pour noter que ce dernier point est également résolu.

---

## 2026-08-12 (suite 2) — Alignement de l'incohérence géographique sur le hero (Sénégal)

**Contexte** : suite directe de l'entrée précédente — l'utilisateur a demandé d'aligner l'adresse de la section Contact sur le Sénégal (plutôt que l'inverse) pour résoudre l'incohérence géographique signalée en fin de session précédente.

**Fait (`src/app/App.tsx`)** : l'adresse de la section Contact passe de **"Yaoundé, Cameroun"** à **"Dakar, Sénégal"** — cohérent avec le badge HQ de la carte hero ("KumpaX · Sénégal") et le téléphone au format sénégalais. Plus aucune occurrence de "Yaoundé"/"Cameroun" dans `src/` (vérifié par recherche).

**Signalé, non modifié** : `CLAUDE.md` (§ Vue d'ensemble, première ligne) décrit toujours KumpaX comme "entreprise basée à Yaoundé (Cameroun)" — c'est une affirmation sur l'entreprise réelle, distincte du contenu de la page elle-même, donc **non touchée** par cet alignement qui portait explicitement sur le contenu affiché. À clarifier avec l'utilisateur si cette ligne doit aussi changer, ou si le siège réel diverge volontairement de ce qui est montré sur le site.

**Vérifié** : `npm run build` passe sans erreur.

**Doc** : `docs/AUDIT.md` §4.5 marqué résolu (avec la remarque ci-dessus sur `CLAUDE.md`) ; §7 : ligne "Trancher l'incohérence..." retirée des points ouverts, ajoutée aux ✅ Fait.

**Ouvert** : la ligne "Vue d'ensemble" de `CLAUDE.md` (Yaoundé, Cameroun) ; reste de `docs/AUDIT.md` §7 inchangé.

---

## 2026-08-12 (suite) — Hero (villes→pays), logo réel, téléphone sénégalais, suppression section Équipe

**Contexte** : 4 demandes groupées, à traiter sans nécessairement suivre l'ordre des points ouverts de l'audit.

**Fait (`src/app/App.tsx`)** :
- **Hero — carte de présence (`AfricaMapVisual`)** : les 3 libellés de villes satellites remplacés par leur pays (`Banjul-Serrekunda` → `Gambie`, `Conakry` → `Guinée`, `Kinshasa` → `RD Congo`), et le badge du siège passé de `KumpaX · Dakar` à **`KumpaX · Sénégal`** (largeur du chip élargie de 56 à 62 pour le texte plus long) — cohérence totale "pays" sur tout le hero, plus aucune ville nommée.
- **Téléphone** : les 3 occurrences du placeholder `+237 6XX XXX XXX` (indicatif Cameroun) remplacées par `+221 7X XXX XX XX` (format Sénégal), TODO existants conservés — **toujours un placeholder**, l'utilisateur n'a pas fourni de vrai numéro (question posée explicitement, réponse : garder un placeholder au bon format en attendant).
- **Logo (`Logo` composant)** : l'ancien mark "KX" dessiné en CSS (carré à dégradé bleu `#1234B0→#3B5BFF`) remplacé par le vrai logo fourni par l'utilisateur (`D:\img_dsc\kumpax_logo.png`, copié vers `public/kumpax-logo.png`), affiché via `<img src="/kumpax-logo.png">`. Le texte "KumpaX" à côté du mark est conservé (le fichier fourni est un symbole seul, sans texte).
- **Section "Notre équipe" retirée entièrement** : la `<section id="equipe">`, le tableau de données `TEAM` (4 membres fictifs), et le lien de nav `{ label: "Équipe", href: "#equipe" }` ont tous été supprimés — plus aucune référence à "équipe"/"TEAM" dans le code (vérifié par recherche).

**Fait — nouveau fichier** : `public/kumpax-logo.png` (copié depuis `D:\img_dsc\kumpax_logo.png`).

**Signalé, non modifié (hors périmètre demandé)** : le remplacement "Dakar"→"Sénégal" + téléphone sénégalais accentue l'incohérence géographique déjà connue (`docs/AUDIT.md` §4.5) — la section Contact affiche toujours "Yaoundé, Cameroun" comme adresse, alors que 2 éléments du site (carte hero + téléphone) pointent désormais vers le Sénégal. À trancher par l'utilisateur.

**Vérifié** : `npm run build` passe sans erreur (deux fois, avant et après le changement de téléphone) ; recherche de "equipe"/"TEAM"/"Équipe" dans `App.tsx` confirmée vide après suppression.

**Doc** : `docs/AUDIT.md` mis à jour (§1, §3, §3.1, §4.3, §4.5, §7) pour refléter ces 4 changements.

**Ouvert** : incohérence géographique Sénégal/Yaoundé (accentuée, voir ci-dessus) ; vrai numéro de téléphone toujours à fournir ; reste de la liste `docs/AUDIT.md` §7 inchangé.

---

## 2026-08-12 — Reprise de contexte, vérification du code physique

**Contexte** : nouvelle session après 16 jours sans activité sur ce projet. Demande explicite de reprendre le contexte à partir du code physique (pas seulement de la doc) et de continuer à consigner les échanges dans les fichiers du projet plutôt qu'en mémoire volatile.

**Fait** : relecture de `CLAUDE.md`, `docs/AUDIT.md` et `docs/HISTORIQUE.md` (suite 17), puis vérification point par point contre l'état réel du code (`git status`, `package.json`, `vite.config.ts`, `index.html`, occurrences téléphone/Yaoundé/Dakar/formulaire dans `App.tsx`).

**Constat** : **aucun changement de code depuis la suite 17** (2026-07-27) — tous les points ouverts de `docs/AUDIT.md` §7 sont toujours dans le même état (pas de dépôt git, formulaire de contact factice, téléphone placeholder ×3, `<title>`/description résidus Figma Make, favicon absent, `figmaAssetResolver` mort, `pnpm-workspace.yaml` incohérent avec npm, incohérence Dakar/Yaoundé). Seule variation mineure : `App.tsx` est passé à 1633 lignes (vs ~1600 documenté), sans changement structurel notable. `docs/AUDIT.md` reste donc à jour, aucune modification nécessaire.

**Ouvert** : identique à `docs/AUDIT.md` §7 — rien de nouveau, en attente de décisions/contenus de la part de l'utilisateur (formulaire de contact, git init, numéro réel, favicon, image OG, title/description, arbitrage Dakar/Yaoundé).

---

## 2026-07-27 (suite 17) — Refresh complet de la documentation

**Contexte** : demande explicite de mettre à jour toute la documentation du projet, après plusieurs sessions de changements (nettoyage, Docker, hero/Dakar, animations) qui avaient rendu certains fichiers obsolètes ou factuellement faux.

**Fait** :
- **`ATTRIBUTIONS.md`** réécrit : mentionnait encore shadcn/ui et Unsplash comme utilisés, alors que les deux ont été entièrement retirés du code (aucune image ni composant shadcn/ui ne subsiste — vérifié par recherche avant d'écrire). Remplacé par une note factuelle + un historique de ce qui a été retiré, plus mention des polices Google Fonts (Outfit/Inter, aucune attribution requise).
- **`README.md`** réécrit : ne reflétait plus que l'export Figma Make d'origine ("Premium SaaS Showcase Website", instructions `npm i`/`npm run dev` uniquement). Remplacé par une présentation KumpaX à jour, instructions de dev + build + **déploiement Docker**, et des liens vers `CLAUDE.md`/`docs/AUDIT.md`/`docs/HISTORIQUE.md`.
- **`docs/AUDIT.md`** mis à jour :
  - Corrigé une information devenue **fausse** : la table §2 disait encore "React 18.3.1 (peerDependency, pas installée en dépendance directe)", alors que react/react-dom ont été déplacés vers `dependencies` lors du nettoyage (suite 8) — corrigé avec le contexte.
  - Résumé exécutif et liste d'état mis à jour : Docker et les passes d'animation ajoutés comme faits.
  - Arborescence (§3) mise à jour : ajout de `public/`, `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `docker/nginx.conf`.
  - Nouvelle sous-section **3.0 Système d'animation** : résume `Reveal`/`AnimatedStat`, le motif signature (signal sur la carte du hero), et la gestion de `prefers-reduced-motion` — pour que les prochaines sessions sachent réutiliser ce système plutôt que d'en réinventer un.
  - Deux nouveaux constats ajoutés en §4 (repérés en vérifiant l'état réel du projet, pas seulement en relisant l'historique) : **4.5** incohérence Dakar (carte hero) / Yaoundé (adresse Contact), jamais tranchée depuis qu'elle a été signalée ; **4.6** favicon toujours absent.
  - Nouveau constat mineur : `vite.config.ts` contient encore le plugin `figmaAssetResolver`, qui pointe vers `src/assets` — un dossier qui n'a **jamais existé** dans ce projet (les images étaient dans `src/imports/`, déjà supprimé). Code mort inerte, sans impact sur le build, ajouté au tableau de recommandations.
  - Tableau de recommandations (§7) mis à jour avec ces nouveaux points + les tâches Docker/animations marquées comme faites.
- **`CLAUDE.md`** mis à jour : liste "Points d'attention immédiats" complétée (favicon, incohérence Dakar/Yaoundé) ; nouvelle section **Animations** résumant le système `Reveal`/`AnimatedStat` et la consigne de le réutiliser pour toute nouvelle section plutôt que d'improviser un mécanisme différent.
- **`docs/HISTORIQUE.md`** : déjà tenu à jour en continu au fil des sessions précédentes — pas de changement structurel nécessaire au-delà de cette nouvelle entrée.

**Vérifié** : aucun fichier source (`src/`) modifié dans cette session — uniquement de la documentation. Pas de build nécessaire.

**Ouvert** : identique à l'état déjà consolidé dans `docs/AUDIT.md` §7 (formulaire de contact, git init, téléphone réel, favicon, `og:image`, `<title>`/description, incohérence Dakar/Yaoundé, npm vs pnpm, `figmaAssetResolver` mort, découpage de `App.tsx`, pages légales).

---

## 2026-07-27 (suite 16) — Annulation de la demande "suite 14" (filigrane Afrique)

**Fait** : à la demande explicite de l'utilisateur ("annule cette requête"), le filigrane Afrique (`AfricaBackdrop`) est revenu exactement à l'état de "suite 13" — fond plein `absolute inset-0 w-full h-full`, `preserveAspectRatio="xMidYMid slice"`, `opacity-[0.05]`, `hidden lg:block` (masqué sous `lg`). Les changements de "suite 14" (ancrage à droite, tailles 85%/70%, opacités 0.10/0.04, affichage sur mobile) sont annulés — **l'entrée "suite 14" ci-dessous reste dans l'historique pour la traçabilité mais ne reflète plus l'état actuel du code.**

**Vérifié** : `npm run build` passe. Le CSS compilé (`index-DhXGaL9W.css`, 40.59 Ko) est identique à celui produit juste après "suite 13", confirmant que le retour en arrière est exact.

---

## 2026-07-27 (suite 15) — "Pourquoi KumpaX" : cascade des cartes ralentie (via skill /frontend-design)

**Fait (`src/app/App.tsx`, section "Pour KumpaX" / eyebrow "Pourquoi KumpaX")** : le décalage entre l'apparition de chaque carte `TRUST_POINTS` au scroll est passé de `delayMs={i * 80}` à `delayMs={i * 150}` — étalement total de 0/80/160/240ms à 0/150/300/450ms. La cascade carte-à-carte est plus perceptible et posée, sans devenir lente pour une grille de 4 éléments. Changement scopé à cette seule section — le composant `Reveal` et sa durée de transition globale (0.7s) restent inchangés partout ailleurs.

**Vérifié** : `npm run build` passe sans erreur.

---

## 2026-07-27 (suite 14) — ⚠️ ANNULÉE (voir "suite 16") — Hero : filigrane Afrique recentré à droite, redimensionné, assombri

**Contexte** : retour en arrière partiel sur la décision de "suite 13" (fond plein `inset-0` uniforme) — l'utilisateur voulait en réalité un élément positionné à droite comme un filigrane contenu, pas un fond qui recouvre toute la largeur de façon uniforme.

**Fait (`AfricaBackdrop` dans `src/app/App.tsx`)** :
- `preserveAspectRatio` repassé de `xMidYMid slice` (qui recadrait la forme pour remplir tout le cadre) à **`xMidYMid meet`** : la silhouette entière reste visible, proportionnée dans sa boîte, plutôt que d'être étirée/recadrée en fond plein.
- **Desktop (`lg:`)** : ancré à droite (`lg:right-0`, `lg:left-auto`, `lg:translate-x-0`), hauteur **85%** de la section (`lg:h-[85%]`) — présence visuelle claire sans dominer. Opacité relevée de `0.05` à **`0.10`** (teinte plus foncée que la version précédente, tout en restant discrète).
- **Mobile/tablette** (sous `lg`) : au lieu d'être complètement masqué (`hidden lg:block` retiré), le filigrane s'affiche désormais **centré** (`left-1/2 -translate-x-1/2`), plus petit (`h-[70%]`) et plus discret (`opacity-[0.04]`) — cohérent avec l'empilement vertical du hero sur petit écran, sans gêner la lecture du texte.
- Le fond général du hero (`bg-white` sur la `<section>`) n'a pas été touché — reste en pleine largeur comme demandé, seule la forme Afrique elle-même est un élément positionné/dimensionné.

**Valeurs choisies (résumé pour validation visuelle)** :
| | Desktop (`lg:`) | Mobile/tablette |
|---|---|---|
| Position | Ancrée à droite | Centrée |
| Hauteur | 85% de la section | 70% de la section |
| Opacité | 0.10 | 0.04 |
| `preserveAspectRatio` | `xMidYMid meet` (forme entière visible, non recadrée) | idem |

**Vérifié** : `npm run build` passe sans erreur.

**Non vérifié visuellement** : capture d'écran automatisée toujours bloquée par le problème d'installation Chromium signalé dans les entrées précédentes (non retenté). À valider en local via `npm run dev` — en particulier si l'opacité 0.10 est jugée trop/pas assez foncée, et si la taille 85%/70% convient.

---

## 2026-07-27 (suite 13) — Hero : filigrane Afrique étendu à toute la section

**Contexte** : demande reformulée en détail pour re-vérifier 4 points sur le hero (focus Dakar, absence de Yaoundé, silhouette Afrique en fond, suppression de la ligne de séparation centrale). Audit du code avant modification : les points 1, 2 et la suppression du bandeau teinté central étaient **déjà traités lors de la session "suite 10"**. Seul le positionnement du filigrane Afrique restait perfectible.

**Constat (structure du hero avant cette entrée)** :
- `<section id="accueil">` = `<AfricaBackdrop />` (silhouette Afrique en fond) + conteneur `flex flex-col lg:flex-row` à 2 colonnes `flex-1` : gauche (eyebrow générique "Solutions Digitales pour Entreprises", titre, sous-texte, CTAs, bandeau `STATS`), droite (`<AfricaMapVisual />`).
- Aucun badge "SIÈGE À YAOUNDÉ" distinct n'a jamais existé : le seul élément mettant une ville en avant est le chip "KumpaX · [ville]" à l'intérieur même de la carte — déjà "KumpaX · Dakar" depuis "suite 10".
- Aucune trace de Yaoundé dans la carte/itinéraire (confirmé par recherche) ; seule "Yaoundé, Cameroun" subsiste dans l'adresse de la section Contact, hors périmètre du hero.
- Le bandeau de séparation centrale (fond teinté sur la moitié droite) avait déjà été retiré et remplacé par `<AfricaBackdrop />`, mais ce filigrane était ancré uniquement sur la moitié droite (`-right-16`), ne couvrant donc pas vraiment la colonne de gauche — les deux colonnes ne partageaient pas un fond commun.

**Fait aujourd'hui** : repositionné `AfricaBackdrop` pour qu'il couvre **toute** la section hero (`absolute inset-0 w-full h-full` + `preserveAspectRatio="xMidYMid slice"`, au lieu de `-right-16 h-[140%] w-auto`). Les deux colonnes reposent désormais sur le même fond continu, sans rupture visuelle entre elles — la structure en 2 colonnes (texte / visuel) est conservée telle quelle (mise en page hero classique et adaptée), seule l'unification du fond change.

**Non touché** : la structure flex sous-jacente et l'empilement mobile (`flex-col` en dessous de `lg`) ; `AfricaBackdrop` reste `hidden lg:block`, donc aucun risque de superposition sur mobile/tablette.

**Vérifié** : `npm run build` passe sans erreur.

**Non vérifié visuellement** : capture d'écran automatisée toujours bloquée par le même problème d'installation Chromium (verrou `ms-playwright` non résolu, déjà signalé à 3 reprises dans cette session — non retenté cette fois). Description structurelle donnée à l'utilisateur en fin de réponse pour validation visuelle en local (`npm run dev`).

---

## 2026-07-27 (suite 12) — "Développement & langages" en bande défilante translucide

**Fait (`src/app/App.tsx`, section Domaines d'expertise)** :
- La grille statique de badges (fond `bg-muted`, bordure, carte par techno) est remplacée par une **bande défilante en continu** : la liste `DEV_SKILLS` est dupliquée dans le DOM, le second jeu portant `aria-hidden` (masqué aux lecteurs d'écran, il ne sert qu'à boucler visuellement sans coupure — `translateX(-50%)` correspond exactement à un jeu complet, donc la boucle est invisible quel que soit le nombre de logos).
- Plus de fond ni de bordure sur les logos : chaque techno est juste l'icône (couleur de marque conservée) + son nom, flottant sur la section — "translucide sans background" comme demandé.
- Fondu sur les bords gauche/droit via `mask-image` (CSS pur), pour que les logos apparaissent/disparaissent en douceur plutôt que d'être coupés net.
- Pause au survol (`animation-play-state: paused`) pour laisser le temps de lire un logo précis.

**Fait (`src/styles/tailwind.css`)** : nouvelles classes `.marquee-mask` / `.marquee-track` + keyframe `marquee-scroll` (26s, boucle linéaire).

**`prefers-reduced-motion`** : le défilement est explicitement coupé (`animation: none`), la piste repasse en `flex-wrap` (ligne statique qui s'enroule normalement), et le jeu dupliqué (`.marquee-duplicate`) est masqué avec `display:none` pour ne pas afficher chaque logo deux fois une fois la boucle désactivée.

**Vérifié** : `npm run build` passe sans erreur.

**Non vérifié visuellement** : capture d'écran automatisée toujours bloquée par le problème d'installation Chromium déjà signalé dans les deux entrées précédentes (non retenté). À vérifier en local via `npm run dev`, en particulier la vitesse de défilement (26s/boucle, ajustable si trop rapide/lent) et le rendu du fondu sur les bords.

---

## 2026-07-27 (suite 11) — Passe animation (via skill /frontend-design)

**Contexte** : le fade-in générique au scroll + hovers basiques jugés "trop minimalistes". Passe dédiée via le skill `frontend-design`, en se concentrant sur UN motif signature plutôt que de multiplier les effets décoratifs partout (principe du skill : "an orchestrated moment usually lands harder than scattered effects").

**Signature retenue — "signal en direct" sur la carte du hero** : les lignes de connexion depuis Dakar (HQ) vers les 3 pays satellites ne sont plus des pointillés statiques : le motif de tirets se déplace en boucle (`stroke-dashoffset` animé, CSS pur) pour évoquer un signal/trafic qui circule réellement — cohérent avec le positionnement "KumpaX connecte les entreprises à travers l'Afrique". Chaque ville satellite reçoit aussi un anneau "ping" qui s'agrandit et s'estompe (animation du rayon SVG `r`, pas de `transform` pour éviter le bug classique de `transform-origin` sur les formes SVG), avec un délai croissant selon la distance à Dakar pour suggérer un signal qui se propage vers l'extérieur.

**Écho — ligne de la timeline "Notre approche" qui se dessine** : la ligne dégradée (primary → turquoise) reliant les 6 étapes passe de `scaleX(0)`/`scaleY(0)` à `1` quand la section entre dans le viewport (via un sélecteur CSS `.reveal-visible .approach-line-h/-v`, sans JS supplémentaire) — reprend le même motif "connexion qui se construit" que le hero, cette fois pour une vraie séquence à 6 étapes où l'ordre compte réellement.

**Polish, plus discret** :
- Courbe d'`easing` du composant `Reveal` affinée (`cubic-bezier(0.16, 1, 0.3, 1)` façon "ease-out-expo" au lieu d'un `ease-out` plat) pour une décélération plus soignée.
- Révélation séquentielle (`delayMs` déjà existant sur `Reveal`) étendue aux grilles qui apparaissaient toutes en bloc jusqu'ici : les 4 cartes "Pour KumpaX", les 9 badges + 2 cartes de "Domaines d'expertise", les 5 stats de "Notre impact en chiffres", les 4 membres de l'équipe.
- Survol harmonisé sur les cartes (`hover:border-primary/40` en plus du lift déjà en place) pour "Pour KumpaX" et "Domaines d'expertise" — une légère réponse à la couleur de marque plutôt qu'un simple décalage vertical isolé.
- Mockups produits : lift légèrement plus prononcé (`-translate-y-1.5` + `scale-[1.01]`).

**`prefers-reduced-motion`** : les deux nouvelles animations continues (`map-connection`, `map-ping`) sont explicitement désactivées (`animation: none`) sous préférence réduite, plutôt que de compter uniquement sur le filet de sécurité global (`animation-duration: 0.01ms`) — une boucle infinie accélérée à 0.01ms clignoterait au lieu d'être vraiment statique, ce qui aurait été pire que l'état non animé. Le dessin de la ligne "Notre approche" est également neutralisé explicitement.

**Vérifié** : `npm run build` passe. Comptage des balises `<Reveal>`/`</Reveal>` équilibré (16/16) après toutes les modifications.

**Non vérifié visuellement** : la capture d'écran automatisée est toujours bloquée par le même problème d'installation Chromium (verrou `ms-playwright` qui n'aboutit jamais, rencontré à plusieurs reprises dans cette session) — non résolu, cette fois volontairement pas retenté pour ne pas continuer à y perdre du temps. **Recommandé de vérifier en local via `npm run dev`**, en particulier : le rendu du signal animé sur la carte du hero, le dessin de la ligne "Notre approche", et le comportement avec "Réduire les animations" activé dans l'OS.

---

## 2026-07-27 (suite 10) — Hero : HQ déplacé sur Dakar, suppression du bandeau central

**Fait (`src/app/App.tsx`, composant `AfricaMapVisual`)** :
- Le traitement "siège" (gros point + halos + badge blanc "KumpaX · ...") est passé de **Yaoundé** à **Dakar**. Yaoundé a été **entièrement retiré** de la carte (plus aucun point, ligne ou libellé ne le mentionne).
- `kx`/`ky` (position du siège) déplacés de `(78, 148)` à `(50, 60)`, dans la zone représentant le Sénégal.
- Le tableau `cities` ne contient plus Dakar (devenu le point HQ) — il ne liste plus que les 3 pays satellites : Banjul-Serrekunda, Conakry, Kinshasa, avec des coordonnées réajustées pour garder un espacement cohérent autour du nouveau point HQ (évite que le badge du siège chevauche les points/étiquettes voisins).
- Le badge "KumpaX · Dakar" est positionné **au-dessus** du point (et non en dessous comme pour Yaoundé), car le siège se trouve désormais près du bord supérieur gauche du repère SVG — repositionner en dessous ferait sortir le badge du cadre.
- L'encart flottant "4 pays" n'a pas eu besoin d'être changé : avec Dakar comme siège + 3 pays satellites, le total reste bien 4 pays représentés sur la carte.

**Fait (section hero)** :
- Retiré le bandeau de séparation au centre du hero (`<div className="absolute top-0 right-0 bottom-0 w-1/2 ..." style={{ background: "#F0F4FF" }} />`) qui créait une ligne de démarcation entre les deux moitiés de la section.
- Ajouté un nouveau composant `AfricaBackdrop` : la silhouette de l'Afrique (même tracé SVG que celui utilisé dans la carte), agrandie et affichée en filigrane très discret (`opacity-[0.05]`) derrière tout le contenu du hero, plutôt que confinée à la petite carte de droite — remplace visuellement l'ancien aplat de couleur par quelque chose de plus organique et cohérent avec le thème "présence en Afrique".

**Vérifié** : `npm run build` passe sans erreur. Relecture manuelle complète du JSX pour confirmer l'absence de chevauchement entre le badge HQ et les points/étiquettes voisins (calculs de coordonnées vérifiés à la main).

**Non vérifié visuellement** : la capture d'écran automatisée reste bloquée par le même problème récurrent d'installation du binaire Chromium pour l'outil de QA (déjà rencontré en fin de session précédente) — un process d'installation externe/concurrent maintient un verrou sur `ms-playwright` sans jamais aboutir. Non résolu cette fois faute de temps raisonnable à y consacrer davantage ; recommandé de vérifier visuellement via `npm run dev` en local.

**Ouvert** :
- Confirmer visuellement le rendu (positionnement du badge Dakar, lisibilité du filigrane Afrique en arrière-plan) dès que possible.
- La section Contact affiche toujours "Yaoundé, Cameroun" comme adresse — **non modifiée** (hors du périmètre de cette demande, qui portait explicitement sur le hero) mais à noter : il y a maintenant une incohérence potentielle entre la carte (siège affiché à Dakar) et l'adresse de contact (toujours Yaoundé). À trancher si besoin.

---

## 2026-07-27 (suite 9) — Dockerisation pour le déploiement

**Fait — nouveaux fichiers** :
- `Dockerfile` : build multi-stage. Stage 1 (`node:24-alpine`, aligné sur la version Node locale) : `npm ci` puis `npm run build`. Stage 2 (`nginx:1.27-alpine`) : sert uniquement `dist/` — pas de runtime Node dans l'image finale (image finale ~40 Mo au lieu de plusieurs centaines). `HEALTHCHECK` intégré (`wget` sur `/`, `busybox` déjà présent dans l'image alpine).
- `docker/nginx.conf` : gzip, en-têtes de sécurité (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`), cache long (`expires 1y`) sur `/assets/` (fichiers hashés par Vite, sûrs à cacher indéfiniment), `expires -1` sur `index.html` (jamais caché, pour que chaque déploiement soit visible immédiatement), fallback `try_files ... /index.html` pour le routing.
- `docker-compose.yml` : service unique, port `8080:80`, healthcheck, commentaire pour l'usage derrière un reverse proxy (Traefik/Coolify/nginx).
- `.dockerignore` : exclut `node_modules`, `dist`, `.git`, `docs`, `.claude`, `.gstack`, etc. du contexte de build.

**Bug trouvé et corrigé pendant les tests** : la première version de `nginx.conf` utilisait `add_header Cache-Control ...` dans `location /assets/` et `location = /index.html`. Or nginx **remplace** (ne fusionne pas) les `add_header` hérités du niveau `server` dès qu'un `location` déclare son propre `add_header` — résultat : les 3 en-têtes de sécurité disparaissaient silencieusement sur ces deux emplacements (vérifié avec `curl -sD -` sur le conteneur réellement démarré). **Corrigé** en remplaçant `add_header Cache-Control` par la directive `expires` (qui ne déclenche pas ce comportement de remplacement), ce qui règle le problème sans avoir à dupliquer les en-têtes de sécurité dans chaque `location`.

**Vérifié en conditions réelles** (`docker build` + `docker run`, pas seulement une relecture du Dockerfile) :
- Build de l'image : réussi (le stage Node exécute `npm ci` puis `npm run build` sans erreur, résultat identique au build local).
- `GET /` → 200, `Cache-Control: no-cache`, les 3 en-têtes de sécurité présents.
- `GET /assets/index-*.js` → 200, `Cache-Control: max-age=31536000`, en-têtes de sécurité présents.
- `GET /robots.txt` et `/sitemap.xml` → 200, contenu correct.
- `GET /chemin/inexistant` → 200 (fallback `try_files` vers `index.html`, comportement correct pour une SPA même si le routing actuel n'utilise que des ancres).
- `HEALTHCHECK` du conteneur → `healthy` après le `start_period`.
- Image de test supprimée après vérification (`docker rmi`).

**Ouvert / à décider par l'utilisateur avant un déploiement réel** :
- Le port hôte dans `docker-compose.yml` (`8080:80`) est un choix par défaut à adapter selon l'infrastructure cible.
- Si déploiement derrière un reverse proxy existant (Traefik, Coolify, etc. — cohérent avec l'infra Odoo déjà utilisée par ailleurs), retirer le mapping de port et brancher les labels/règles de routage appropriés (non ajoutés ici, dépend de la config du reverse proxy en place, non connue).
- HTTPS/TLS non géré dans cette image (attendu : délégué à un reverse proxy en amont, pratique standard).

---

## 2026-07-27 (suite 8) — Nettoyage du code mort et des dépendances inutilisées

**Contexte** : nettoyage demandé du scaffold Figma Make jamais nettoyé (constat détaillé dans `docs/AUDIT.md` §3.2), avec vérification systématique par recherche d'import avant toute suppression.

**Divergence trouvée et signalée avant d'agir** : la demande mentionnait de garder `accordion.tsx` car "utilisé par la section FAQ". Vérification faite : **aucune section FAQ n'existe dans `App.tsx`**, et `accordion.tsx` n'est importé nulle part (ni par `App.tsx`, ni par aucune des sections ajoutées récemment). Question posée à l'utilisateur, qui a confirmé de supprimer `accordion.tsx` aussi.

**Fait — suppression de fichiers** (après recherche d'import confirmant zéro référence dans `src/`, y compris dans les nouvelles sections Pour KumpaX / Notre approche / Domaines d'expertise / Notre impact en chiffres) :
- `src/app/components/ui/` entier (48 fichiers shadcn/ui, dont `accordion.tsx`).
- `src/app/components/figma/ImageWithFallback.tsx`.
- `src/imports/image.png`.
- `src/styles/globals.css`.
- Dossiers `src/app/components/` et `src/imports/` retirés (devenus vides).

**Fait — nettoyage `package.json`** : suppression de toutes les dépendances confirmées inutilisées par recherche d'import dans `App.tsx`/`main.tsx` : `@emotion/react`, `@emotion/styled`, `@mui/material`, `@mui/icons-material`, `@popperjs/core`, tout `@radix-ui/*` (y compris `react-accordion`, plus nécessaire), `canvas-confetti`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-dnd` + `react-dnd-html5-backend`, `react-hook-form`, `react-router`, `react-slick`, `react-resizable-panels`, `react-responsive-masonry`, `recharts`, `sonner`, `vaul`.
- **Allé au-delà de la liste explicite fournie** : `motion`, `react-day-picker`, `react-popper`, `class-variance-authority`, `clsx`, `tailwind-merge` ne figuraient pas dans la liste donnée par l'utilisateur (probablement un oubli de recopie de l'audit initial), mais la vérification par recherche d'import a confirmé qu'ils étaient eux aussi totalement inutilisés une fois `src/app/components/ui/` supprimé (c'était leur seul consommateur). Retirés également, conformément à l'esprit du point 5 de la demande ("vérifie que chaque élément n'est vraiment utilisé nulle part").
- Dépendances conservées : `lucide-react`, `react-icons`, `tw-animate-css`.

**Effet de bord détecté et corrigé** : après `npm i`, le build échouait (`Rollup failed to resolve import "react-dom/client"`). Cause : `react`/`react-dom` étaient déclarés en `peerDependencies` (convention du scaffold Figma Make, où l'hôte fournissait React) et n'étaient installés dans `node_modules` que parce que d'autres dépendances (MUI, Radix...) les déclaraient elles-mêmes comme peer — en les retirant, plus rien ne déclenchait leur installation. **Corrigé** en déplaçant `react` et `react-dom` (18.3.1) de `peerDependencies`/`peerDependenciesMeta` vers `dependencies`, ce qui est de toute façon la bonne pratique pour une application autonome (par opposition à une librairie partagée).

**Vérifié** :
- `npm i` : 200 paquets supprimés de `node_modules`.
- `npm run build` : passe sans erreur. Bundle CSS réduit de ~105 Ko à ~39 Ko (Tailwind ne scanne plus les classes des composants supprimés). Bundle JS inchangé (~223 Ko) — le tree-shaking de Vite excluait déjà ce code mort du bundle final avant même le nettoyage.
- `npm audit` : 1 vulnérabilité haute restante, sur `vite` lui-même (dev server, plusieurs CVE de traversée de chemin/lecture de fichiers). Corrigeable via `npm audit fix --force` mais installerait `vite@6.4.3`, hors de la plage figée par le `pnpm.overrides` du projet (`6.3.5`) — **non touché**, décision à prendre par l'utilisateur.
- Git : toujours aucun dépôt initialisé dans ce dossier — pas de commit possible (instruction conditionnelle, confirmé avant d'agir).

**Fait — documentation** : `docs/AUDIT.md` mis à jour (résumé exécutif, §2 gestionnaire de paquets, §3 architecture + §3.2 réécrite en "nettoyé", §4.2/4.3 marqués résolus, §7 tableau de recommandations avec statuts).

**Ouvert** :
- `pnpm-workspace.yaml` existe toujours alors que le projet est installé/buildé avec npm — incohérence mineure non résolue (à trancher : retirer le fichier ou migrer réellement vers pnpm).
- La vulnérabilité `vite` (dev-only) reste à traiter si l'utilisateur veut bumper la version.
- Tous les points encore ouverts de l'audit (formulaire de contact, git init, tsconfig, découpage de `App.tsx`, pages légales, numéro de téléphone réel, image og:image) restent inchangés — voir `docs/AUDIT.md` §7.

---

## 2026-07-27 (suite 7) — Harmonisation des coordonnées de contact

**Fait (`src/app/App.tsx`)** :
- **Email unifié** : `hello@kumpax.com` (footer, colonne Contact) → `contact@kumpax.com`. Un seul email "officiel" dans tout le fichier désormais. `alexis@kumpax.com` (email personnel fictif d'un membre de l'équipe dans le mock UI KumpaCard) laissé tel quel — ce n'est pas l'email général du site, hors du périmètre de la demande.
- **Téléphone placeholder `+237 6XX XXX XXX`** : non remplacé (aucune valeur inventée). Un commentaire TODO explicite ajouté juste au-dessus des 3 occurrences : mock UI KumpaCard (commentaire JS `//`, dans un littéral de tableau), section Contact (commentaire JSX `{/* */}`), footer (commentaire JSX `{/* */}`).
- **Réseaux sociaux** :
  - Section Contact : les 3 icônes (LinkedIn, X, Instagram) étaient toutes en `href="#"` sans exception — bloc entier retiré proprement (le retrait ne casse pas la mise en page, juste une colonne de contact un peu plus courte).
  - Footer : le tableau `[Linkedin, Twitter, Mail]` était aussi entièrement en `href="#"`. LinkedIn et Twitter retirés (aucune URL réelle). **Décision pour l'icône Mail, à valider** : plutôt que de la supprimer aussi, je l'ai transformée en lien fonctionnel `href="mailto:contact@kumpax.com"` — ce n'est pas un réseau social à proprement parler, et contrairement à LinkedIn/Twitter on a déjà une vraie destination (l'email qu'on vient d'harmoniser) juste à côté dans le même footer. Si tu préfères la retirer complètement plutôt que la convertir, dis-le-moi.
  - Imports `Linkedin`, `Twitter`, `Instagram` retirés de `lucide-react` (devenus inutilisés après ces suppressions) — seul `Mail` reste, déjà utilisé ailleurs dans le fichier.
  - Liens légaux du footer (Confidentialité, CGU, Mentions légales, toujours en `href="#"`) **non touchés** — ce ne sont pas des réseaux sociaux, hors périmètre de cette demande.

**Vérifié** : `npm run build` passe sans erreur.

**Ouvert** :
- Confirmer si la conversion de l'icône Mail du footer en `mailto:contact@kumpax.com` convient, ou si tu préfères la retirer comme les autres.
- Les 3 TODO téléphone restent à traiter avant mise en production (numéro réel à fournir).

---

## 2026-07-27 (suite 6) — Préparation SEO pour mise en production sur kumpax.com

**Contexte** : le site doit passer en production publique sur kumpax.com. Demande limitée au SEO/meta (`index.html`, `robots.txt`, `sitemap.xml`) — design et contenu de page non touchés.

**Fait (`index.html`)** :
- Retiré `<meta name="robots" content="noindex, nofollow">` — la page pourra désormais être indexée.
- Ajouté `<link rel="canonical" href="https://kumpax.com/" />`.
- Ajouté les meta Open Graph : `og:title`, `og:description` (rédigés en français, cohérents avec le contenu réel : 4 SaaS KumpaX Store/VisitApp/MaxImmo/KumpaCard + intégration Odoo + présence Afrique), `og:url` (`https://kumpax.com/`), `og:type` (`website`).
- Ajouté les Twitter Card : `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`.
- **`og:image` / `twitter:image` non ajoutés** — laissés en commentaire avec un TODO explicite : `src/imports/image.png` (876×637px) est la seule image du projet, mais c'est une capture d'écran non brandée d'une ancienne variante du formulaire de contact (fond sombre, adresse "Dakar, Sénégal" au lieu de Yaoundé — incohérente avec le contenu actuel), inutilisée dans le code, impropre à un partage social. **À signaler à l'utilisateur** : il faut fournir/créer une image dédiée (1200×630px recommandé) avant de décommenter ces balises.

**Fait (nouveaux fichiers)** :
- `public/robots.txt` : autorise l'indexation (`Allow: /`) et référence `https://kumpax.com/sitemap.xml`.
- `public/sitemap.xml` : liste la page d'accueil (`https://kumpax.com/`) avec `lastmod`, `changefreq`, `priority`.
- Vérifié après `npm run build` que les deux fichiers sont bien copiés tels quels dans `dist/` (comportement standard de Vite pour le dossier `public/`).

**Signalé, non modifié (hors du périmètre demandé)** :
- **Favicon absent** : aucun fichier favicon n'existe dans le projet, et `index.html` n'en référence aucun (les navigateurs retomberont sur une requête par défaut `/favicon.ico`, qui échouera silencieusement). À fournir/créer si souhaité.
- **`<title>` de la page** toujours "Premium SaaS Showcase Website" (résidu de l'export Figma Make) et `<meta name="description">` toujours en anglais — tous deux comptent pour le référencement organique (snippet Google) mais n'étaient pas dans la liste des 6 points demandés ; non touchés pour respecter le périmètre, mais à corriger avant mise en production réelle.

**Vérifié** : `npm run build` passe sans erreur ; `robots.txt` et `sitemap.xml` confirmés présents dans `dist/` après build.

**Ouvert** :
- Fournir une image `og:image`/`twitter:image` (1200×630px) pour activer le partage social avec aperçu visuel.
- Décider si le favicon, le `<title>`, et le `<meta name="description">` (actuellement en anglais et générique) doivent être corrigés avant la mise en ligne réelle.

---

## 2026-07-27 (suite 5) — Nouvelle section "Notre approche" (timeline 6 étapes) + token turquoise

**Contexte** : demande basée sur une maquette fournie (`D:\img_dsc\kumpax_vitrine.png`) — eyebrow "NOTRE APPROCHE", titre, sous-titre, timeline horizontale à 6 étapes numérotées reliées par une ligne dégradée primary→turquoise.

**Fait — `src/styles/theme.css`** :
- Ajout du token `--turquoise: #22D3EE` (cyan vif), dans `:root` **et** dans `.dark` (pour rester cohérent si un mode sombre est activé un jour), plus mappage `--color-turquoise: var(--turquoise)` dans le bloc `@theme inline` pour que Tailwind génère les utilitaires (`bg-turquoise`, `text-turquoise`, etc.). Vérifié dans le CSS compilé que `--turquoise:#22d3ee` est bien présent.
- Aucune autre couleur n'existait déjà pour ce rôle (l'`--accent` existant, `#3B5BFF`, est un bleu-violet, pas un turquoise/cyan) — nouvelle variable strictement nécessaire, ajoutée en cohérence avec le nommage existant du fichier.

**Fait — `src/app/App.tsx`** :
- **Placement retenu** : entre `#pour-kumpax` et `#solutions`, comme suggéré par l'utilisateur (cohérent : confiance → méthode de travail → produits).
- Nouveau composant `<section id="approche" className="bg-background">` avec eyebrow "Notre approche", titre "Une méthode éprouvée, du concept au support", sous-titre "Six étapes claires pour transformer vos idées en solutions digitales opérationnelles." — texte fourni par l'utilisateur, repris tel quel.
- Tableau `APPROACH_STEPS` (6 entrées : Découverte, Analyse, Conception, Développement, Déploiement, Support), chacune avec une description courte **rédigée par Claude, à valider** :
  1. Découverte : « Un échange pour cerner vos objectifs, vos contraintes et vos priorités. »
  2. Analyse : « Une étude approfondie de vos besoins pour cadrer la solution idéale. »
  3. Conception : « La maquette et l'architecture de votre solution prennent forme. »
  4. Développement : « Nos équipes construisent votre solution, avec des points d'étape réguliers. »
  5. Déploiement : « Votre solution est mise en ligne et vos équipes sont formées. »
  6. Support : « Un accompagnement continu pour faire évoluer votre solution sereinement. »
- Fonction utilitaire `mixHex(hexA, hexB, t)` : interpole entre deux couleurs hex pour teinter chaque cercle d'étape en cohérence avec la position de la ligne dégradée à cet endroit (cercle 1 plus proche du bleu `--primary`, cercle 6 plus proche du turquoise). Constantes `APPROACH_GRADIENT_FROM`/`APPROACH_GRADIENT_TO` dupliquent volontairement les valeurs hex de `--primary`/`--turquoise` (JS ne peut pas lire une valeur `var()` CSS sans `getComputedStyle`) — commentaire ajouté dans le code pour signaler cette dépendance si les tokens changent un jour.
- **Deux structures DOM distinctes pour le responsive**, chacune avec ses propres `<Reveal>` :
  - `hidden lg:block` : timeline horizontale, `grid grid-cols-6`, ligne de connexion en `position: absolute` avec `background: linear-gradient(to right, var(--primary), var(--turquoise))`, positionnée à `left-[8.333%] right-[8.333%]` pour relier exactement le centre du 1er cercle au centre du 6e (colonnes égales, sans gap qui aurait faussé le calcul).
  - `lg:hidden` : timeline verticale, ligne `linear-gradient(to bottom, ...)`, étapes empilées avec `space-y-8`, cercle + titre + description côte à côte.
- **Effet de révélation séquentielle (bonus demandé)** : le composant `Reveal` (déjà utilisé partout ailleurs) a été étendu avec une prop optionnelle `delayMs` (`style={{ transitionDelay }}`), rétrocompatible (aucun changement pour les usages existants qui ne la passent pas). Chaque étape est enveloppée dans son propre `<Reveal delayMs={i * 100}>`, imbriqué dans le `<Reveal>` englobant l'en-tête de section — donne un effet de cascade (étape 1 apparaît, puis 2 100ms après, etc.) tout en réutilisant le même mécanisme IntersectionObserver + garde `prefers-reduced-motion` déjà en place (pas de nouveau code de gestion du motion réduit nécessaire).
- Couleurs de structure sur tokens `theme.css` (`bg-background`, `bg-secondary`, `text-primary`, `text-foreground`, `text-muted-foreground`, `bg-card`) ; seule la ligne et les cercles utilisent le dégradé primary→turquoise comme demandé.

**Vérifié** : `npm run build` passe sans erreur.

**Ouvert** :
- Les 6 descriptions d'étapes sont des propositions à valider/reformuler.
- Vérification visuelle toujours en attente (outil de QA navigateur, cf. entrées précédentes) — en particulier pour confirmer que le dégradé de couleur par cercle rend bien comme sur la maquette fournie.

---

## 2026-07-27 (suite 4) — Nouvelle section "Notre impact en chiffres" (compteurs animés)

**Fait (`src/app/App.tsx`)** :
- **Titre de section proposé** : "Notre impact en chiffres" (au lieu de "Nos réalisations" suggéré par l'utilisateur, qui avait invité une alternative plus percutante) — **à valider/ajuster**.
- Nouvelle `<section id="impact" className="bg-primary">` insérée juste avant `#equipe` (Notre équipe), fond `--primary` plein (bleu KumpaX) pour bien se détacher visuellement du reste de la page, comme demandé.
- Tableau `IMPACT_STATS` (5 entrées, icônes déjà importées — `Package`, `Headphones`, `Zap`, `Settings`, `Globe`, aucun nouvel import) :
  - 10+ — Projets livrés
  - 7/7 j — Support disponible
  - 5+ — Solutions innovantes
  - 3+ ans — Expertise ERP
  - 4 — Pays de déploiement
- Chaque stat a un `value` numérique animable et un `suffix` statique. Pour les valeurs composites, seule la partie numérique pertinente compte de 0 jusqu'à sa cible, le reste reste fixe : "7/7 j" anime le premier 7 (le `/7 j` est le suffixe statique), "3+ ans" anime le 3 (`+ ans` en suffixe statique).
- Nouveau composant `AnimatedStat` (à côté de `Reveal`, même philosophie) : IntersectionObserver propre au composant (déclenchement une seule fois, `threshold: 0.4`), puis boucle `requestAnimationFrame` avec easing ease-out quadratique (`1-(1-p)²`) sur 1000ms (dans la fourchette 800-1200ms demandée) pour compter de 0 à la valeur cible.
- **`prefers-reduced-motion: reduce`** : si activé, le composant affiche directement la valeur finale sans lancer la boucle d'animation (vérifié via `matchMedia`, même garde que `Reveal`).
- Couleurs 100% sur tokens `theme.css` : `bg-primary` (fond de section), `text-primary-foreground` (chiffres, icônes, titre), `text-primary-foreground/60` (libellés), `bg-primary-foreground/10` (cercle d'icône) — vérifié dans le CSS compilé que ces classes résolvent bien vers `var(--primary)` / `var(--primary-foreground)`.
- Layout responsive : `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` (2 colonnes mobile → 3 tablette → 5 colonnes desktop), pas de scroll horizontal nécessaire à ce nombre d'éléments.
- Toute la section est enveloppée dans `<Reveal>` (même fade-in au scroll que les autres sections) — donc à l'entrée dans le viewport, le fondu ET le compteur se déclenchent quasi simultanément (deux observers indépendants sur la même zone).

**Vérifié** : `npm run build` passe sans erreur.

**Ouvert** :
- Valider le titre "Notre impact en chiffres" (ou revenir à "Nos réalisations" tel quel, ou une autre variante).
- Vérification visuelle de l'animation de comptage dans un navigateur toujours en attente (cf. entrée précédente sur le blocage de l'outil de QA visuelle).

---

## 2026-07-27 (suite 3) — Nouvelle section "Domaines d'expertise" + react-icons

**Fait** :
- Installé `react-icons` (^5.7.0), seule nouvelle dépendance ajoutée dans cette session, explicitement demandée par l'utilisateur pour afficher des logos officiels de technologies (`react-icons/si` = Simple Icons).
- Import ciblé de 9 icônes uniquement (pas d'import global du module) : `SiJavascript, SiReact, SiTypescript, SiAngular, SiNodedotjs, SiMongodb, SiDocker, SiPython, SiDjango`. Noms vérifiés dans `node_modules/react-icons/si/index.d.ts` avant usage.
- **Titre de section proposé** : "Domaines d'expertise" (au lieu du "Domaines de compétences" suggéré par l'utilisateur, qui avait explicitement invité une alternative plus percutante) — **à valider/ajuster**.
- Nouvelle `<section id="expertise">` insérée entre `#solutions` et `#services` (après la vitrine produits, avant l'intégration Odoo) dans `src/app/App.tsx` :
  1. **Bloc "Développement & langages"** : tableau `DEV_SKILLS` (9 entrées, logo + nom), grille responsive `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`. Les logos utilisent leurs couleurs de marque officielles (ex. `#F7DF1E` JavaScript, `#61DAFB` React...) — volontairement **hors tokens `theme.css`**, car recolorer un logo de marque avec la couleur primaire du site le rendrait méconnaissable ; tout le reste (fond de carte, bordure, texte) reste sur les tokens.
  2. **Bloc "Science des données & IA"** et **3. "Collecte de données"** : cartes `DOMAIN_CARDS` avec icône générique lucide-react déjà importée (`BarChart3`, `Search`), titre, description courte rédigée par Claude — **à valider** :
     - Science des données & IA : « De l'analyse prédictive aux modèles d'intelligence artificielle sur mesure, nous transformons vos données en décisions. »
     - Collecte de données : « Des pipelines fiables pour capter, structurer et fiabiliser la donnée, quelle que soit sa source. »
- Couleurs de la structure (hors logos de marque) sur tokens `theme.css` : section `bg-white` (séparation nette après le dernier bloc produit en `#F7F8FC` et avant la section Odoo sombre), cartes `bg-muted border border-border` (au lieu de `bg-card`, pour qu'elles se détachent visuellement d'une section blanche — même logique que l'encart "Cas d'usage" déjà présent ailleurs dans le fichier, mais via le token `--muted`), icônes génériques sur `bg-secondary`/`text-primary`.
- Même logique d'animation que les sections précédentes : `<Reveal>` (IntersectionObserver, respect de `prefers-reduced-motion`), + hover lift 300ms sur les badges et les cartes.

**Vérifié** : `npm run build` passe (bundle JS +~17 Ko gzip pour les 9 icônes importées individuellement — confirme que le tree-shaking a bien évité d'embarquer tout `react-icons`).

**Ouvert** :
- Valider le titre "Domaines d'expertise" (ou repartir sur "Domaines de compétences" tel quel, ou une autre variante).
- Valider/reformuler les 2 descriptions de blocs (Science des données & IA / Collecte de données).

---

## 2026-07-27 (suite 2) — Nouvelle section "Pour KumpaX"

**Fait (`src/app/App.tsx`)** :
- Ajout d'un tableau `TRUST_POINTS` (4 entrées) juste après `STATS` : Expertise technologique (icône `Code2`), Solutions innovantes (`Zap`), Support réactif (`Headphones`), Technologies modernes (`Globe`) — les 4 icônes étaient déjà importées et utilisées ailleurs dans le fichier (section Odoo/Services), aucun nouvel import ajouté.
- Taglines rédigées par Claude à titre de proposition, à valider/ajuster par l'utilisateur :
  - Expertise technologique : « Une maîtrise technique solide, au service de vos ambitions. »
  - Solutions innovantes : « Des solutions innovantes qui anticipent les besoins de demain. »
  - Support réactif : « Un support réactif, présent à chaque étape de votre projet. »
  - Technologies modernes : « Des technologies modernes, robustes et pensées pour durer. »
- Nouvelle section `<section id="pour-kumpax">` insérée entre la fermeture du hero (`#accueil`) et le début de `#solutions` : eyebrow "Pourquoi KumpaX", titre `<h2>` **"Pour KumpaX"** (gardé tel quel, non reformulé), sous-titre court, puis grille de 4 cartes (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, mêmes breakpoints que la section Équipe) — responsive 1/2/4 colonnes comme demandé.
- Couleurs : entièrement construite avec les utilitaires Tailwind adossés aux tokens de `src/styles/theme.css` (`bg-background`, `bg-card`, `border-border`, `bg-secondary`, `text-primary`, `text-foreground`, `text-muted-foreground`) plutôt qu'avec des couleurs hexadécimales en dur — contrairement au reste du fichier qui utilise des hex arbitraires (`#1234B0`, etc.) correspondant aux mêmes valeurs. Vérifié dans le CSS compilé (`dist/assets/*.css`) que ces classes résolvent bien vers `var(--primary)`, `var(--secondary)`, `var(--border)`, etc. — aucune nouvelle couleur introduite.
- Animation : section enveloppée dans `<Reveal>` (même composant/logique IntersectionObserver que la session précédente), + léger hover lift (`hover:-translate-y-1`, 300ms via le default-transition-duration déjà homogénéisé) sur chaque carte.

**Vérifié** : `npm run build` passe sans erreur.

**Ouvert** :
- Les 4 taglines sont des propositions à valider/reformuler par l'utilisateur.
- Le sous-titre et l'eyebrow ("Pourquoi KumpaX") sont aussi des ajouts de rédaction libre pour rester cohérent avec le pattern des autres sections (eyebrow + h2 + sous-titre) — à ajuster si besoin.

---

## 2026-07-27 (suite) — Animations légères + mise à jour de la carte de présence

**Contexte** : suite à la session d'audit, décision utilisateur de finir le design frontend avant de brancher boutons/formulaires (backend). Deux changements demandés dans cette session : mise à jour de la carte de présence Afrique du hero, puis ajout d'animations légères.

**Fait — carte de présence (`AfricaMapVisual` dans `src/app/App.tsx`)** :
- Remplacé les 5 villes précédentes (Le Caire, Dakar, Lagos, Nairobi, Johannesburg) par les 4 nouveaux pays de présence demandés : Dakar (Sénégal), Banjul-Serrekunda (Gambie), Conakry (Guinée), Kinshasa (RD Congo).
- Coordonnées SVG recalculées de façon géographiquement cohérente (Sénégal/Gambie/Guinée alignés sur la côte ouest, du nord au sud ; Kinshasa positionné au sud-est du HQ Yaoundé).
- **Ajustement manuel nécessaire et fait** : la position initiale de Kinshasa (92, 175) chevauchait l'étiquette blanche "KumpaX · Yaoundé" — déplacée à (95, 190) pour éviter la collision visuelle.
- Mis à jour le chiffre "5 pays" → "4 pays" dans l'encart flottant "Présence" du même composant, pour rester cohérent avec les 4 points désormais affichés.
- **Non touché, à surveiller** : le tableau `STATS` (bandeau de confiance du hero, plus haut dans le fichier) affiche toujours "5" pour "Pays" et "5" pour "Plateformes" (alors qu'il n'y a que 4 produits) — incohérences pré-existantes, hors du périmètre demandé, à trancher par l'utilisateur.

**Fait — animations légères (CSS natif / Tailwind uniquement, aucune dépendance ajoutée)** :
- `src/styles/tailwind.css` : ajout d'un bloc `@theme { --default-transition-duration: 300ms; }` qui homogénéise en un seul endroit la durée de **toutes** les transitions Tailwind existantes (`transition-colors`, `transition-all`, `transition-transform`) déjà utilisées sur les boutons, liens et cartes — remplace le défaut Tailwind de 150ms sans toucher aux dizaines de classes une par une.
- Ajout des classes `.reveal` / `.reveal-visible` (fade-in + `translateY(20px)→0`, 600ms ease-out) pour l'apparition au scroll.
- Ajout d'un bloc `@media (prefers-reduced-motion: reduce)` qui neutralise totalement `.reveal` (contenu visible immédiatement) et écrase `transition-duration`/`animation-duration` à 0.01ms sur `*` — respect impératif de la préférence système.
- `src/app/App.tsx` : nouveau composant `Reveal` (hook `IntersectionObserver` interne, pas de librairie tierce) qui bascule la classe `reveal-visible` dès qu'un bloc entre dans le viewport ; bascule aussi immédiatement à `visible=true` sans observer si `matchMedia("(prefers-reduced-motion: reduce)")` est vrai (double protection avec le CSS).
- `<Reveal>` appliqué à : l'intro de la section Solutions, chacun des 4 blocs produits, la section Odoo/Services, la section Équipe, la section Contact. Le hero n'est pas animé (déjà chargé au premier écran), le footer non plus (faible valeur ajoutée).
- Ajouté un léger hover "lift" (`hover:-translate-y-1`, 300ms via le nouveau défaut) sur les mock UI produits (Store/VisitApp/MaxImmo/KumpaCard), qui n'avaient aucune interaction au survol auparavant.
- Corrigé une incohérence trouvée en homogénéisant : le lien du menu mobile n'avait pas de `transition-colors` contrairement à son équivalent desktop — ajouté.
- **Vérifié** : `npm run build` passe sans erreur après ajout (build Vite terminé en ~1.3s, aucun warning nouveau).
- **Non vérifié visuellement dans un navigateur** au moment de la rédaction de cette entrée — l'installation du binaire Chromium headless nécessaire à l'outil de QA visuelle était en cours en arrière-plan. À vérifier visuellement dès que possible (responsive, dark mode navigateur, `prefers-reduced-motion` activé).

**Ouvert** :
- Décider si `STATS` (bandeau confiance hero) doit aussi passer de "5" à "4" pays, et si "5 Plateformes" doit devenir "4".
- Valider visuellement le rendu des animations et de la nouvelle carte une fois le test navigateur possible.

---

## 2026-07-27 — Audit initial + mise en place de la documentation

**Contexte** : Premier passage de Claude Code sur ce projet. Aucun dépôt git, aucune documentation de contexte n'existait encore.

**Fait** :
- Audit complet du code physique du projet (lecture de `App.tsx`, `package.json`, `vite.config.ts`, `index.html`, styles, structure `src/`).
- Rédaction de [`docs/AUDIT.md`](AUDIT.md) : constat détaillé (monolithe `App.tsx` de ~1160 lignes, 48 composants shadcn/ui et ~35 dépendances non utilisées, formulaire de contact non fonctionnel, SEO désactivé via `noindex, nofollow`, absence de git/lockfile/lint/tests).
- Création de `CLAUDE.md` à la racine du projet (chargé automatiquement par Claude Code en début de session) qui référence `docs/AUDIT.md` et ce fichier.

**Constats clés à retenir pour la suite** :
- Le projet est un export Figma Make jamais nettoyé après export.
- Le formulaire de contact affiche un succès mais n'envoie rien nulle part — c'est le point le plus urgent si le site doit recevoir de vrais visiteurs.
- Pas de dépôt git — à initialiser dès que l'utilisateur est prêt à versionner le travail.

**Ouvert / décisions à prendre par l'utilisateur** :
- Garder ou nettoyer les composants shadcn/ui et dépendances inutilisées ?
- Quel service utiliser pour le formulaire de contact (backend propre, ou service tiers) ?
- Faut-il initialiser git maintenant ?

---

<!-- Nouvelle entrée : copier le gabarit ci-dessous en haut de la liste (ordre antichronologique) -->
<!--
## AAAA-MM-JJ — Titre court de la session

**Fait** :
-

**Décisions** :
-

**Ouvert** :
-
-->
