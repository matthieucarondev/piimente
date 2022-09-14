const express = require('express');
const router = express.Router();

const auth = require('../midlleware/auth');
const multer = require(`../midlleware/multer-config`)

const saucesCtrl = require('../controllers/sauce');

router.get('/', auth,saucesCtrl.getAllSauce);
router.post('/',auth,multer, saucesCtrl.createSauce);
router.get('/:id',auth, saucesCtrl.getOneSauce);
router.put('/:id',auth,multer, saucesCtrl.modifySauce);
router.delete('/:id',auth, saucesCtrl.deleteSauce);
router.post('/:id/like',auth,  saucesCtrl.evaluateSauce);

module.exports = router;