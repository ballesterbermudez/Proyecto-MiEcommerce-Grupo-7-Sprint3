
module.exports = function (sequelize, DataTypes) {
  const Cart = sequelize.define(
    "Cart",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      id_product: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
          isInt: {
            args: true,
            msg: "El id del producto debe ser un entero",
          },
          min: {
            args: [1],
            msg: "El id del producto debe ser mayor a cero",
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          isInt: {
            args: true,
            msg: "La cantidad debe ser un entero",
          },
          min: {
            args: [1],
            msg: "La cantidad debe ser mayor a 0",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "carts",
      timestamps: true,
      createdAt: false,
      updatedAt: "date",
    }
  );

  return Cart;
};
