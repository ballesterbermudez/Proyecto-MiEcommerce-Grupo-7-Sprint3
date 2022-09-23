const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Cart = sequelize.define('Cart', {
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_product: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    
  }, {
    sequelize,
    tableName: 'carts',
    timestamps: true,
    createdAt: false,
    updatedAt: 'date'

  });
  
 
  
  return Cart;
};
