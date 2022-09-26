const {
  ValidationError,
  SequelizeScopeError,
  UniqueConstraintError,
} = require("sequelize");
const persistence = require("../persistence/persistence");
const persistance = require("../persistence/persistence");

const userConverter = (user) => {
  if (user) {
    const userDT = {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      profilepic: user.profilepic,
    };
    return userDT;
  }
  return null;
};

// const roles = ["GUEST", "ADMIN", "GOD"];
// ---------------------------------------------------------------------

const usersController = {
  listUsers: async (req, res) => {
    try {
      const users = await persistance.searchAll("User");
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
  findUserById: async (req, res) => {
    try {
      const user = await persistance.searchById("User", req.params.userId);
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
  createUser: async (req, res) => {
    try {
      const { role } = req.body;
      //CHECK SI EXISTE UN USUARIO CON EL ID
      if (await persistance.searchById("User", req.body.id)) {
        res.status(412).json({
          ok: false,
          msg: `El usuario con id ${req.body.id} ya existe`,
        });
        //CHECK SI EL ROLE EXISTE
      } else if (!(await persistance.searchById("Role", req.body.id_role))) {
        console.log(req.body.role);
        res.status(412).json({
          ok: false,
          msg: `El rol debe ser GUEST, ADMIN o GOD`,
        });
        //CHECK SI NO LLEGA NADA VACIO EN EL BODY
      } else if (
        req.body.id !== undefined &&
        req.body.email !== undefined &&
        req.body.username !== undefined &&
        req.body.password !== undefined &&
        req.body.first_name !== undefined &&
        req.body.last_name !== undefined
      ) {
        const newUser = {
          id: req.body.id,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          profilepic:
            req.body.profilepic === undefined ? null : req.body.profilepic,
          id_role: req.body.id_role,
        };
        await persistance.inster("User", newUser);
        const newUserDT = userConverter(newUser);

        res.status(200).json({
          ok: true,
          msg: `El usuario ${req.body.username} se ha creado correctamente`,
          user: newUserDT,
        });
      } else {
        res.status(412).json({
          ok: false,
          msg: `El usuario debe tener los siguientes datos: id, email, username, password, firstname, lastname y role.`,
        });
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        let errorArray = [];
        error.errors.forEach((el, i) => {
          errorArray[i] = el.message;
        });
        res.status(401).json({ ok: false, msg: errorArray });
      } else {
        res.status(500).json({ ok: false,msg: "No fue posible crear el usuario" });
      }
    }
  },
  editUser: async (req, res) => {
    try {
      const userToEdit = await persistance.searchById(
        "User",
        req.params.userId
      );
      const { id_role } = req.body;
      if (
        id_role !== undefined &&
        !(await persistance.searchById("Role", id_role))
      ) {
        res.status(412).json({
          ok: false,
          msg: `El rol debe ser GUEST, ADMIN o GOD`,
        });
      } else if (userToEdit) {
        const dataToEdit = {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          profilepic: req.body.profilepic,
          id_role: req.body.id_role,
        };
        console.table(dataToEdit);
        await persistance.updateData("User", req.params.userId, dataToEdit);
        const userEdited = await persistance.searchById(
          "User",
          req.params.userId
        );
        const userEditedDT = userConverter(userEdited);
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
  deleteUser: async (req, res) => {
    try {
      const userToDelete = await persistance.searchById(
        "User",
        req.params.userId
      );
      if (userToDelete) {
        persistance.delete("User", userToDelete.id);
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
