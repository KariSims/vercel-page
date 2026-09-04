/**
 * Source de vérité des traductions FR. `en.ts` est typé `: typeof fr` — toute
 * clé manquante ou en trop dans `en.ts` casse `npm run build` (voir
 * tsconfig.i18n.json + le script `typecheck:i18n`). Ne rien traduire ici :
 * ce fichier reste la référence structurelle pour les deux langues.
 */
const fr = {
  htmlLang: "fr",

  nav: {
    links: ["Accueil", "Solutions", "Services"],
    menuToggle: "Ouvrir/fermer le menu",
    contact: "Nous contacter",
    // login: "Se connecter",
  },

  hero: {
    eyebrow: "Solutions Digitales pour Entreprises",
    headline: "Des plateformes digitales pour les entreprises",
    headlineAccent: "qui avancent.",
    subtext:
      "KumpaX conçoit des plateformes digitales innovantes permettant aux entreprises d'améliorer leur productivité, leur gestion et leur croissance grâce à des solutions intelligentes et évolutives.",
    ctaPrimary: "Découvrir nos solutions",
    ctaSecondary: "Nous contacter",
    stats: [
      { value: "5+", label: "Entreprises" },
      { value: "4", label: "Pays" },
      { value: "5", label: "Plateformes" },
      { value: "99.9%", label: "Satisfaction" },
    ],
    map: {
      alt: "Carte de présence KumpaX en Afrique",
      hqLabel: "KumpaX · Sénégal",
      presenceLabel: "Présence",
      presenceValue: "4 pays",
      companiesLabel: "Entreprises",
      companiesValue: "5+",
      cities: ["Gambie", "Guinée", "RD Congo"],
    },
  },

  trust: {
    badge: "Pourquoi KumpaX",
    title: "Pour KumpaX",
    intro:
      "Avant les produits, une conviction : bâtir des solutions solides demande de l'exigence, de la proximité et une vraie maîtrise technique.",
    points: [
      { title: "Expertise technologique", tagline: "Une maîtrise technique solide, au service de vos ambitions." },
      { title: "Solutions innovantes", tagline: "Des solutions innovantes qui anticipent les besoins de demain." },
      { title: "Support réactif", tagline: "Un support réactif, présent à chaque étape de votre projet." },
      { title: "Technologies modernes", tagline: "Des technologies modernes, robustes et pensées pour durer." },
    ],
  },

  approach: {
    badge: "Notre approche",
    title: "Une méthode éprouvée, du concept au support",
    intro: "Six étapes claires pour transformer vos idées en solutions digitales opérationnelles.",
    steps: [
      { title: "Découverte", description: "Un échange pour cerner vos objectifs, vos contraintes et vos priorités." },
      { title: "Analyse", description: "Une étude approfondie de vos besoins pour cadrer la solution idéale." },
      { title: "Conception", description: "La maquette et l'architecture de votre solution prennent forme." },
      { title: "Développement", description: "Nos équipes construisent votre solution, avec des points d'étape réguliers." },
      { title: "Déploiement", description: "Votre solution est mise en ligne et vos équipes sont formées." },
      { title: "Support", description: "Un accompagnement continu pour faire évoluer votre solution sereinement." },
    ],
  },

  solutions: {
    badge: "Nos Solutions",
    titlePrefix: "Cinq plateformes,",
    titleAccent: "un écosystème",
    intro:
      "Chaque solution KumpaX répond à un besoin métier précis, avec des interfaces soignées conçues pour les réalités des entreprises africaines.",
    useCaseLabel: "Cas d'usage",
    ctaLabel: "En savoir plus",
    products: {
      store: {
        tagline: "La vente en ligne, enfin simple",
        description:
          "Plateforme e-commerce complète permettant de vendre en ligne avec une expérience moderne. Gérez votre catalogue, vos paiements et vos commandes depuis un tableau de bord unifié.",
        features: [
          "Catalogue produits illimité",
          "Paiement sécurisé multi-méthodes",
          "Gestion des commandes en temps réel",
          "Système de promotions avancé",
          "Dashboard analytics complet",
        ],
        useCase: "Idéal pour les PME, boutiques et marques souhaitant digitaliser leurs ventes.",
      },
      visitapp: {
        tagline: "Vos commerciaux terrain, toujours connectés",
        description:
          "Plateforme de suivi commercial B2B permettant le tracking des ventes terrain. Géolocalisation en temps réel, rapports automatisés et statistiques de performance pour maximiser l'efficacité de vos équipes.",
        features: [
          "Géolocalisation en temps réel",
          "Suivi des commerciaux terrain",
          "Rapports de visite automatisés",
          "Statistiques de performance",
          "Historique complet des visites",
        ],
        useCase:
          "Pour les forces de vente terrain des entreprises B2B cherchant à optimiser leurs opérations commerciales.",
      },
      maximmo: {
        tagline: "La gestion immobilière modernisée",
        description:
          "Solution complète pour agences immobilières. Gérez loyers, contrats, maintenance et documents depuis une interface unique et intuitive pensée pour les professionnels.",
        features: [
          "Paiement des loyers en ligne",
          "Gestion des contrats digitaux",
          "Suivi de la maintenance",
          "Gestion documentaire centralisée",
          "Notifications automatiques locataires",
        ],
        useCase: "Pour les agences immobilières et gestionnaires de patrimoine souhaitant moderniser leur gestion.",
      },
      kumpacard: {
        tagline: "Votre identité professionnelle, digitale",
        description:
          "Plateforme de cartes de visite digitales. Partagez votre profil professionnel instantanément via QR Code, NFC ou lien. Personnalisez et trackez vos échanges en temps réel.",
        features: [
          "QR Code personnalisé",
          "Partage instantané — NFC, lien, QR",
          "Profils professionnels enrichis",
          "Analytics de partage et de scan",
          "Personnalisation complète",
        ],
        useCase: "Pour les professionnels, équipes commerciales et entrepreneurs souhaitant moderniser leur réseautage.",
      },
    },
    mockUi: {
      store: {
        nav: ["Dashboard", "Produits", "Commandes", "Clients", "Promotions", "Rapports"],
        overview: "Vue d'ensemble",
        stats: [
          { label: "Revenus", value: "2.4M FCFA", change: "+12%" },
          { label: "Commandes", value: "347", change: "+8%" },
          { label: "Produits", value: "128", change: "+3" },
        ],
        salesTitle: "Ventes mensuelles",
        salesRange: "6 derniers mois",
        products: [
          { name: "Chemise Premium", price: "12 500 FCFA", sold: "89 vendus" },
          { name: "Pantalon Slim", price: "18 000 FCFA", sold: "54 vendus" },
        ],
      },
      visitapp: {
        title: "VisitApp — Suivi Terrain",
        repNames: ["M. Tchoua", "S. Abena", "P. Fouda"],
        today: "Aujourd'hui",
        todayStats: [
          { label: "Visites", value: "12" },
          { label: "Km", value: "87" },
          { label: "Prospects", value: "5" },
          { label: "Contrats", value: "2" },
        ],
        repsTitle: "Commerciaux",
        repsStatus: ["En visite", "En déplacement", "Pause"],
        goalTitle: "Objectif mois",
        goalCount: "34 / 50",
      },
      maximmo: {
        title: "MaxImmo — Gestion Immobilière",
        stats: [
          { label: "Biens", value: "48" },
          { label: "Loyers perçus", value: "87%" },
          { label: "Maintenance", value: "3" },
          { label: "Contrats actifs", value: "41" },
        ],
        tableHeaders: ["Bien", "Locataire", "Loyer", "Statut"],
        statusLabels: { paid: "Payé", pending: "En attente", late: "Retard" },
        rows: [
          { bien: "Apt. Bastos 3P", tenant: "P. Mbongo", loyer: "250K FCFA", status: "paid" as const },
          { bien: "Villa Omnisport", tenant: "J. Ateba", loyer: "450K FCFA", status: "paid" as const },
          { bien: "Studio Nlongkak", tenant: "A. Nkeng", loyer: "80K FCFA", status: "pending" as const },
          { bien: "Apt. Akwa 2P", tenant: "R. Diboti", loyer: "180K FCFA", status: "late" as const },
        ],
      },
      kumpacard: {
        title: "KumpaCard — Profil Professionnel",
        name: "Alexis Kumba",
        role: "CEO — KumpaX",
        contacts: ["alexis@kumpax.com", "+221 7X XXX XX XX / +220 7X XXX XX", "kumpax.com"],
        share: "Partager",
        qr: "QR Code",
        analyticsTitle: "Analytics",
        analytics: [
          { label: "Scans", value: "243" },
          { label: "Vues", value: "891" },
          { label: "Contacts", value: "67" },
        ],
      },
    },
  },

  /**
   * Bandeaux obliques entre les segments de la page (couture 1-3 : entre les
   * 4 solutions ; couture 4 : Domaines d'expertise → Prestations (Odoo)).
   * Chaque bandeau annonce le segment qui suit réellement dans le flux de la
   * page — d'où seams[3] qui parle de "Prestations" et non de la section
   * intermédiaire (Domaines d'expertise) qui n'a pas de couture dédiée. Pas
   * de couture avant Contact (retirée le 2026-08-19, voir docs/HISTORIQUE.md
   * — la section a été remise telle qu'avant).
   */
  seams: [
    { keywords: ["VisitApp", "Suivi terrain", "Géolocalisation temps réel"] },
    { keywords: ["MaxImmo", "Gestion immobilière", "Loyers · Contrats · Maintenance"] },
    { keywords: ["KumpaCard", "Identité professionnelle", "QR · NFC · Lien"] },
    { keywords: ["Prestations de services", "Intégration Odoo", "Audit · Formation · Support"] },
  ],

  expertise: {
    badge: "Notre savoir-faire",
    title: "Domaines d'expertise",
    intro: "Les compétences techniques qui font tourner nos produits et nos projets d'intégration.",
    devTitle: "Développement & langages",
    domains: [
      {
        title: "Science des données & IA",
        description:
          "De l'analyse prédictive aux modèles d'intelligence artificielle sur mesure, nous transformons vos données en décisions.",
      },
      {
        title: "Collecte de données",
        description: "Des pipelines fiables pour capter, structurer et fiabiliser la donnée, quelle que soit sa source.",
      },
    ],
  },

  odoo: {
    badge: "Intégrateur Odoo",
    titlePrefix: "Intégration",
    titleAccent: "Odoo",
    intro:
      "KumpaX accompagne les entreprises dans leur transformation digitale avec Odoo, l'ERP open source le plus complet du marché. De l'audit au déploiement, nous assurons une mise en œuvre réussie et un support continu.",
    servicesLabel: "Nos services Odoo",
    services: ["Audit", "Installation", "Personnalisation", "Développement", "Migration", "Formation", "Support", "Déploiement"],
    badgeTitle: "Intégrateur Odoo",
    badgeDescription: "KumpaX déploie Odoo pour les entreprises d'Afrique. Expertise reconnue sur l'ensemble des modules ERP.",
    modulesLabel: "Modules Odoo maîtrisés",
    modules: ["CRM", "Ventes", "Comptabilité", "Stock", "Achats", "RH", "Projets", "E-commerce", "Facturation", "Fabrication", "Marketing", "Helpdesk"],
    approachLabel: "Notre approche",
    steps: ["Audit et découverte des besoins", "Installation et configuration", "Formation des équipes", "Support et évolution continue"],
  },

  impact: {
    badge: "Chiffres clés",
    title: "Notre impact en chiffres",
    stats: [
      { suffix: "+", label: "Projets livrés" },
      { suffix: "/7 j", label: "Support disponible" },
      { suffix: "+", label: "Solutions innovantes" },
      { suffix: "+ ans", label: "Expertise ERP" },
      { suffix: "", label: "Pays de déploiement" },
    ],
  },

  testimonials: {
    badge: "Ils nous font confiance",
    title: "Ce que disent nos clients",
    intro: "Des retours d'entreprises qui ont fait confiance à KumpaX pour leurs projets digitaux.",
    prevAriaLabel: "Témoignage précédent",
    nextAriaLabel: "Témoignage suivant",
    items: [
      {
        quote: "Avec plusieurs branches réparties à travers le pays et plus de 2 600 références gérées dans chacune d’elles, dont certaines similaires mais différentes, le suivi de nos stocks et de la performance de nos approvisionnements était devenu un véritable défi.\n\nKumpaX nous a accompagnés dans la transformation digitale de nos entreprises grâce à l’intégration d’Odoo. Cette solution nous permet aujourd’hui de mieux structurer et piloter nos opérations, avec une vision plus claire de notre activité par branche.",
        author: "Abdoulie JALLOW",
        role: "PDG",
        company: "ABLO MOTORS",
      },
      {
        quote: "Nous recherchions une solution capable de gérer efficacement nos ventes avec plusieurs unités de mesure et sous-unités, tout en améliorant notre gestion comptable et financière. \n\nGrâce à l’accompagnement de KumpaX dans l’intégration d’Odoo, nous centralisons désormais nos ventes, le suivi des créances et des encaissements, y compris pour les clients réglant par tranches. Cette centralisation facilite également la consolidation et le suivi de nos rapports financiers.",
        author: "Dioulde",
        role: "Responsable financier",
        company: "EMAB SARL",
      },
      {
        quote: "Nous étions deux à piloter notre activité e-commerce et nous recherchions une solution digitale capable de centraliser efficacement nos opérations : importation massive du catalogue produits, gestion des stocks, suivi des ventes et pilotage financier. \n\nAvec KumpaX, nous avons mis en place un système de gestion léger et adapté à notre activité, qui nous permet de gagner en efficacité dans la gestion quotidienne de notre catalogue, de nos stocks et de nos performances commerciales.",
        author: "Amina DIOP",
        role: "Entrepreneure",
        company: "Harmony Life Shop",
      },
      {
        quote: "Nous rencontrions des difficultés dans le suivi des dates de péremption et la gestion des lots selon leur date d’arrivée. Il nous était notamment difficile d’identifier rapidement quel lot devait être livré en priorité, ce qui entraînait auparavant des pertes importantes de produits arrivant à expiration. \n\nAvec KumpaX, nous avons optimisé la traçabilité des lots et la gestion des stocks selon les dates de péremption. Nous maîtrisons désormais mieux nos sorties de stock et avons considérablement réduit les pertes liées aux produits périmés.",
        author: "AL KHASIM",
        role: "Chargé des opérations",
        company: "OCAF",
      },
    ],
  },

  contact: {
    badge: "Contact",
    title: "Parlons de votre projet",
    intro: "Notre équipe vous répond sous 24h ouvrées pour étudier vos besoins et vous proposer un accompagnement sur mesure.",
    introHighlight: "Vous pouvez nous écrire depuis n'importe où : selon les besoins de votre projet, nous intervenons à distance ou nous nous déplaçons sur site.",
    addressLabel: "Adresse (Sénégal)",
    addressValue: "Dakar, Sénégal",
    phoneLabel: "Téléphone ou Whatsapp (Sénégal)",
    phoneValue: "+221 77 800 37 37",
    // TODO: remplacer par la vraie ville du bureau gambien avant mise en production
    addressLabel2: "Adresse (Gambie)",
    addressValue2: "KANIFING GIMPEX, Gambie",
    phoneLabel2: "Téléphone ou Whatsapp (Gambie)",
    phoneValue2: "+220 453 3707",
    emailLabel: "Email",
    emailValue: "contact@kumpax.com",
    form: {
      namePlaceholder: "Nom",
      companyPlaceholder: "Entreprise",
      emailPlaceholder: "Email",
      phonePlaceholder: "Téléphone",
      subjectPlaceholder: "Sujet",
      messagePlaceholder: "Message",
      submitIdle: "Envoyer le message",
      submitSending: "Envoi en cours…",
      errorGeneric: "L'envoi a échoué. Réessayez plus tard ou écrivez-nous directement.",
      errorNetwork: "Impossible d'envoyer votre message. Vérifiez votre connexion et réessayez.",
    },
    success: {
      title: "Message envoyé !",
      message: "Merci pour votre message. Notre équipe vous répondra dans les 24h ouvrées.",
      again: "Envoyer un autre message",
    },
  },

  footer: {
    tagline: "Solutions digitales innovantes pour les entreprises africaines.",
    productsLabel: "Produits",
    products: ["KumpaX Store", "VisitApp", "MaxImmo", "KumpaCard"],
    servicesLabel: "Services",
    services: ["Intégration Odoo", "Audit SI", "Développement", "Formation", "Support"],
    contactLabel: "Contact",
    site: "kumpax.com",
    copyright: "Tous droits réservés.",
    legal: ["Confidentialité", "CGU", "Mentions légales"],
  },

  aria: {
    email: "Email",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
  },

  langSwitcher: {
    fr: "FR",
    en: "EN",
    ariaLabel: "Choisir la langue",
  },
};

export default fr;
export type Translations = typeof fr;
