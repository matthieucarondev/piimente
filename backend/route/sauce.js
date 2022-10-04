//importation d'express, 
// du controller sauce et 
// des middleware auth et multer-config
const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const multer = require(`../midlleware/multer-config`)
const saucesCtrl = require('../controllers/sauce');
// creation route get pour voir les sauces
router.get('/', auth,saucesCtrl.getAllSauce);
// creation route post pour créer une sauce
router.post('/',auth,multer, saucesCtrl.createSauce);
// creation route get pour voir une  sauce grace a id
router.get('/:id',auth, saucesCtrl.getOneSauce);
// creation route put pour modifier une  sauce grace a  id
router.put('/:id',auth,multer, saucesCtrl.modifySauce);
// creation routedelete  pour suprimer une  sauce grace a id
router.delete('/:id',auth, saucesCtrl.deleteSauce);
// creation route post pour créer un like ou un dislike 
router.post('/:id/like',auth,  saucesCtrl.evaluateSauce);
// exportation du routeur
module.exports = router;