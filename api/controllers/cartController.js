const persistance = require("../persistence/persistence");

const cartController = {
  listCart: (req, res) => {
    const cart = persistance.getCartByUserID(req.params.id);
    if (cart) {
      res.send(cart);
    }
    res.json({
      ok: false,
      msg: "No se encontraron usuarios con el id " + res.params.id,
    });
  },
  modifyCart: (req, res) => {
    persistance.deleteCartByUserId(req.params.id);
    const newCart = req.body;
    newCart.forEach((product) =>
      persistance.inster(Cart, {
        id_product: product.id,
        id_user: req.params.id,
      })
    );
    const modifiedCart = persistance.getCartByUserID(req.params.id);
    res.json({
      msg: "Carrito modificado",
      user: req.params.id,
      cart: modifiedCart,
    });
  },
};

module.exports = cartController;
