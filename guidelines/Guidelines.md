# KumpaX — Design System (page hub du groupe)

Ce document décrit le design system de **KumpaX**, la page mère (holding invisible) qui présente le groupe et redirige vers ses produits (KumpaStore, prestations de services, WhatsApp, réseaux sociaux, autres produits digitaux comme VisitApp/MaxImmo déjà mockés dans cette page).

Portée : ce fichier couvre uniquement le **hub Kumpax**. Chaque filiale (KumpaStore en premier) aura son propre fichier de guidelines qui hérite de ces fondations et ajoute ses spécificités.

---

## 1. Principes généraux

* Le visiteur ne doit jamais sentir un changement d'univers radical en passant du hub à une filiale — mais doit comprendre qu'il "passe à autre chose" (transition de marque douce, pas de rupture de style).
* Le ton visuel cible : **confiance/institutionnel** + **accessible/populaire**, tout en restant **moderne**. En pratique : formes arrondies plutôt qu'anguleuses, couleurs franches mais pas criardes, hiérarchie claire, pas de jargon visuel technique.
* Cible : tout public, tout âge majeur, tous supports (mobile prioritaire, mais le rendu desktop doit rester tout aussi soigné — pas de version "dégradée").
* Priorité de performance : chargement très rapide, images compressées et en formats modernes (WebP/AVIF), lazy-loading systématique hors zone visible initiale.
* Cette version 1 est bilingue **FR / EN**, avec un sélecteur de langue élégant et visible (voir section 8).
* Aucun montant/prix n'apparaît sur le hub Kumpax (les prix vivent dans les filiales, ex. KumpaStore).
* Refactorer au fur et à mesure, garder les fichiers courts, séparer composants et fonctions utilitaires dans leurs propres fichiers.
* Utiliser flexbox/grid en priorité ; le positionnement absolu seulement quand c'est réellement nécessaire (décorations, superpositions de mockups).

---

## 2. Marque & logo

* Logo disponible en plusieurs variantes : couleur sur fond clair, version bleue, et versions fond transparent (`kumpax-logo.png`, `kumpax-logo-blue.png`, `kumpax_logo-removebg.png`). Utiliser systématiquement la version transparente quand le fond n'est pas blanc pur.
* Le logo reste inchangé sur toutes les pages du groupe — c'est l'élément d'ancrage visuel qui rassure sur "on est toujours chez Kumpax" même en changeant de filiale.
* Zone de protection minimale autour du logo : ne jamais coller de texte ou d'élément UI à moins d'une hauteur du "K" du logo.
* Le logo garde son dégradé bleu (`#1234B0` → `#3B5BFF`) caractéristique du croisement de traits — ne pas le recolorer par filiale, c'est l'élément stable du groupe.

---

## 3. Couleurs

Tokens définis dans `src/styles/theme.css`. Ce sont les couleurs **du groupe**, communes à toutes les filiales.

| Token | Valeur | Usage |
|---|---|---|
| `--primary` | `#1234B0` | Couleur de marque principale — CTA primaires, liens actifs, logo |
| `--accent` | `#3B5BFF` | Bleu vif — éléments interactifs secondaires, dégradés avec primary |
| `--turquoise` | `#22D3EE` | Touche moderne/tech — accents décoratifs, highlights, jamais en texte long |
| `--secondary` | `#EEF1FF` | Fond de zones secondaires, badges discrets |
| `--muted` / `--muted-foreground` | `#EAECF4` / `#6B7491` | Texte/fond de faible emphase (légendes, métadonnées) |
| `--destructive` | `#d4183d` | Erreurs uniquement |
| `--background` | `#F7F8FC` | Fond de page par défaut |
| `--foreground` | `#080C1E` | Texte principal, quasi-noir (pas de noir pur, plus doux) |

**Sémantique standard** (conservée) : vert = succès, rouge/`destructive` = erreur, orange/jaune = alerte, bleu = information.

