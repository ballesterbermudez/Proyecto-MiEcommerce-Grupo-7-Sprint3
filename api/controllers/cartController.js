const { sequelize } = require("../database/models");
const persistance = require("../persistence/persistence");
const { ValidationError } = require("sequelize");

const cartController = {
    listCart: async (req, res) => {
        try {
            const cart = await persistance.getCartByUserID(req.params.id);

            if (cart) {
                res.send(cart);
            } else {
                res.status(404).json({
                    ok: false,
                    msg:
                        "No se encontraron usuarios con el id " + req.params.id,
                });
            }
        } catch (error) {
            res.status(500).json({
                ok: false,
                msg: "Error interno del server",
            });
        }
    },
    modifyCart: async (req, res) => {
        let t = await sequelize.transaction();

        try {
           
          //borramos el antiguo cart
            let antiguoCart = await deleteCart(req.params.id, t)
            
            
            //Crear nuevo carrito.
            const nuevoCart = req.body;
            await this.createNewCart(req.params.id, nuevoCart,antiguoCart,t)

            await t.commit();

            const cartById = await persistance.getCartByUserID(req.params.id);

            res.status(200).json({ ok: true, newCart: cartById });
        } catch (error) {
            await t.rollback();
            if (error instanceof ValidationError) {
                let errorArray = [];
                error.errors.forEach((el, i) => {
                    errorArray[i] = el.message;
                });
                res.status(401).json(errorArray);
            } else {
                res.status(500).json({
                    message: "No fue posible insertar el producto",
                });
            }
        }
    },

    deleteCart: async (id, transaction = null) => {


            const user = await persistance.getCartByUserID(id);
            const cart = user.cart;
            let antiguoCart = [];
           
            for (let i = 0; i < cart.length; i++) {
                const producto = await persistance.searchById(
                    "Product",
                    cart[i].Cart.id_product
                );
                const nuevoStock = producto.stock + cart[i].Cart.quantity;
                antiguoCart[i] = { id: producto.id, stock: nuevoStock };
                await persistance.updateData(
                    "Product",
                    producto.id,
                    {
                        stock: nuevoStock,
                    },
                    transaction
                );
                await persistance.deleteOneProduct(
                    id,
                    producto.id,
                    transaction
                );
            }
      

      return antiguoCart
    },

    createNewCart: async (id,nuevoCart, antiguoCart,transaction = null) => {


      for (let i = 0; i < nuevoCart.length; i++) {
        let producto = antiguoCart.find(
            (ele) => ele.id == nuevoCart[i].id_product
        );
        if (!producto) {
            producto = await persistance.searchById(
                "Product",
                nuevoCart[i].id_product
            );
        }
        let nuevoStock = producto.stock;
        let quantity = 0;

        if (nuevoCart[i].quantity) {
            nuevoStock = nuevoStock - nuevoCart[i].quantity;
            quantity = nuevoCart[i].quantity;
        } else {
            nuevoStock = nuevoStock - 1;
            quantity = 1;
        }
        await persistance.updateData(
            "Product",
            producto.id,
            {
                stock: nuevoStock,
            },
            transaction
        );

        const data = {
            id_product: producto.id,
            id_usuario: id,
            quantity: quantity,
        };
        await persistance.inster("Cart", data, { transaction: transaction});

        console.log("iteracion: " + i);
    }

    },


};

module.exports = cartController;
