const Approvisonement = require('../models/ApprovisonementModel');
const Produit = require('../models/ProduitModel');

// Create a new approvisonement
exports.createApprovisonement = async (req, res) => {
  try {
    const { produit, quantity, price, ...restOfData } = req.body;
    // On change les valeurs quantity et price en nombres
    formatQuantity = Number(quantity);
    formatPrice = Number(price);

    const lowerProduit = produit.toLowerCase();

    // On crée l'approvisionnement
    const approvisonement = await Approvisonement.create({
      produit: lowerProduit,
      quantity: formatQuantity,
      price: formatPrice,
      ...restOfData,
    });

    return res.status(201).json(approvisonement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a new approvisonement
exports.updateApprovisonement = async (req, res) => {
  try {
    const { produit, quantity, price, ...restOfData } = req.body;
    // On change les valeurs quantity et price en nombres
    formatQuantity = Number(quantity);
    formatPrice = Number(price);

    const lowerProduit = produit.toLowerCase();

    // On crée l'approvisionnement
    const approvisonement = await Approvisonement.findByIdAndUpdate(
      req.params.id,
      {
        produit: lowerProduit,
        quantity: formatQuantity,
        price: formatPrice,
        ...restOfData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(201).json(approvisonement);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Get all approvisonements
exports.getAllApprovisonements = async (req, res) => {
  try {
    const approvisonements = await Approvisonement.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate('fournisseur');
    return res.status(200).json(approvisonements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single approvisonement by ID
exports.getApprovisonementById = async (req, res) => {
  try {
    const approvisonement = await Approvisonement.findById(req.params.id)
      .populate('Produit')
      .populate('fournisseur');

    if (!approvisonement) {
      return res.status(404).json({ message: 'Approvisonement not found' });
    }

    return res.status(200).json(approvisonement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an approvisonement by ID
exports.deleteApprovisonement = async (req, res) => {
  try {
    const approvisonement = await Approvisonement.findByIdAndDelete(
      req.params.id
    );

    if (!approvisonement) {
      return res.status(404).json({ message: 'Approvisonement not found' });
    }

    return res
      .status(200)
      .json({ message: 'Approvisonement deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
