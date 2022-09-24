const persistence = require("../persistence/persistence");

module.exports = (req, res, next) => {
  const cart = req.body;
  cart.forEach((product) => {
    if (!persistence.searchById(Product, product.id)) {
      res.json({
        ok: false,
        msg: `El producto con id ${product.id} no existe en la base de datos`,
      });
    }
  });
  next();
};
