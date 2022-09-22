const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verifiers = require('../middelware/verifys');

router.get("/:id", verifiers.checkGetUsers,cartController.getCarrito);
router.put("/:id", verifiers.checkUpdateUser,cartController.putCarrito);

module.exports = router;
