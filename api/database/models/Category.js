const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {

  const alias = 'Category';
  const cols = {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "title"
    }
  } 

  const extra = {
    tableName: 'categories',
    timestamps: false,
  }

  const Category = sequelize.define(alias, cols, extra);

  Category.associate = (models) => {
      Category.hasMany(models.Product , {
        as: 'product_category',
        foreignKey: 'id_category'
      })
  }
  

  return Category;
};
