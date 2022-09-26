const persistance = require("../persistence/persistence");

module.exports = async (req, res, next) => {
  try {
    if (!(await persistance.searchById("User", req.params.id))) {
      res.status(404).json({
        ok: false,
        msg: "No hay usuarios con el id " + req.params.id,
      });
    }
  } catch (err) {
    console.log(err);
  }
  next();
};
