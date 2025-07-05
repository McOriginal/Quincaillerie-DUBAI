const express = require('express');
const router = express.Router();
const commandeController = require('../controller/CommandeController');

//  Créer une nouvelle Commande
router.post('/createCommande', commandeController.createCommande);

//  Obtenir toutes les Commandes
router.get('/getAllCommandes', commandeController.getAllCommandes);

//  Obtenir une Commandes
router.get('/getOneCommande/:id', commandeController.getOneCommande);

//  Supprimer une Commande
router.delete('/deleteCommande/:id', commandeController.deleteCommande);

module.exports = router;
