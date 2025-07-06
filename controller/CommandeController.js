const Commande = require('../models/CommandeModel');
const Paiement = require('../models/PaiementModel');
const Produit = require('../models/ProduitModel');
const mongoose = require('mongoose');

// Créer une COMMANDE
exports.createCommande = async (req, res) => {
  try {
    const { fullName, phoneNumber, adresse, items, ...restOfData } = req.body;
    const lowerName = fullName.toLowerCase();
    const lowerAdresse = adresse.toLowerCase();
    const formattedPhoneNumber = Number(phoneNumber);

    const newCommande = await Commande.create({
      items,
      fullName: lowerName,
      adresse: lowerAdresse,
      phoneNumber: formattedPhoneNumber,
      ...restOfData,
    });

    res.status(201).json(newCommande);
  } catch (error) {
    console.log("Erreur de validation l'Commande :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Trouver toutes les commandes
exports.getAllCommandes = async (req, res) => {
  try {
    const commandesListe = await Commande.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate('items.produit');

    // Afficher les COMMANDES en fonction des PAIEMENTS effectués
    const factures = await Paiement.find().populate({
      path: 'commande',
      populate: { path: 'items.produit' },
    });
    return res.status(201).json({ commandesListe, factures });
  } catch (e) {
    return res.status(404).json(e);
  }
};

// Trouver une seulle COMMANDE
exports.getOneCommande = async (req, res) => {
  try {
    const commandeData = await Commande.findById(req.params.id).populate(
      'items.produit'
    );

    // ID de PAIEMENT correspondant au COMMANDE
    const paiementCommande = await Paiement.findOne({
      commande: req.params.id,
    }).populate({
      path: 'commande',
      populate: { path: 'items.produit' },
    });
    return res.status(201).json({ commandeData, paiementCommande });
  } catch (e) {
    return res.status(404).json(e);
  }
};

// -----------------------------------------------

// Decrementer la Quantité commandé sur le stock du produit
exports.decrementMultipleStocks = async (req, res) => {
  const session = await Produit.startSession();
  session.startTransaction();

  try {
    const items = req.body.items; // [{ id, quantity }, ...]

    for (const { produit, quantity } of items) {
      const produits = await Produit.findById(produit).session(session);
      if (!produits) {
        throw new Error(`Produit ${produit} non trouvé`);
      }

      if (produits.stock < quantity) {
        console.log(
          `Stock insuffisant pour ${produits.name}. Disponible : ${produits.stock}`
        );
      }

      produits.stock -= quantity;
      await produits.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'Stocks mis à jour avec succès' });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: err.message });
  }
};

// ----------------------------------------------------------------------------

// Annuler une COMMANDE et faire retablir le stock de PRODUIT
exports.deleteCommande = async (req, res) => {
  const session = await Produit.startSession();
  session.startTransaction();

  try {
    const commandeId = req.params.commandeId;
    const { items } = req.body;

    for (const { produit, quantity } of items) {
      const produits = await Produit.findById(produit).session(session);
      if (!produits) {
        throw new Error(`Produit ${produit} non trouvé`);
      }
      produits.stock += quantity;
      await produits.save({ session });
    }

    // On supprime le PAIEMENT
    const paiement = await Paiement.find({ commande: commandeId });
    if (!paiement) {
      throw new Error('Paiement non trouvée');
    }
    const deletedCommande = await Commande.findByIdAndDelete(commandeId, {
      session,
    });
    if (!deletedCommande) {
      throw new Error('Commande non trouvée');
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ message: 'Annulation réussie, stock rétabli.' });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: err.message });
  }
};

// --------------------------------------------------------------------------
// --------- Modifier une Commande ----------------------------------

exports.updateCommande = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { commandeId } = req.params;
    const { fullName, phoneNumber, adresse, statut, items, totalAmount } =
      req.body;

    const existingCommande = await Commande.findById(commandeId).session(
      session
    );
    if (!existingCommande) {
      throw new Error('Commande non trouvée');
    }

    // Étape 1 : Restaurer les anciens stocks
    for (const item of existingCommande.items) {
      const produit = await Produit.findById(item.produit).session(session);
      if (!produit) throw new Error(`Produit ${item.produit} non trouvé`);
      produit.stock += item.quantity;
      await produit.save({ session });
    }

    // Étape 2 : Vérifier stock des nouveaux items
    for (const { produit, quantity } of items) {
      const prod = await Produit.findById(produit).session(session);
      if (!prod) throw new Error(`Produit ${produit} non trouvé`);
      if (prod.stock < quantity) {
        throw new Error(`Stock insuffisant pour le produit : ${prod.name}`);
      }
    }

    // Étape 3 : Décrémenter le nouveau stock
    for (const { produit, quantity } of items) {
      const prod = await Produit.findById(produit).session(session);
      prod.stock -= quantity;
      await prod.save({ session });
    }

    // Étape 4 : Mettre à jour la commande
    existingCommande.fullName = fullName;
    existingCommande.phoneNumber = phoneNumber;
    existingCommande.adresse = adresse;
    existingCommande.statut = statut;
    existingCommande.items = items;
    existingCommande.totalAmount = totalAmount;

    await existingCommande.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ message: 'Commande mise à jour avec succès' });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};
