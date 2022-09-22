const persistence = require('../persistence/persistence')


const userConverter = (user) => {
  if (user) {
    const userDT = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      profilepic: user.profilepic,
      role: user.role,
      cart: user.cart,
    };
    return userDT;
  }
  return null;
};
// ---------------------------------------------------------------------

const roles = ["GUEST", "ADMIN", "GOD"];
const usersController = {
  listUsers: (req, res) => {
    try {
      const users = persistence.readDB("users.json");

      const usersDT = users.map((ele) => userConverter(ele));
      res.status(200).json({
        ok: true,
        msg: "Lista de usuarios obtenida correctamente",
        users: usersDT,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Error al leer la base de datos",
      });
    }
  },
  findUserById: (req, res) => {
    try {
      const user = persistence.findByIdDB("users.json", req.params.userId);
      if (user) {
        const userDT = userConverter(user);
        res.status(200).json({
          ok: true,
          msg: "Usuario obtenido correctamente",
          users: userDT,
        });
      } else {
        res.status(401).json({
          ok: false,
          msg: `Usuario con id ${req.params.userId} no existe`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Error al leer la base de datos",
      });
    }
  },
  createUser: (req, res) => {
    try {
      const { role } = req.body;
      if (persistence.findByIdDB("users.json", req.body.id)) {
        res.status(412).json({
          ok: false,
          msg: `El usuario con id ${req.body.id} ya existe`,
        });
      } else if (!roles.includes(role.toUpperCase())) {
        console.log(req.body.role);
        res.status(412).json({
          ok: false,
          msg: `El rol debe ser GUEST, ADMIN o GOD`,
        });
      } else if (
        req.body.id !== undefined &&
        req.body.email !== undefined &&
        req.body.username !== undefined &&
        req.body.password !== undefined &&
        req.body.firstname !== undefined &&
        req.body.lastname !== undefined
      ) {
        const users = persistence.readDB("users.json");
        const newUser = {
          id: req.body.id,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          profilepic:
            req.body.profilepic === undefined ? null : req.body.profilepic,
          role: req.body.role.toUpperCase(),
          cart: [],
        };

        users.push(newUser);
        const newUserDT = userConverter(newUser);
        persistence.writeDB("users.json", users);

        res.status(200).json({
          ok: true,
          msg: `El usuario ${req.body.firstname} se ha creado correctamente`,
          user: newUserDT,
        });
      } else {
        res.status(412).json({
          ok: false,
          msg: `El usuario debe tener los siguientes datos: id, email, username, password, firstname, lastname y role.`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Error al leer la base de datos",
      });
    }
  },editUser: (req, res) => {
    try {
      const userToEdit = persistence.findByIdDB("users.json", req.params.userId);
      const { role } = req.body;
      if (role !== undefined && !roles.includes(role.toUpperCase())) {
        res.status(412).json({
          ok: false,
          msg: `El rol debe ser GUEST, ADMIN o GOD`,
        });
      } else if (userToEdit) {
        userToEdit.email =
          req.body.email === undefined 
            ? userToEdit.email 
            : req.body.email;
        userToEdit.username =
          req.body.username === undefined
            ? userToEdit.username
            : req.body.username;
        userToEdit.password =
          req.body.password === undefined
            ? userToEdit.password
            : req.body.password;
        userToEdit.firstname =
          req.body.firstname === undefined
            ? userToEdit.firstname
            : req.body.firstname;
        userToEdit.lastname =
          req.body.lastname === undefined
            ? userToEdit.lastname
            : req.body.lastname;
        userToEdit.profilepic =
          req.body.profilepic === undefined
            ? userToEdit.profilepic
            : req.body.profilepic;
        userToEdit.role =
          req.body.role === undefined
            ? userToEdit.role
            : req.body.role.toUpperCase();

        const users = persistence.readDB("users.json");
        const newUserData = users.filter(
          (ele) => ele.id !== Number(req.params.userId)
        );
        newUserData.push(userToEdit);
        persistence.writeDB("users.json", newUserData);
        const userEditedDT = userConverter(userToEdit);
        res.status(200).json({
          ok: true,
          msg: `Usuario ${userToEdit.username} editado con exito`,
          user: userEditedDT,
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: `Usuario ${req.params.userId} no existe`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Error al leer la base de datos",
      });
    }
  },
  //HACER UPDATE CON BORRAR CARRITO ANTES DE BORRAR USER
  deleteUser: (req, res) => {
    try {
      const userToDelete = persistence.findByIdDB("users.json", req.params.userId);
      if (userToDelete) {
        persistence.removeFromDB("users.json", userToDelete.id)
        const userDeletedDT = userConverter(userToDelete);
        res.status(200).json({
          ok: true,
          msg: `Se ha borrado el usuario.`,
          userDeleted: userDeletedDT,
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: `El usuario con id ${req.params.userId} no existe.`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Error al leer la base de datos",
      });
    }
  },
};

module.exports = usersController;
