const mongoose = require('mongoose');

// Création de SCHEMA pour APPROVISONNEMENT
const approvisonementSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produit',
      required: true,
    }, // Référence au produit
    quantity: {
      type: Number,
      required: true,
    }, // Quantité approvisionnée
    price: {
      type: Number,
      required: true, // Prix d'achat du produit
    },
    deliveryDate: {
      type: Date,
      default: Date.now, // Date de l'approvisionnement
    },
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fournisseur',
      required: true, // Référence au fournisseur
    },
  },
  { timestamps: true }
);

const Approvisonement = mongoose.model(
  'Approvisonnement',
  approvisonementSchema
);
module.exports = Approvisonement;
