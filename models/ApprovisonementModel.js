const mongoose = require('mongoose');
const approvisonementSchema = new mongoose.Schema(
  {
    produit: {
      type: String,
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
  'Approvisonement',
  approvisonementSchema
);
module.exports = Approvisonement;
