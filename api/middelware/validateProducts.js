const persistence = require("../persistence/persistence");

module.exports = async (req, res, next) => {
  const cart = req.body;
  let result = null;
  try {
    // cart.forEach(async (product) => {
    //   const theProduct = await persistence.searchById(
    //     "Product",
    //     product.id_product
    //   );
    //   console.log(theProduct);
    //   if (theProduct == null) {
    //     result = {
    //       ok: false,
    //       msg: `El producto con id ${product.id_product} no existe en la base de datos`,
    //     };
    //   }
    // });

    for (let i = 0; i < cart.length; i++) {
      const theProduct = await persistence.searchById(
        "Product",
        cart[i].id_product
      );
      console.log(theProduct);
      if (theProduct == null) {
        result = {
          ok: false,
          msg: `El producto con id ${cart[i].id_product} no existe en la base de datos`,
        };
      }
    }
    if (result != null) {
      res.status(404).json(result);
    } else {
      next();
    }
  } catch (err) {
    res.send(err);
  }
};
