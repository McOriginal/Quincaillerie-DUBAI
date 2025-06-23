const Produit = require('../models/ProduitModel');
const Ordonnance = require('../models/CommandeModel');
// Enregistrer une Produit
exports.createProduit = async (req, res) => {
  try {
    const { name, price, ...resOfData } = req.body;

    const lowerName = name.toLowerCase();
    // const formatStock = Number(stock);
    const formatPrice = Number(price);

    // Vérifier s'il existe déjà une matière avec ces critères
    const existingProduits = await Produit.findOne({
      name: lowerName,
    }).exec();

    if (existingProduits) {
      return res.status(400).json({
        status: 'error',
        message: 'Ce Produit existe déjà.',
      });
    }

    // Création de la matière
    const produit = await Produit.create({
      name: lowerName,
      // stock: formatStock,
      price: formatPrice,
      ...resOfData,
    });

    return res.status(201).json(produit);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour une Produit
exports.updateProduit = async (req, res) => {
  try {
    const { name, price, ...resOfData } = req.body;

    const lowerName = name.toLowerCase();
    const formatPrice = Number(price);

    // Vérifier s'il existe déjà un produit avec ces critères
    const existingProduits = await Produit.findOne({
      name: lowerName,
      _id: { $ne: req.params.id },
    }).exec();

    if (existingProduits) {
      return res.status(400).json({
        status: 'error',
        message: 'Ce Produit existe déjà.',
      });
    }

    // Mise à jour de produit
    const updated = await Produit.findByIdAndUpdate(
      req.params.id,
      {
        name: lowerName,
        // stock: formatStock,
        price: formatPrice,
        ...resOfData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

//  Afficher une seule Produit avec une stock minimum de (1)
exports.getAllProduits = async (req, res) => {
  try {
    const Produits = await Produit.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 });

    return res.status(200).json(Produits);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

//  Afficher une seule Produit avec une stock terminée (0)
// exports.getAllProduitWithStockFinish = async (req, res) => {
//   try {
//     const Produits = await Produit.find({ stock: { $lt: 5 } })
//       // Trie par date de création, du plus récent au plus ancien
//       .sort({ createdAt: -1 });

//     return res.status(200).json(Produits);
//   } catch (err) {
//     return res.status(400).json({ status: 'error', message: err.message });
//   }
// };

//  Afficher une seule Produit
exports.getOneProduit = async (req, res) => {
  try {
    const Produits = await Produit.findById(req.params.id);
    return res.status(200).json(Produits);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer un Produit
exports.deleteProduitById = async (req, res) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Produit supprimée avec succès' });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer toute les Produit
exports.deleteAllProduit = async (req, res) => {
  try {
    await Produit.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Toute les Produit ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de toute les Produit',
      error: e.message,
    });
  }
};

// -----------------------------------------------
// exports.decrementMultipleStocks = async (req, res) => {
//   const session = await Produit.startSession();
//   session.startTransaction();

//   try {
//     const items = req.body.items; // [{ id, quantity }, ...]

//     for (const { Produits, quantity } of items) {
//       const Produit = await Produit.findById(Produits).session(session);
//       if (!Produit) {
//       }

//       if (Produit.stock < quantity) {
//         console.log(
//           `Stock insuffisant pour ${Produit.name}. Disponible : ${Produit.stock}`
//         );
//       }

//       Produit.stock -= quantity;
//       await Produit.save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({ message: 'Stocks mis à jour avec succès' });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ message: err.message });
//   }
// };

// exports.cancelOrdonnance = async (req, res) => {
//   const session = await Produit.startSession();
//   session.startTransaction();

//   try {
//     const ordonnanceId = req.params.ordonnanceId;
//     const { items } = req.body; // [{ ProduitId, quantity }, ...]

//     for (const { ProduitId, quantity } of items) {
//       const Produit = await Produit.findById(ProduitId).session(session);
//       if (!Produit) {
//         throw new Error(`Médicament ${ProduitId} non trouvé`);
//       }
//       Produit.stock += quantity;
//       await Produit.save({ session });
//     }

//     const deletedOrdonnance = await Ordonnance.findByIdAndDelete(ordonnanceId, {
//       session,
//     });
//     if (!deletedOrdonnance) {
//       throw new Error('Ordonnance non trouvée');
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return res
//       .status(200)
//       .json({ message: 'Annulation réussie, stock rétabli.' });
//   } catch (err) {
//     console.log(err);
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ message: err.message });
//   }
// };
