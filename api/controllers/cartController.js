const { sequelize} = require("../database/models");
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
      res.status(500).json({
        ok: false,
        msg: "Error interno del server"
      })
    }
  },
  modifyCart: async (req, res) => {

    const t = await sequelize.transaction();
   
    try {

        const user = await persistance.getCartByUserID(req.params.id);
        const cart = user.cart;

        //PRIMER FOR:
        //Destruir carrito antiguo.
        for (let i = 0; i < cart.length; i++) {
          const producto = await persistance.searchById(
            "Product",
            cart[i].Cart.id_product
          );
          const nuevoStock = producto.stock + cart[i].Cart.quantity;
          await persistance.updateData("Product", producto.id, {
            stock: nuevoStock,
          }, {transaction: t});
          await persistance.deleteOneProduct(req.params.id, producto.id,{transaction: t});
        }

        //SEGUNDO FOR:
        //Crear nuevo carrito.
        const nuevoCart = req.body;
        for (let i = 0; i < nuevoCart.length; i++) {
          const producto = await persistance.searchById(
            "Product",
            nuevoCart[i].id_product
          );
          let nuevoStock = producto.stock;
          let quantity = 0;
          if (nuevoCart[i].quantity) {
            nuevoStock = nuevoStock - nuevoCart[i].quantity;
            quantity = nuevoCart[i].quantity;
          } else {
            nuevoStock = nuevoStock - 1;
            quantity = 1;
          }
          await persistance.updateData("Product", producto.id, {
            stock: nuevoStock,
          },{transaction: t});
          const data = {
            id_product: producto.id,
            id_usuario: req.params.id,
            quantity: quantity,
          };
          await persistance.inster("Cart", data,{transaction: t});
        }

        const cartById = await persistance.getCartByUserID(req.params.id);
        
        await t.commit();
    
      res.status(200).json({ ok: true, newCart: cartById });
    } catch (error) {
      t.rollback();
      res.status(500).json({
        ok: false,
        msg: "Error interno del server"
      })
    }
  },

};

module.exports = cartController;