**Règle multi-filiale** : chaque filiale pourra définir un token d'accent supplémentaire qui vient se superposer aux couleurs du groupe. La structure est préparée dans `theme.css` (`.brand-kumpastore`, `.brand-services`...) mais **les valeurs sont volontairement laissées à définir** : ce choix est reporté au design system dédié de KumpaStore, à traiter dans une prochaine session. Ces accents ne remplaceront jamais `--primary` : ils s'ajouteront en touche, pour garder la cohérence groupe.

---

## 4. Typographie

**Deux polices seulement**, choisies pour se répondre par contraste plutôt que par accumulation — toutes deux en Google Fonts (libres d'usage commercial, aucune licence à acheter — voir `src/styles/fonts.css`) :

1. **`--font-title`** (Merienda, variable) — réservée aux **plus gros titres : H1 et H2** (hero, titres de section) et au **wordmark "KumpaX" du header**, toujours en gras (H1 800, H2 700, logo `font-black`/900). Manuscrite/arrondie, à empattements doux — c'est la police "de marque", pensée pour se remarquer, pas pour la lecture continue. Volontairement absente de tout ce qui doit rester très lisible en petit (sous-titres, paragraphes, UI).
2. **`--font-ui`** / **`--font-body`** (Inter, variable — deux noms de rôle pour la même famille, gardés séparés dans le code pour la clarté sémantique UI vs. texte courant, pas pour charger une police de plus) — **tout le reste** : sous-titres H3/H4, paragraphes/descriptions, boutons, navigation, labels, badges. Neutre et très lisible à toutes les tailles, y compris en petit sur mobile — c'est elle qui porte la lecture, jamais la police de marque.

Le contraste entre les deux vient de leur nature (expressive vs. neutre) et de leur usage tranché (gros titres/logo vs. tout le reste), pas d'un empilement de rôles supplémentaires — ne pas réintroduire une 3e police sans repasser par cette section.

*(Note historique : les pistes initiales "Awesome" et "Moren" repérées sur 1001Fonts étaient sous licence "Free For Personal Use", non utilisables commercialement sans achat ; Winky Sans puis Fraunces/Outfit/Lora ont aussi été essayées avant de converger sur ce système à 2 polices. Décision prise : rester sur des polices Google Fonts gratuites et sans contrainte de licence.)*

Échelle actuelle conservée (via Tailwind/shadcn) : `--text-2xl` (H1), `--text-xl` (H2), `--text-lg` (H3), `--text-base` (corps, boutons, labels).

---

## 5. Espacement, rayons, mode sombre

* Rayons de bordure : jamais de coin carré. Utiliser l'échelle existante `--radius-sm/md/lg/xl` (base `0.625rem`). Les boutons, cartes et champs de formulaire doivent tous avoir un radius visible et cohérent entre eux.
* Grille : container avec largeur max raisonnable pour rester lisible sur grand écran (éviter les lignes de texte de plus de ~75 caractères) ; padding généreux sur mobile pour "aérer" comme demandé.
* **Mode par défaut : clair.** Le mode sombre existe déjà en variables CSS (`.dark` dans `theme.css`) mais n'est pas encore branché à un sélecteur utilisateur — à prévoir (toggle dans le header, à côté du sélecteur de langue) lors d'une prochaine itération.

---

## 6. Composants UI

### Bouton
* **Primaire** : fond `--primary`, texte blanc, radius standard. Un seul bouton primaire par section, pour guider vers l'action la plus importante (ex. "Découvrir KumpaStore", "Nous contacter").
* **Secondaire** : contour `--primary`, fond transparent ou `--secondary`. Pour les actions alternatives (ex. "En savoir plus").
* **Tertiaire** : texte seul, sans bordure, couleur `--primary`. Pour les actions discrètes (ex. liens de navigation dans le footer).
* Tous les boutons ont des coins arrondis modernes (jamais carrés), une police `--font-ui`, et gèrent explicitement les états : défaut, survol (légère montée d'opacité/ombre), actif (léger enfoncement visuel), désactivé (opacité réduite, curseur not-allowed), chargement (spinner inline, texte conservé pour éviter le saut de layout).

### Cartes produit/filiale (showcase)
Le hub présente déjà des mockups de produits (Store, VisitApp, MaxImmo) dans des "browser frames" stylisés — garder ce langage visuel démonstratif et illustratif pour toute nouvelle carte ajoutée : cadre de navigateur/app avec barre de titre à points de couleur, contenu miniature réaliste plutôt qu'une simple image statique. C'est ce qui rend la page "démonstrative" plutôt que purement marketing.

### Navigation / Header
* Logo à gauche, liens de navigation au centre ou à droite, sélecteur de langue et CTA principal ("Nous contacter" ou équivalent) à l'extrémité droite.
* Sticky en haut de page, fond qui se solidifie légèrement au scroll pour rester lisible par-dessus le contenu.

### Footer
* Doit contenir les liens vers les filiales (KumpaStore, Services...), les réseaux sociaux, WhatsApp, et les mentions légales.

### Formulaires (section Services)
* Champs avec fond `--input-background`, bordure discrète, radius cohérent avec les boutons.
* Le CTA de soumission est toujours en bouton primaire, jamais tertiaire — c'est l'action qui pousse à l'action pour la partie Services (demande de devis, "nous écrire").

### États à prévoir systématiquement pour chaque composant interactif
Défaut · survol · focus (accessibilité clavier) · actif · désactivé · chargement · erreur · vide (empty state, ex. "aucun résultat").

---

## 7. Sections spécifiques au hub

* **Page d'accueil = hub de redirection.** Elle doit présenter le groupe, puis rediriger clairement vers : KumpaStore, WhatsApp/réseaux sociaux pour les Services, et les autres produits (VisitApp, MaxImmo, etc.), en gardant le style illustratif/démonstratif déjà présent (mockups d'interface plutôt que texte seul).
* **Section Services** : à retravailler avec une approche storytelling — structure suggérée : problème du client → comment Kumpax y répond → preuve sociale/résultat → CTA ("Demander un devis" / "Nous écrire"). Plus narratif que la grille produit de KumpaStore.
* Ton éditorial : direct, orienté conversion, sans être agressif — cohérent avec le positionnement "confiance + accessible".

---

## 8. Internationalisation

* Sélecteur de langue FR/EN élégant, visible dans le header (drapeau discret + code langue, ou simple toggle texte "FR / EN" — à trancher visuellement lors du prototypage).
* Prévoir des libellés de bouton/nav suffisamment courts pour ne pas casser en anglais comme en français (l'anglais est souvent plus court — concevoir pour le français, qui est la contrainte la plus large).

---

## 9. Accessibilité & performance

* Contraste texte/fond à valider WCAG AA, en particulier le texte blanc sur `--turquoise` (couleur claire, risque de contraste insuffisant — à tester avant usage en texte).
* Navigation clavier complète (focus visible sur tous les éléments interactifs).
* Images : compression systématique, formats modernes, dimensions adaptées au responsive (pas d'image desktop servie telle quelle sur mobile).

---

## 10. Gouvernance

* Design et développement assurés par Claude / Claude Code.
* Ce fichier (`Guidelines.md`) et `src/styles/theme.css` font foi pour toute nouvelle page ou composant du hub Kumpax. Toute nouvelle couleur, police ou variante de bouton doit être ajoutée ici avant d'être utilisée dans le code, pour éviter la dérive (deux boutons "primaires" différents, etc.).
* Le design system de **KumpaStore** sera un fichier séparé qui hérite de ces fondations (couleurs groupe, typographie, radius) et ajoute ses composants e-commerce spécifiques (carte produit, panier, checkout...).
