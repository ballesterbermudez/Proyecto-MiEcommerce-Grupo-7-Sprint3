const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Picture = sequelize.define('Picture', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        isInt: { msg: "El id debe ser un entero" },
      }
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "url",
      validate: {
        notNull: { msg: "El Url es requerido"},
        isUrl: {
          args: true,
          msg: 'debe ingresar una url',
        }
      }
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
