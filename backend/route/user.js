// ROUTEUR UTILISATEUR - contient la logique de routing utilisateur

// importation d'express et du controllers utilisateur
const express = require('express');
const router = express.Router()
// création d'un routeur express
const userCtrl = require('../controllers/user');

// création des route signup et login 
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
// exportation du router
module.exports = router;