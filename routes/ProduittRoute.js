const express = require('express');
const router = express.Router();
const produitController = require('../controller/ProduitController');

// Créer un Produit
router.post('/addProduit', produitController.createProduit);

// Afficher une toutes les Produit
router.get('/getAllProduits', produitController.getAllProduits);

// Afficher une seule Produit
router.get('/getOneProduit/:id', produitController.getOneProduit);

// Mettre à jour une Produit
router.put('/updateProduit/:id', produitController.updateProduit);

// supprimer une Matière
router.delete('/deleteProduit/:id', produitController.deleteProduitById);

// Supprimer toutes les Produit
router.delete('/deleteAllProduit', produitController.deleteAllProduit);

module.exports = router;
