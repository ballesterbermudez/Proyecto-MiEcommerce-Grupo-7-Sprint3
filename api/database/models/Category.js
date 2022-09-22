const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Category = sequelize.define('Category', {
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
  }, {
    sequelize,
    tableName: 'categories',
    timestamps: false,
  });

  

  return Category;
};
