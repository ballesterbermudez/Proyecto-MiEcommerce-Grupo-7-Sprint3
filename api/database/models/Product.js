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
      allowNull: false,
      validate: {
        notNull: { msg: "El titulo es requerido"},
        len: {
          args: [3,50],
          msg: "El titulo debe contener entre 3 y 50 caracteres"
        }
      }

    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {msg: "El precio es requerido"},
        min: {
          args: [0],
          msg: "El precio no puede ser negativo"
        },
        isDecimal: {
          args: true,
          msg: "El precio debe ser numerico"
        }
      }
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mostwanted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: {
          args: true,
          msg: "MostWanted puede ser true o false"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt :{
          args: true,
          msg: "Stock debe ser un entero"
        },
        min: {
          args: [0],
          msg: "Stock no puede ser negativo"
        }
      }
    },
    id_category: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'id'
      },
      allowNull: false,
      validate: {
        notNull: {msg: 'Debe ingresar un id de categoria'},
        isInt: {
          args: true,
          msg: "El id de categoria debe ser un numero"
        }
      }
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
