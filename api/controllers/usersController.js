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
};
const userRolConverter = (user) => {
  if (user) {
    const userDT = {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      profilepic: user.profilepi,
      role_data: user.userrole,
    };
    return userDT;
  }
};

const usersController = {
  listUsers: async (req, res) => {
    try {
      //TRAIGO TODOS LOS USUARIOS
      const users = await persistance.searchAll("User");
      //PASO USUARIOS A USUARIOS DT PARA NO MOSTRAR LA PASS
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
      //BUSCO EL USUARIO CON EL ID DEL PARAM Y CHEQUEO SI EXISTE
      // const user = await persistance.searchById("User", req.params.userId);
      const user = await persistance.searchByCriteria("User", {
        include: ["userrole"],
        where: { id: req.params.userId },
      });
      console.log(user);
      if (user.length > 0) {
        //PASO EL USUARIO A USUARIODT PARA MOSTRAR SIN LA PASS
        let userDT = userRolConverter(user[0]);
        res.status(200).json({
          ok: true,
          msg: "Usuario obtenido correctamente",
          user: userDT,
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

      //CHECK SI EL ROL INGRESADO EXISTE EN LA BASE
      if (!(await persistance.searchById("Role", req.body.id_role))) {
        res.status(412).json({
          ok: false,
          msg: `El rol debe ser GUEST, ADMIN o GOD`,
        });
        //CHECK SI NO LLEGA NADA VACIO EN EL BODY
      } else if (
        req.body.email !== undefined &&
        req.body.username !== undefined &&
        req.body.password !== undefined &&
        req.body.first_name !== undefined &&
        req.body.last_name !== undefined
      ) {
        //CREO UN USUARIO CON LOS DATOS DEL BODY
        const newUser = {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          profilepic:
            req.body.profilepic === undefined ? null : req.body.profilepic,
          id_role: req.body.id_role,
        };
        //GUARDO EL USUARIO EN LA BASE DE DATOS
        await persistance.inster("User", newUser);
        //PASO EL USUARIO A USUARIO DT PARA RETORNAR SIN PASS
        const newUserDT = userConverter(newUser);

        res.status(200).json({
          ok: true,
          msg: `El usuario ${req.body.username} se ha creado correctamente`,
          user: newUserDT,
        });
      } else {
        res.status(412).json({
          ok: false,
          msg: `El usuario debe tener los siguientes datos: email, username, password, firstname, lastname y role.`,
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
        res
          .status(500)
          .json({ ok: false, msg: "No fue posible crear el usuario" });
      }
    }
  },
  editUser: async (req, res) => {
    try {
      //BUSCO EL USUARIO CON EL ID DE PARAM
      const userToEdit = await persistance.searchById(
        "User",
        req.params.userId
      );
      const { id_role } = req.body;
      //CHEQUEO SI TIENE ROLE Y Q EXISTA EN LA TABLA ROLE
      if (
        id_role !== undefined &&
        !(await persistance.searchById("Role", id_role))
      ) {
        res.status(412).json({
          ok: false,
          msg: `El rol debe ser GUEST, ADMIN o GOD`,
        });
      } else if (userToEdit) {
        //CHECQUEO QUE SI QUIERE CAMBIAR EL ROL SEA GOD
        if (id_role !== undefined && userToEdit.id_role !== 1) {
          res.status(401).json({
            ok: false,
            msg: `El rol solo puede cambiado por un usuario GOD`,
          });
        } else {
          //CREO LA DATA PARA EDITAR CON EL BODY
          const dataToEdit = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            profilepic: req.body.profilepic,
            id_role: req.body.id_role,
          };
          //ACTUALIZO LOS DATOS EN LA BASE DE DATOS
          await persistance.updateData("User", req.params.userId, dataToEdit);
          //TRAIGO EL USUARIO ACTUALIZADO
          const userEdited = await persistance.searchById(
            "User",
            req.params.userId
          );
          //PASO USUARIO A USUARIODT PARA MOSTRARLO SIN PASS
          const userEditedDT = userConverter(userEdited);
          res.status(200).json({
            ok: true,
            msg: `Usuario ${userToEdit.username} editado con exito`,
            user: userEditedDT,
          });
        }
      } else {
        res.status(404).json({
          ok: false,
          msg: `Usuario ${req.params.userId} no existe`,
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
        console.log(error);
        res.status(500).json({
          ok: false,
          msg: "Error al leer la base de datos",
        });
      }
    }
  },
  //HACER UPDATE CON BORRAR CARRITO ANTES DE BORRAR USER
  deleteUser: async (req, res) => {
    try {
      //BUSCO EL USUARIO CON EL ID DE PARAM
      const userToDelete = await persistance.searchById(
        "User",
        req.params.userId
      );
      //CHEQUEO SI EXISTE EL USER
      if (userToDelete) {
        //BORRO EL CARRITO DEL USER
        const user = await persistance.getCartByUserID(req.params.userId);
        const cart = user.cart;

        for (let i = 0; i < cart.length; i++) {
          const producto = await persistance.searchById(
            "Product",
            cart[i].Cart.id_product
          );
          const nuevoStock = producto.stock + cart[i].Cart.quantity;
          await persistance.updateData("Product", producto.id, {
            stock: nuevoStock,
          });
          await persistance.deleteOneProduct(req.params.userId, producto.id);
        }

        //ELIMINO DE LA BASE DE DATOS EL USUARIO CON EL ID DE PARAM
        persistance.delete("User", userToDelete.id);
        //PASO EL USER BORRADO A USUARIODT PARA MOSTRAR SIN LA PASS
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
