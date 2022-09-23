const Sequelize = require('sequelize');
const usersController = require('../../controllers/usersController');
module.exports = function(sequelize, DataTypes) {
  const cols = {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    email:{
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    username:{
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password:{
      type: DataTypes.STRING(50),
      allowNull: false
    },
    first_name:{
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name:{
      type: DataTypes.STRING(50),
      allowNull: false
    },
    profilepic:{
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }

  const extras = {
    tableName: 'users',
    timestamps: false
  }

  const User = sequelize.define('User', cols, extras)
   
  User.associate = (models) => {

    //Relacion Usuario con Rol
    User.belongsTo(models.Role, {
      as: 'userrole',
      foreignKey: 'id_role'
    })

    //Relacion Usuario con Producto
    User.belongsToMany(models.Product,{
      as: 'usuarioproducto',
      through: 'Cart',
      foreignKey: 'id_usuario',
      otherKey: 'id_product'
    })
  }

  return User;
};
