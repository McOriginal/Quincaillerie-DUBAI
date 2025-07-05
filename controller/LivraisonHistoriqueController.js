const LivraisonHistorique = require('../models/LivraisonHistoriqueModel');

// Ajouter de Livraison
exports.createLivraisonHistorique = async (req, res) => {
  try {
    await LivraisonHistorique.create(req.body);
    return res.status(200).json({ message: 'Livraison ajouté avec succès' });
  } catch (e) {
    return res.status(404).json({ message: e.message });
  }
};

// Modifier une Livraison
exports.updateLivraisonHistorique = async (req, res) => {
  try {
    await LivraisonHistorique.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res
      .status(200)
      .json({ message: 'Livraison mis a jours avec succès' });
  } catch (e) {
    console.log(e);
    return res.stauts(404).json({ message: e.message });
  }
};

// Afficher la liste des Livraison
exports.getAllLivraisonHistorique = async (req, res) => {
  try {
    const livraison = await LivraisonHistorique.find({
      commande: req.params.id,
    })
      .sort({ createdAt: -1 })
      .populate('commande');
    return res.status(200).json(livraison);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: e.message });
  }
};

// Afficher une seule Livraison
exports.getOneLivraisonHistorique = async (req, res) => {
  try {
    const livraison = await LivraisonHistorique.findById(req.params.id);
    return res.status(200).json(livraison);
  } catch (e) {
    return res.status(404).json({ message: e.message });
  }
};

// Supprimer la Livraison
exports.deleteLivraisonHistorique = async (req, res) => {
  try {
    await LivraisonHistorique.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Livraison supprimé avec succès' });
  } catch (e) {
    return res.status(404).json({ message: e.message });
  }
};
