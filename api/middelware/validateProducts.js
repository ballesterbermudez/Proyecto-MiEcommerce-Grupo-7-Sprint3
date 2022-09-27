const persistence = require("../persistence/persistence");

//Funcion auxiliar
//PRE: Recibe un id de un producto y la cantidad a agregar al carrito
//POS: Consulta a la base de datos el stock y verifica que la cantidad no sea mayor al stock
const checkStock = async (id_product, quantity) => {
  const product = await persistence.searchById("Product", id_product);
  if (product.stock < quantity) return false;
  return true;
};

module.exports = async (req, res, next) => {
  const cart = req.body;
  let result = null;
  try {
    for (let i = 0; i < cart.length; i++) {
      const theProduct = await persistence.searchById(
        "Product",
        cart[i].id_product
      );
      if (theProduct == null) {
        result = {
          ok: false,
          msg: `El producto con id ${cart[i].id_product} no existe en la base de datos`,
        };
        return res.status(404).json(result);
      } else if (!checkStock(cart[i].id_product, cart[i].quantity)) {
        result = {
          ok: false,
          msg: `No hay suficiente stock para agregar el producto con id ${cart[i].id_product} al carrito`,
        };
        return res.status(400).json(result);
      }
    }
    next();
  } catch (err) {
    res.send(err);
  }
};
