const generateJWT = require("../../helpers/generateToken");
const persistance = require("../persistence/persistence");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {

    const user = await persistance.searchBYUsername(username, password);
   
    if (user != null) {
      
      const {id,username,userrole}=user
      const {role}=userrole

      const payload = {
        id: id,
        username: username,
        role: role,
      };

      res.status(200).json({
        success: true,
        message: "Authorized",
        user: {
          iduser: id,
          username:username,
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
    res.status(500).json({
      ok: false,
      msg: "Error interno del server",
    });
  }
};

module.exports = { login };
