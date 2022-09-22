
const generateJWT = require("../../helpers/generateToken");
const persistance = require('../persistence/persistence')

const login = async (req, res) => {

  const { username, password } = req.body;
  const data = persistance.readDB("users.json");

  try {

    const user = data.find(
      (user) => user.username == username && user.password == password
    );

    if (user != undefined) {
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
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

module.exports = {login}
