const persistance = require("../persistence/persistence");

module.exports = async (req, res, next) => {
  try {
    if (!(await persistance.searchById("User", req.params.id))) {
      return res.status(404).json({
        ok: false,
        msg: "No hay usuarios con el id " + req.params.id,
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ok: false, msg: 'error interno'})
  }
};
