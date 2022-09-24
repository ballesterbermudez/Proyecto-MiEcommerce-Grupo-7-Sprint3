const persistance = require('../persistence/persistence')

const listCart = (req, res) => {
  const cart = persistance.getCartByUserID(req.params.id);
  if (cart) {
    res.send(cart)
  }
  res.json({ok: false, msg: "No se encontraron usuarios con el id " + res.params.id})
}


module.exports = { getCarrito, putCarrito };
