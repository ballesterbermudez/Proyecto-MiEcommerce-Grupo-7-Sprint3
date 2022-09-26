const persistance = require("../persistence/persistence");

const cartController = {
  listCart: async (req, res) => {
    try {
      const cart = await persistance.getCartByUserID(req.params.id);

      if (cart) {
        res.send(cart);
      } else {
        res.status(404).json({
          ok: false,
          msg: "No se encontraron usuarios con el id " + req.params.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  modifyCart: async (req, res) => {
    try {
      await persistance.deleteCartByUserId(req.params.id);
      const newCart = req.body;
      for (let i = 0; i < newCart.length; i++) {
        await persistance.inster("Cart", {
          id_product: newCart[i].id_product,
          id_usuario: req.params.id,
          quantity: newCart[i].quantity,
        });
      }
      const modifiedCart = await persistance.getCartByUserID(req.params.id);
      //console.log(modifiedCart);
      res.status(200).json({
        msg: "Carrito modificado",
        modifiedCart,
      });
    } catch (error) {
      res.send(error);
    }
  },
};

module.exports = cartController;
