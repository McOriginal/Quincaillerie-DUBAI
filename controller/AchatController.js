const Achat = require('../models/AchatModel');

// Create a new Achat
exports.createAchat = async (req, res) => {
  try {
    const achat = await Achat.create({
      ...req.body,
      article: req.body.article.toLowerCase(),
    });
    return res.status(201).json(achat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update an Achat
exports.updateAchat = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the required fields are provided
    if (!id) {
      return res.status(400).json({ message: 'Erreur Achat non Trouvé' });
    }

    // Find the Achat by ID and update it
    const achat = await Achat.findByIdAndUpdate(
      id,
      {
        ...req.body,
        article: req.body.article.toLowerCase(),
      },
      { new: true }
    );

    if (!achat) {
      return res.status(404).json({ message: 'Achat non trouvé.' });
    }

    return res.status(200).json(achat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all Achats
exports.getAllAchats = async (req, res) => {
  try {
    const achats = await Achat.find()
      .sort({ dateOfAchat: -1 })
      .populate('fournisseur');
    return res.status(200).json(achats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// Get a single Achat by ID
exports.getAchatById = async (req, res) => {
  try {
    const { id } = req.params;
    const achat = await achat.findById(id).populate('fournisseur');

    if (!achat) {
      return res.status(404).json({ message: 'Achat non trouvée.' });
    }

    return res.status(200).json(achat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete an Achat
exports.deleteAchat = async (req, res) => {
  try {
    const { id } = req.params;
    const achat = await Achat.findByIdAndDelete(id);

    if (!achat) {
      return res.status(404).json({ message: 'Achat non trouvée.' });
    }

    return res.status(200).json({ message: 'Achat supprimée avec succès.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
