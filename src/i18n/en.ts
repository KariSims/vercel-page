import fr from "./fr";

/**
 * English translations. Typed against `fr` (source of vérité) so that a
 * missing/renamed/extra key here is a TypeScript compile error — enforced by
 * `npm run typecheck:i18n` (see tsconfig.i18n.json), wired into `npm run
 * build`. Keep the exact same shape as fr.ts; only translate string values.
 */
const en: typeof fr = {
  htmlLang: "en",

  nav: {
    links: ["Home", "Solutions", "Services"],
    menuToggle: "Toggle menu",
    contact: "Contact us",
    // login: "Log in",
  },

  hero: {
    eyebrow: "Digital Solutions for Businesses",
    headline: "Digital platforms for businesses",
    headlineAccent: "that move forward.",
    subtext:
      "KumpaX designs innovative digital platforms that help businesses improve their productivity, management, and growth through smart, scalable solutions.",
    ctaPrimary: "Discover our solutions",
    ctaSecondary: "Contact us",
    stats: [
      { value: "5+", label: "Businesses" },
      { value: "4", label: "Countries" },
      { value: "5", label: "Platforms" },
      { value: "99.9%", label: "Satisfaction" },
    ],
    map: {
      alt: "Map of KumpaX's presence across Africa",
      hqLabel: "KumpaX · Senegal",
      presenceLabel: "Presence",
      presenceValue: "4 countries",
      companiesLabel: "Businesses",
      companiesValue: "5+",
      cities: ["Gambia", "Guinea", "DR Congo"],
    },
  },

  trust: {
    badge: "Why KumpaX",
    title: "For KumpaX",
    intro:
      "Before the products, a conviction: building solid solutions takes rigor, closeness with clients, and real technical mastery.",
    points: [
      { title: "Technological expertise", tagline: "Solid technical mastery, in service of your ambitions." },
      { title: "Innovative solutions", tagline: "Innovative solutions that anticipate tomorrow's needs." },
      { title: "Responsive support", tagline: "Responsive support, present at every stage of your project." },
      { title: "Modern technologies", tagline: "Modern technologies, robust and built to last." },
    ],
  },

  approach: {
    badge: "Our approach",
    title: "A proven method, from concept to support",
    intro: "Six clear steps to turn your ideas into operational digital solutions.",
    steps: [
      { title: "Discovery", description: "A conversation to pin down your goals, constraints, and priorities." },
      { title: "Analysis", description: "An in-depth study of your needs to frame the ideal solution." },
      { title: "Design", description: "The mockups and architecture of your solution take shape." },
      { title: "Development", description: "Our teams build your solution, with regular progress checkpoints." },
      { title: "Deployment", description: "Your solution goes live and your teams are trained." },
      { title: "Support", description: "Ongoing support to help your solution evolve with peace of mind." },
    ],
  },

  solutions: {
    badge: "Our Solutions",
    titlePrefix: "Five platforms,",
    titleAccent: "one ecosystem",
    intro:
      "Each KumpaX solution addresses a precise business need, with polished interfaces designed for the realities of African businesses.",
    useCaseLabel: "Use case",
    ctaLabel: "Learn more",
    products: {
      store: {
        tagline: "Online selling, finally made simple",
        description:
          "A complete e-commerce platform for selling online with a modern experience. Manage your catalog, payments, and orders from a unified dashboard.",
        features: [
          "Unlimited product catalog",
          "Secure multi-method payments",
          "Real-time order management",
          "Advanced promotions system",
          "Full analytics dashboard",
        ],
        useCase: "Ideal for SMEs, shops, and brands looking to digitize their sales.",
      },
      visitapp: {
        tagline: "Your field sales reps, always connected",
        description:
          "A B2B sales tracking platform for field sales monitoring. Real-time geolocation, automated reports, and performance statistics to maximize your teams' efficiency.",
        features: [
          "Real-time geolocation",
          "Field sales rep tracking",
          "Automated visit reports",
          "Performance statistics",
          "Complete visit history",
        ],
        useCase:
          "For field sales forces at B2B companies looking to optimize their commercial operations.",
      },
      maximmo: {
        tagline: "Property management, modernized",
        description:
          "A complete solution for real estate agencies. Manage rent, contracts, maintenance, and documents from a single, intuitive interface built for professionals.",
        features: [
          "Online rent payments",
          "Digital contract management",
          "Maintenance tracking",
          "Centralized document management",
          "Automatic tenant notifications",
        ],
        useCase: "For real estate agencies and property managers looking to modernize their management.",
      },
      kumpacard: {
        tagline: "Your professional identity, digital",
        description:
          "A digital business card platform. Share your professional profile instantly via QR code, NFC, or link. Customize and track your exchanges in real time.",
        features: [
          "Custom QR code",
          "Instant sharing — NFC, link, QR",
          "Enriched professional profiles",
          "Sharing and scan analytics",
          "Full customization",
        ],
        useCase: "For professionals, sales teams, and entrepreneurs looking to modernize their networking.",
      },
    },
    mockUi: {
      store: {
        nav: ["Dashboard", "Products", "Orders", "Customers", "Promotions", "Reports"],
        overview: "Overview",
        stats: [
          { label: "Revenue", value: "2.4M FCFA", change: "+12%" },
          { label: "Orders", value: "347", change: "+8%" },
          { label: "Products", value: "128", change: "+3" },
        ],
        salesTitle: "Monthly sales",
        salesRange: "Last 6 months",
        products: [
          { name: "Premium Shirt", price: "12,500 FCFA", sold: "89 sold" },
          { name: "Slim Trousers", price: "18,000 FCFA", sold: "54 sold" },
        ],
      },
      visitapp: {
        title: "VisitApp — Field Tracking",
        repNames: ["M. Tchoua", "S. Abena", "P. Fouda"],
        today: "Today",
        todayStats: [
          { label: "Visits", value: "12" },
          { label: "Km", value: "87" },
          { label: "Leads", value: "5" },
          { label: "Deals", value: "2" },
        ],
        repsTitle: "Sales reps",
        repsStatus: ["On a visit", "Traveling", "On break"],
        goalTitle: "Monthly goal",
        goalCount: "34 / 50",
      },
      maximmo: {
        title: "MaxImmo — Property Management",
        stats: [
          { label: "Properties", value: "48" },
          { label: "Rent collected", value: "87%" },
          { label: "Maintenance", value: "3" },
          { label: "Active contracts", value: "41" },
        ],
        tableHeaders: ["Property", "Tenant", "Rent", "Status"],
        statusLabels: { paid: "Paid", pending: "Pending", late: "Late" },
        rows: [
          { bien: "Bastos Apt. 3BR", tenant: "P. Mbongo", loyer: "250K FCFA", status: "paid" },
          { bien: "Omnisport Villa", tenant: "J. Ateba", loyer: "450K FCFA", status: "paid" },
          { bien: "Nlongkak Studio", tenant: "A. Nkeng", loyer: "80K FCFA", status: "pending" },
          { bien: "Akwa Apt. 2BR", tenant: "R. Diboti", loyer: "180K FCFA", status: "late" },
        ],
      },
      kumpacard: {
        title: "KumpaCard — Professional Profile",
        name: "Alexis Kumba",
        role: "CEO — KumpaX",
        contacts: ["alexis@kumpax.com", "+221 7X XXX XX XX / +220 7X XXX XX", "kumpax.com"],
        share: "Share",
        qr: "QR Code",
        analyticsTitle: "Analytics",
        analytics: [
          { label: "Scans", value: "243" },
          { label: "Views", value: "891" },
          { label: "Contacts", value: "67" },
        ],
      },
    },
  },

  seams: [
    { keywords: ["VisitApp", "Field tracking", "Real-time geolocation"] },
    { keywords: ["MaxImmo", "Property management", "Rent · contracts · maintenance"] },
    { keywords: ["KumpaCard", "Professional identity", "QR · NFC · link"] },
    { keywords: ["Professional services", "Odoo integration", "Audit · training · support"] },
  ],

  expertise: {
    badge: "Our know-how",
    title: "Areas of expertise",
    intro: "The technical skills that power our products and integration projects.",
    devTitle: "Development & languages",
    domains: [
      {
        title: "Data science & AI",
        description:
          "From predictive analytics to custom artificial intelligence models, we turn your data into decisions.",
      },
      {
        title: "Data collection",
        description: "Reliable pipelines to capture, structure, and validate data, whatever its source.",
      },
    ],
  },

  odoo: {
    badge: "Odoo Integrator",
    titlePrefix: "Odoo",
    titleAccent: "Integration",
    intro:
      "KumpaX supports businesses in their digital transformation with Odoo, the most complete open-source ERP on the market. From audit to deployment, we ensure a successful rollout and ongoing support.",
    servicesLabel: "Our Odoo services",
    services: ["Audit", "Installation", "Customization", "Development", "Migration", "Training", "Support", "Deployment"],
    badgeTitle: "Odoo Integrator",
    badgeDescription: "KumpaX deploys Odoo for businesses across Africa. Recognized expertise across the full range of ERP modules.",
    modulesLabel: "Odoo modules mastered",
    modules: ["CRM", "Sales", "Accounting", "Inventory", "Purchasing", "HR", "Projects", "E-commerce", "Invoicing", "Manufacturing", "Marketing", "Helpdesk"],
    approachLabel: "Our approach",
    steps: ["Audit and needs discovery", "Installation and configuration", "Team training", "Ongoing support and evolution"],
  },

  impact: {
    badge: "Key figures",
    title: "Our impact in numbers",
    stats: [
      { suffix: "+", label: "Projects delivered" },
      { suffix: "/7 days", label: "Support available" },
      { suffix: "+", label: "Innovative solutions" },
      { suffix: "+ yrs", label: "ERP expertise" },
      { suffix: "", label: "Countries deployed" },
    ],
  },

  testimonials: {
    badge: "Trusted by",
    title: "What our clients say",
    intro: "Feedback from businesses that have trusted KumpaX with their digital projects.",
    prevAriaLabel: "Previous testimonial",
    nextAriaLabel: "Next testimonial",
    items: [
      {
        quote: "With multiple branches spread across the country and over 2,600 SKUs managed at each of them — some similar but distinct — tracking our stock and procurement performance had become a real challenge.\n\nKumpaX supported us through the digital transformation of our businesses with Odoo integration. This solution now lets us better structure and steer our operations, with a clearer view of our activity branch by branch.",
        author: "Abdoulie JALLOW",
        role: "CEO",
        company: "ABLO MOTORS",
      },
      {
        quote: "We were looking for a solution that could efficiently handle our sales across multiple units and sub-units of measure, while improving our accounting and financial management.\n\nWith KumpaX's support on our Odoo integration, we now centralize our sales and track receivables and payments — including for customers paying in installments. This centralization also makes it much easier to consolidate and monitor our financial reports.",
        author: "Dioulde",
        role: "Finance Manager",
        company: "EMAB SARL",
      },
      {
        quote: "There were just two of us running our e-commerce business, and we needed a digital solution that could efficiently centralize our operations: bulk product catalog imports, inventory management, sales tracking, and financial oversight.\n\nWith KumpaX, we set up a lightweight management system tailored to our business, which has made day-to-day management of our catalog, stock, and sales performance far more efficient.",
        author: "Amina DIOP",
        role: "Entrepreneur",
        company: "Harmony Life Shop",
      },
      {
        quote: "We struggled to track expiry dates and manage batches by arrival date. In particular, it was hard to quickly identify which batch needed to ship first, which used to cause significant losses from products reaching their expiration date.\n\nWith KumpaX, we optimized batch traceability and stock management by expiry date. We now have much better control over our stock outflows and have significantly cut losses linked to expired products.",
        author: "AL KHASIM",
        role: "Operations Manager",
        company: "OCAF",
      },
    ],
  },

  contact: {
    badge: "Contact",
    title: "Let's talk about your project",
    intro: "Our team responds within 24 business hours to review your needs and offer tailored support.",
    introHighlight: "You can reach us from anywhere: depending on your project's needs, we work remotely or travel on-site.",
    addressLabel: "Address (Senegal)",
    addressValue: "Dakar, Senegal",
    phoneLabel: "Phone or Whatsapp (Senegal)",
    phoneValue: "+221 77 800 37 37",
    // TODO: replace with the real Gambia office city before going live
    addressLabel2: "Address (Gambia)",
    addressValue2: "KANIFING GIMPEX, Gambia",
    phoneLabel2: "Phone or Whatsapp (Gambia)",
    phoneValue2: "+220 453 3707",
    emailLabel: "Email",
    emailValue: "contact@kumpax.com",
    form: {
      namePlaceholder: "Name",
      companyPlaceholder: "Company",
      emailPlaceholder: "Email",
      phonePlaceholder: "Phone",
      subjectPlaceholder: "Subject",
      messagePlaceholder: "Message",
      submitIdle: "Send message",
      submitSending: "Sending…",
      errorGeneric: "Sending failed. Please try again later or email us directly.",
      errorNetwork: "Could not send your message. Check your connection and try again.",
    },
    success: {
      title: "Message sent!",
      message: "Thank you for your message. Our team will get back to you within 24 business hours.",
      again: "Send another message",
    },
  },

  footer: {
    tagline: "Innovative digital solutions for African businesses.",
    productsLabel: "Products",
    products: ["KumpaX Store", "VisitApp", "MaxImmo", "KumpaCard"],
    servicesLabel: "Services",
    services: ["Odoo Integration", "IT Audit", "Development", "Training", "Support"],
    contactLabel: "Contact",
    site: "kumpax.com",
    copyright: "All rights reserved.",
    legal: ["Privacy", "Terms", "Legal notice"],
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
    ariaLabel: "Choose language",
  },
};

export default en;
