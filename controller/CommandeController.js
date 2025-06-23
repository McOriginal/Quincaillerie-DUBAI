const Commande = require('../models/CommandeModel');
const Produit = require('../models/ProduitModel');

// Créer une COMMANDE
exports.createCommande = async (req, res) => {
  try {
    const { items, ...restOfData } = req.body;

    // Vérification des items et existence des produits
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Les articles sont requis.' });
    }

    for (const item of items) {
      const produit = await produit.findById(item.produit);
      if (!produit) {
        return res
          .status(404)
          .json({ message: `produit introuvable: ${item.produit}` });
      }
      if (item.quantity < 1) {
        return res
          .status(400)
          .json({ message: 'Quantité invalide pour un produit.' });
      }
    }

    const newCommande = await Commande.create({
      items,
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
    const commandes = await Commande.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate('produit')
      .populate('items.produit');
    return res.status(201).json(commandes);
  } catch (e) {
    return res.status(404).json(e);
  }
};

exports.getOneCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id).populate(
      'items.produit'
    );

    return res.status(201).json(commande);
  } catch (e) {
    return res.status(404).json(e);
  }
};

// Récuperer l'Commande par Traitement
// exports.getTraitementCommande = async (req, res) => {
//   try {
//     // ID de Traitement
//     const commandeId = req.params.commandeId;

//     // Récupérer les patients à travers le traitement
//     const trait = await Traitement.findById(commandeId)
//       .populate('patient')
//       .populate('doctor');

//     // Récupérer l'Commande dont le traitement correspond à une ID précise
//     const Commande = await Commande.find({
//       traitement: commandeId,
//     })
//       .populate('traitement')
//       .populate('items.produits');

//     return res.status(201).json({ Commandes: { Commande, trait } });
//   } catch (e) {
//     return res.status(404).json(e);
//   }
// };

exports.deleteCommande = async (req, res) => {
  try {
    await Commande.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Commande supprimé avec succès' });
  } catch (e) {
    console.log(e);
    return res.status(404).json(e);
  }
};
