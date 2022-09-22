const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  
  const alias = "Product"

  const cols = {
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
    
  } 
   const extras = {
    sequelize,
    tableName: 'products',
    timestamps: false,
  }
  
  
  const Product = sequelize.define(alias, cols, extras);
  
  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      as: 'category_product',
      foreingKey: 'id_category'
    }),
    Product.belongsToMany(models.Cart, {
      as: 'cartProduct',
      through: 'carts',
      foreingKey: 'product_id',
      other: 'user_id'
    })

  }

  return Product;
};
