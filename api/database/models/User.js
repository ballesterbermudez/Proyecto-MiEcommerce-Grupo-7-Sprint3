const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "email"
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "username"
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    profilepic: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
  });

  return User;
};
