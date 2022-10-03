const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const validateUserId = require("../middelware/validateUserId");

router.get("/:id", validateUserId, cartController.listCart);
router.put("/:id", validateUserId, cartController.modifyCart);

module.exports = router;
