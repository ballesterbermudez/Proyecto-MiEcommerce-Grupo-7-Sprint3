const generateJWT = require("../../helpers/generateToken");
const persistance = require("../persistence/persistence");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {

    const user = await persistance.searchBYUsername(username, password);
   
    if (user != null) {

      const payload = {
        id: user.id,
        username: user.username,
        role: user.userrole.role,
      };

      res.status(200).json({
        success: true,
        message: "Authorized",
        user: {
          iduser: user.id,
          username: user.username,
        },
        token: await generateJWT(payload),
      });
    } else {
      res.status(400).json({
        ok: false,
        msg: "Este usuario no existe",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Login",
    });
  }
};

module.exports = { login };
