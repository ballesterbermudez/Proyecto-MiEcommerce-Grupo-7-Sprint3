const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const validateUserId = require("../middelware/validateUserId");
const validateProducts = require("../middelware/validateProducts");

router.get("/:id", validateUserId, cartController.listCart);
router.put("/:id", validateUserId, validateProducts, cartController.modifyCart);

module.exports = router;
