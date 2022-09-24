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
    mostwanted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false 
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
    
  } 
   const extras = {
    sequelize,
    tableName: 'products',
    timestamps: false,
  }
  
  
  const Product = sequelize.define(alias, cols, extras);
  
  Product.associate = (models) => {
    //Relacion Categoria con Producto
    Product.belongsTo(models.Category, {
      as: 'category_product',
      foreignKey: 'id_category'
    }),
      //Relacion Usuario con Producto
      Product.belongsToMany(models.User,{
        as: 'cart',
        through: 'Cart',
        foreignKey: 'id_product',
        otherKey: 'id_usuario'
      }),
      //Relacion Producto con picture
      Product.hasMany(models.Picture, {
        as: "galery",
        foreignKey: "id_product"
      })

}
return Product;
}
