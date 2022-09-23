const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Product = sequelize.define('Product', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_category: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: false,
  });

  Product.associate = (models) => {

    //Relacion Usuario con Producto
    Product.belongsToMany(models.User,{
      as: 'cart',
      through: 'Cart',
      foreignKey: 'id_product',
      otherKey: 'id_usuario'
    })
  }

  return Product;
};
