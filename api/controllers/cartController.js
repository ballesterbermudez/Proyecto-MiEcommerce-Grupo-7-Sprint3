const persistance = require("../persistence/persistence");
const { ValidationError, Transaction } = require("sequelize");
const { sequelize } = require("../database/models");

// FUNCION AUXILIAR
// PRE: Recibe el id del carrito
// POS: Aumenta el stock del producto tomando en cuenta las quantities del carrito.
const sumarQuantityCartAStock = async (idUser) => {
  const user = await persistance.getCartByUserID(idUser);
  const cart = user.cart;
  for (let i = 0; i < cart.length; i++) {
    const producto = await persistance.searchById(
      "Product",
      cart[i].Cart.id_product
    );
    const stockViejo = producto.stock;
    const nuevoStock = stockViejo + cart[i].Cart.quantity;
    await persistance.updateData("Product", cart[i].Cart.id_product, {
      stock: nuevoStock,
    });
  }
};

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
        });
        await persistance.deleteOneProduct(req.params.id, producto.id);
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
        });
        const data = {
          id_product: producto.id,
          id_usuario: req.params.id,
          quantity: quantity,
        };
        await persistance.inster("Cart", data);
      }

      const cartById = await persistance.getCartByUserID(req.params.id);
      res.status(200).json({ ok: true, newCart: cartById });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error);
    }
  },

  modifyCartAux: async (req, res) => {
    try {
      await sumarQuantityCartAStock(req.params.id);
      await persistance.deleteCartByUserId(req.params.id);

      const newCart = req.body;
      for (let i = 0; i < newCart.length; i++) {
        const producto = await persistance.searchById(
          "Product",
          newCart[i].id_product
        );

        await persistance.inster("Cart", {
          id_product: newCart[i].id_product,
          id_usuario: req.params.id,
          quantity: newCart[i].quantity,
        });
        let nuevoStock;
        if (newCart[i].quantity) {
          nuevoStock = producto.stock - newCart[i].quantity;
        } else {
          nuevoStock = producto.stock - 1;
        }
        await persistance.updateData("Product", newCart[i].id_product, {
          stock: Number(nuevoStock),
        });
      }
      const modifiedCart = await persistance.getCartByUserID(req.params.id);
      //console.log(modifiedCart);

      res.status(200).json({
        msg: "Carrito modificado",
        modifiedCart,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        let errorArray = [];
        error.errors.forEach((el, i) => {
          if (el.message == "PRIMARY must be unique") {
            el.message = "No pueden haber dos productos con mismo id";
          }

          errorArray[i] = el.message;
        });
        res.status(401).json({ ok: false, msg: errorArray });
      } else {
        console.log(error);
        res
          .status(500)

          .json({ ok: false, msg: "No fue posible modificar el carrito" });
      }
    }
  },
};

module.exports = cartController;
