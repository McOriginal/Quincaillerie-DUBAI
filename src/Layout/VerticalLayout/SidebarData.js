const SidebarData = [
  {
    label: 'Menu',
    isMainMenu: true,
  },
  {
    label: 'Dashboard',
    icon: 'mdi mdi-home-variant-outline',
    isHasArrow: true,
    url: '/dashboard',
  },
  {
    label: 'Produits',
    isMainMenu: true,
  },
  {
    label: 'Produits',
    icon: 'mdi mdi-sitemap',
    isHasArrow: true,
    url: '/produits',
  },
  {
    label: 'Stock Terminé',
    icon: 'mdi mdi-sitemap',
    isHasArrow: true,
    url: '/produit_no_stock',
  },
  {
    label: 'Approvisonnement',
    // icon: 'bx bx-rotate-right',
    icon: 'fas fa-redo-alt',
    isHasArrow: true,
    url: '/approvisonnements',
  },

  {
    label: 'Commande & Facture',
    isMainMenu: true,
  },

  {
    label: 'Commande',
    icon: 'fas fa-server',
    isHasArrow: true,
    url: '/commandes',
  },
  {
    label: 'Nouvelle Commande',
    icon: 'fas fa-shopping-cart',
    isHasArrow: true,
    url: '/newCommande',
  },
  {
    label: 'Factures',
    icon: 'fas fa-receipt',
    isHasArrow: true,
    url: '/factures',
  },

  // --------------------------------------

  // Transactions / Comptabilité
  {
    label: 'Paiements',
    isMainMenu: true,
  },
  {
    label: 'Comptabilité',
    icon: 'fas fa-euro-sign',
    subItem: [
      { sublabel: 'Paiement', link: '/paiements' },
      { sublabel: 'Dépense', link: '/depenses' },
    ],
  },

  // ----------------------------------------------------------------------
  // Médecins
  {
    label: 'Fournisseurs',
    isMainMenu: true,
  },

  {
    label: 'Fournisseurs',
    icon: 'fas fa-shipping-fast',
    isHasArrow: true,
    url: '/fournisseurs',
  },

  // Pharmacie
  {
    label: 'Statistiques & Rapports',
    isMainMenu: true,
  },
  {
    label: 'Rapports et Suivie',
    icon: 'fas fa-chart-bar',
    subItem: [{ sublabel: 'Raports', link: '/rapports' }],
  },
  // --------------------------------------
];
export default SidebarData;
