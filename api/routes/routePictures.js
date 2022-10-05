const express = require('express');
const { listPictures, getPictureID, createPicture, editPicture, deletePicture } = require('../controllers/pictureController');
const router = express.Router();
const verifiers = require('../middelware/verifys');

router.get('/', listPictures);
router.get('/:id', getPictureID);
router.post('/',verifiers.checkUpdateGeneral, createPicture);
router.put('/:id', verifiers.checkUpdateGeneral,editPicture);
router.delete('/:id', verifiers.checkUpdateGeneral,deletePicture);

module.exports = router;