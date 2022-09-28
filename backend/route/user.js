const express = require('express');
const router = express.Router()
const userCtrl = require('../controllers/user');

const password = require('../midlleware/password-valid')

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;