const Commande = require('../models/CommandeModel');
const Paiement = require('../models/PaiementModel');

// Créer une COMMANDE
exports.createCommande = async (req, res) => {
  try {
    const { fullName, phoneNumber, adresse, items, ...restOfData } = req.body;
    const lowerName = fullName.toLowerCase();
    const lowerAdresse = adresse.toLowerCase();
    const formattedPhoneNumber = Number(phoneNumber);

    // Vérification si le numéro de téléphone n'existe pas déjà pour un autre client
    const existePhoneNumber = await Commande.findOne({
      phoneNumber: formattedPhoneNumber,
    }).exec();

    if (existePhoneNumber) {
      return res
        .status(400)
        .json({ message: 'Ce number de téléphone existe déjà.' });
    }

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
    // const commande = await Commande.findById(req.params.id).populate(
    //   'items.produit'
    // );

    // Afficher les COMMANDES en fonction de ID PAIEMENTS effectués
    const paiements = await Paiement.findOne({
      commande: req.params.id,
    }).populate({
      path: 'commande',
      populate: { path: 'items.produit' },
    });

    return res.status(201).json(paiements);
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
