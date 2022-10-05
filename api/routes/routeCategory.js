const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const verifiers = require('../middelware/verifys');

router.get("/", categoryController.listCategorys);
router.get("/:id", categoryController.detailCategory);
router.post("/",verifiers.checkUpdateGeneral, categoryController.create);
router.put("/:id", verifiers.checkUpdateGeneral,categoryController.update);
router.delete("/:id", verifiers.checkUpdateGeneral,categoryController.delete);


module.exports = router;