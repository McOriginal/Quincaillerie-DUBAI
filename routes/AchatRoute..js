const express = require('express');
const router = express.Router();
const achatController = require('./../controller/AchatController');

// Route to create a new expense
router.post('/createAchat', achatController.createAchat);

// Route to update an existing expense
router.put('/updateAchat/:id', achatController.updateAchat);

// Route to get all expenses
router.get('/getAllAchat', achatController.getAllAchats);

// Route to get an expense by ID
router.get('/getAchatById/:id', achatController.getAchatById);

// Route to delete an expense
router.delete('/deleteAchat/:id', achatController.deleteAchat);

// Export the router
module.exports = router;
