const mongoose = require('mongoose');

const achatSchema = new mongoose.Schema(
  {
    article: {
      type: String,
      required: true,
    },
    articleTotalAmount: {
      type: Number,
      required: true,
      trim: true,
    },
    totalAmountPaye: {
      type: Number,
      required: true,
      trim: true,
    },

    dateOfAchat: {
      type: Date,
      default: Date.now,
      required: true,
    },
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fournisseur',
      required: true,
    },
  },
  { timestamps: true }
);

const Achat = mongoose.model('Achat', achatSchema);
module.exports = Achat;
