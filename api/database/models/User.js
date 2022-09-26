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
        is: {
          args: /^[a-z]+$/i,
          msg: "El username debe ser un string",
        },
        min: { args: 4, msg: "El username debe tener 4 caracteres minimo" },
      }
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        min: { args: 6, msg: "La contrasenia debe tener 6 caracteres minimo" },
      }
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: {
          args: ["^[a-z]+$", "i"],
          msg: "El nombre no debe contener numeros",
        },
        notEmpty: { msg: "El nombre no puede ser vacio" },
      }
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: {
          args: ["^[a-z]+$", "i"],
          msg: "El apellido no debe contener numeros",
        },
        notEmpty: { msg: "El apellido no puede ser vacio" },
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
