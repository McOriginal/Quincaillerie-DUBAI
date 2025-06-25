import React from 'react';
import { Navigate } from 'react-router-dom';

//Dashboard
import Dashboard from '../Pages/Dashboard';

// Import Authentication pages
import Login from '../Pages/Authentication/Login';
import ForgetPasswordPage from '../Pages/Authentication/ForgetPassword';
import Register from '../Pages/Authentication/Register';
import UserProfile from '../Pages/Authentication/user-profile';

// Import Authentication Inner Pages
import Login1 from '../Pages/AuthenticationPages/Login';
import Register1 from '../Pages/AuthenticationPages/Register';
import RecoverPassword from '../Pages/AuthenticationPages/RecoverPassword';
import LockScreen from '../Pages/AuthenticationPages/LockScreen';

// Import Utility Pages
import StarterPage from '../Pages/Utility/Starter-Page';
import Maintenance from '../Pages/Utility/Maintenance-Page';
import ComingSoon from '../Pages/Utility/ComingSoon-Page';
import TimeLine from '../Pages/Utility/TimeLine-Page';
import FAQs from '../Pages/Utility/FAQs-Page';
import Pricing from '../Pages/Utility/Pricing-Page';
import Error404 from '../Pages/Utility/Error404-Page';
import Error500 from '../Pages/Utility/Error500-Page';

// Importing other pages
import FournisseurListe from '../Pages/Fournisseurs/FournisseurListe.js';
import PaiementsListe from '../Pages/Paiements/PaiementsListe.js';
import ApprovisonnementListe from '../Pages/Approvisonnements/ApprovisonnementListe.js';
import ApprovisonnementForm from '../Pages/Approvisonnements/ApprovisonnementForm.js';
import DepenseListe from '../Pages/Depenses/DepenseListe.js';
import Rapports from '../Pages/Raports/Rapports.js';
import UpdatePassword from '../Pages/Authentication/UpdatePassword.js';
import VerifyCode from '../Pages/Authentication/VerifyCode.js';
import ResetPassword from '../Pages/Authentication/ResetPassword.js';
import ProduitListe from '../Pages/Produits/ProduitListe.js';
import NewCommande from '../Pages/Commandes/NewCommande.js';
import CommandeListe from '../Pages/Commandes/CommandeListe.js';
import FactureListe from '../Pages/Commandes/FactureListe.js';
import Facture from '../Pages/Commandes/Facture.js';

const sharedRoutes = [
  // Traitement Detail
  { path: '/newCommande', component: <NewCommande /> },

  // Changer le mot de passe
  { path: '/updatePassword', component: <UpdatePassword /> },
];

// Routes pour les ADMINS
const authProtectedRoutes = [
  //dashboard
  { path: '/dashboard', component: <Dashboard /> },

  // Commandes
  { path: '/commandes', component: <CommandeListe /> },

  // Fournisseurs
  { path: '/fournisseurs', component: <FournisseurListe /> },

  // Transaction et Factures

  // Paiements Liste
  { path: '/paiements', component: <PaiementsListe /> },

  //  Factures Liste
  { path: '/factures', component: <FactureListe /> },

  // Factures Détails
  { path: '/facture/:id', component: <Facture /> },

  // Dépenses
  { path: '/depenses', component: <DepenseListe /> },

  // Profile
  { path: '/userprofile', component: <UserProfile /> },

  // Outils Médicals

  // Médicament Pharmaceutique
  { path: '/produits', component: <ProduitListe /> },

  // Médicament Pharmaceutique
  // { path: '/medicaments_no_stock', component: <MedicamentSansStock /> },

  // approvisonnements
  { path: '/approvisonnements', component: <ApprovisonnementListe /> },

  // Raports
  { path: '/rapports', component: <Rapports /> },

  // --------------------------------------------------------

  // Utility Pages
  { path: '/pages-starter', component: <StarterPage /> },
  { path: '/pages-timeline', component: <TimeLine /> },
  { path: '/pages-faqs', component: <FAQs /> },
  { path: '/pages-pricing', component: <Pricing /> },

  {
    path: '/',
    exact: true,
    component: <Navigate to='/dashboard' />,
  },
];

// Routes pour les Médecins
const medecinsRoutes = [
  {
    path: '/',
    exact: true,
    component: <Navigate to='/dashboard-medecin' />,
  },
  //dashboard
  { path: '/dashboard-medecin', component: <Dashboard /> },
  // Profile
  { path: '/userprofile', component: <UserProfile /> },
];

const publicRoutes = [
  // { path: '/unauthorized', component: <Unauthorized /> },

  // Authentication Page
  { path: '/register', component: <Register /> },
  { path: '/login', component: <Login /> },
  { path: '/forgotPassword', component: <ForgetPasswordPage /> },
  { path: '/verifyCode', component: <VerifyCode /> },
  { path: '/resetPassword', component: <ResetPassword /> },

  // Authentication Inner Pages
  { path: '/auth-login', component: <Login1 /> },
  { path: '/auth-register', component: <Register1 /> },
  { path: '/auth-recoverpw', component: <RecoverPassword /> },
  { path: '/auth-lock-screen', component: <LockScreen /> },

  // Utility Pages
  { path: '/pages-404', component: <Error404 /> },
  { path: '/pages-500', component: <Error500 /> },
  { path: '/pages-maintenance', component: <Maintenance /> },
  { path: '/pages-comingsoon', component: <ComingSoon /> },
];

export { authProtectedRoutes, medecinsRoutes, publicRoutes, sharedRoutes };
