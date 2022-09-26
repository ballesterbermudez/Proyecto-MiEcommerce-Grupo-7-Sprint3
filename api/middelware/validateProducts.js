const persistence = require("../persistence/persistence");

module.exports = async (req, res, next) => {
  const cart = req.body;
  try {
    cart.forEach(async (product) => {
      if (typeof product.id_product != "number") {
        res.status(500).json({
          ok: false,
          msg: `El producto ${product.id_product} debe tener un id numerico`,
        });
      }
      const theProduct = await persistence.searchById(
        "Product",
        product.id_product
      );
      if (!theProduct) {
        res.status(404).json({
          ok: false,
          msg: `El producto con id ${product.id_product} no existe en la base de datos`,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }

  next();
};
