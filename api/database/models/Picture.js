const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Picture = sequelize.define('Picture', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "url"
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    
  }, {
    sequelize,
    tableName: 'pictures',
    timestamps: false,
  });
  
  Picture.associate = (models) => {
    //Relacion Categoria con Producto
    Picture.belongsTo(models.Product, {
      as: 'galery',
      foreignKey: 'id_product'
    })
  }
  
  return Picture
};
