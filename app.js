const express = require('express');
// Import des routes
const userRoute = require('./routes/UserRoute');
const fournisseurRoute = require('./routes/FournisseurRoute');
const produitRoute = require('./routes/ProduittRoute');
const commandeRoute = require('./routes/CommandeRoute');
const paiementRoute = require('./routes/PaiementRoute');
const approvisonementsRoute = require('./routes/ApprovisonementRoute');
const depenseRoute = require('./routes/DepenseRoute');
const appointmentRoute = require('./routes/AppointementRoute');

const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middlewares globaux
app.use(cors()); // Autoriser les requêtes cross-origin
app.use(express.json()); // Parser les requêtes avec JSON

// Lire les données de formulaire avec body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisation des routes étudiant
// Ajoute un préfixe /api à toutes les routes

app.use('/', userRoute);

// Utilisation des routes Utilisateur
app.use('/api/users', userRoute);

// Utilisation des routes Classe
app.use('/api/produits', produitRoute);

// Utilisation des routes Etudiant
app.use('/api/fournisseurs', fournisseurRoute);

// Utilisation des routes Ordonnance
app.use('/api/commandes', commandeRoute);

// Utilisation des routes Ordonnance
app.use('/api/paiements', paiementRoute);

// Utilisation des routes Approvisonnement
app.use('/api/approvisonnements', approvisonementsRoute);

// Utilisation des routes Appointment
app.use('/api/appointments', appointmentRoute);

// Utilisation des routes Depense
app.use('/api/depenses', depenseRoute);

//  Exporter le fichier APP
module.exports = app;
