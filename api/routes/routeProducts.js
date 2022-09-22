const express = require('express');
const route = express.Router();
const controller = require('../controllers/productsController');
const pictureController = require('../controllers/pictureController')
const verifiers = require('../middelware/verifys');


// alias pictures
route.get('/:id/pictures',verifiers.chekGetsGeneral, pictureController.listPictures);

// rutas products
route.post('/',verifiers.checkUpdateGeneral, controller.chekData, controller.create);
route.put('/:id',verifiers.checkUpdateGeneral, controller.modify);
route.delete('/:id',verifiers.checkUpdateGeneral, controller.delete);
route.get('/search',verifiers.chekGetsGeneral, controller.search);
route.get('/mostwanted',verifiers.chekGetsGeneral, controller.mostwanted);
route.get('/:id',verifiers.chekGetsGeneral, controller.details);
route.get('/', verifiers.chekGetsGeneral,controller.list);



module.exports = route