const express = require('express');
const route = express.Router();
const controller = require('../controllers/productsController');
const pictureController = require('../controllers/pictureController')
const verifiers = require('../middelware/verifys');


// alias pictures
route.get('/:id/pictures', pictureController.listPictures);

// rutas products
route.post('/',verifiers.checkUpdateGeneral, controller.create);
route.put('/:id',verifiers.checkUpdateGeneral, controller.modify);
route.delete('/:id',verifiers.checkUpdateGeneral, controller.delete);
route.get('/search', controller.search);
route.get('/mostwanted',controller.mostwanted);
route.get('/:id',controller.details);
route.get('/', controller.list);



module.exports = route