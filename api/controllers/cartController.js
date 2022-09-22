const fs = require("fs");
const path = require("path");
const { getProduct } = require("./productsController");
const persistance = require('../persistence/persistence')
//const { getProduct } = require("./productsController");

/*FUNCION AUXILIAR:
Carga los usuarios en la variable que retorna*/
function cargarUsuarios() {
  let retorno = undefined;
  try {
    retorno = persistance.readDB("users.json");
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Base de datos no encontrada" });
  }
  return retorno;
}


function getCarrito(req, res) {
  const users = cargarUsuarios();
  const { id } = req.params;
  const user = users.find((el) => el.id === Number(id));
  if (user) {
    res.status(200).json({
      user: id,
      cart: user.cart,
    });
  } else {
    res.status(404).json({ msg: `Usuario con id ${id} no fue encontrado` });
  }
}

function putCarrito(req, res) {

  const { id } = req.params;
  const user = persistance.findByIdDB("users.json", id)
  if (user) {
    user.cart = [];
    req.body.forEach((elem) => {
      if (typeof elem.product == "number") {
        if (getProduct(elem.product) == -1) {
          res.status(404).json({
            msg: `El producto con id ${elem.product} no fue encontrado`,
          });
        }
      } else {
        res.status(400).json({
          ok: false,
          msg: `El producto ${id} debe tener un id númerico`,
        });
      }
      if (typeof elem.quantity == "number") {
        if (elem.quantity < 1) {
          res.status(400).json({
            ok: false,
            msg: `El producto ${id} debe tener una cantidad mayor a cero.`,
          });
        }
      } else {
        res.status(400).json({
          ok: false,
          msg: `El producto ${id} debe tener una cantidad númerica`,
        });
      }
      user.cart.push({ product: elem.product, quantity: elem.quantity });
    });

    persistance.updateDB("users.json", user);
    
    res.status(200).json({
      msg: "Carrito modificado",
      user: id,
      cart: user.cart,
    });
  } else {
    res.status(404).json({ msg: `Usuario con id ${id} no fue encontrado` });
  }
}

module.exports = { getCarrito, putCarrito };
