const express = require("express");
const route = express.Router();
const cartController = require("../controllers/cartController");
const usersController = require("../controllers/usersController");
const {login} = require('../controllers/loginControllers');
const verifiers = require('../middelware/verifys');
const verifyJWT = require('../middelware/verifyJWT');


//Rutas alias de carts
route.get("/:id/cart",verifyJWT,verifiers.checkGetUsers, cartController.getCarrito);
route.put("/:id/cart",verifyJWT,verifiers.checkUpdateUser, cartController.putCarrito);

//Rutas de users
route.get("/",verifyJWT,verifiers.checkGetUsers, usersController.listUsers);
route.get("/:userId", verifyJWT,verifiers.checkGetUsers,usersController.findUserById);
route.post("/", verifyJWT,verifiers.checkUpdateUser,usersController.createUser);
route.put("/:userId", verifyJWT,verifiers.checkUpdateUser, usersController.editUser);
route.delete("/:userId", verifyJWT,verifiers.checkUpdateUser,usersController.deleteUser);

//Rutas alias de login
route.post('/login', login);

module.exports = route;
