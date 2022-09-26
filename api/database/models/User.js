const Sequelize = require("sequelize");


module.exports = function (sequelize, DataTypes) {
  const cols = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        isInt: { msg: "El id debe ser un entero" },
      }
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Ingrese un email correcto" },
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isStr(data){
          if (!(typeof data === 'string')) {
            throw new Error('El username debe ser un string');
          }
        },
        isOnlyNums(data){
          if ((Number(data))) {
            throw new Error('El username debe contener al menos un caracter');
          }
        },
        len: { args: [4,50], msg: "El username debe ser entre 4 y 50 caracteres" },
      }
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isStr(data){
          if (!(typeof data === 'string')) {
            throw new Error('El password debe ser un string');
          }
        },
        len: { args: [6, 50], msg: "El password debe ser entre 6 y 50 caracteres" },
      }
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isStr(data){
          if (!(typeof data === 'string')) {
            throw new Error('El nombre debe ser un string');
          }
        },
        is: {
          args: ["^[a-z]+$", "i"],
          msg: "El nombre no debe contener numeros",
        },
        notEmpty: { msg: "El nombre no puede ser vacio" },
        len: { args: [2, 50], msg: "El nombre debe ser entre 2 y 50 caracteres" },

      }
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isStr(data){
          if (!(typeof data === 'string')) {
            throw new Error('El apellido debe ser un string');
          }
        },
        is: {
          args: ["^[a-z]+$", "i"],
          msg: "El apellido no debe contener numeros",
        },
        notEmpty: { msg: "El apellido no puede ser vacio" },
        len: { args: [2, 50], msg: "El apellido debe ser entre 2 y 50 caracteres" },

      }
    },
    profilepic: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {msg: "Debe ingresar una url valida para su foto de perfil"},
      }
    },
  };

  const extras = {
    tableName: "users",
    timestamps: false,
  };

 

  const User = sequelize.define("User", cols, extras);

  User.associate = (models) => {
    //Relacion Usuario con Rol
    User.belongsTo(models.Role, {
      as: "userrole",
      foreignKey: "id_role",
    });

    //Relacion Usuario con Producto
    User.belongsToMany(models.Product, {
      as: "cart",
      through: "Cart",
      foreignKey: "id_usuario",
      otherKey: "id_product",
    });
  };

  return User;
};
