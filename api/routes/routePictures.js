const express = require('express');
const { listPictures, getPictureID, createPicture, editPicture, deletePicture } = require('../controllers/pictureController');
const router = express.Router();
const verifiers = require('../middelware/verifys');

router.get('/',verifiers.chekGetsGeneral, listPictures);
router.get('/:id',verifiers.chekGetsGeneral, getPictureID);
router.post('/',verifiers.checkUpdateGeneral, createPicture);
router.put('/:id', verifiers.checkUpdateGeneral,editPicture);
router.delete('/:id', verifiers.checkUpdateGeneral,deletePicture);

module.exports = router;