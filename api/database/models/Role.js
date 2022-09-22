const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Role = sequelize.define('Role', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "role"
    }
  }, {
    sequelize,
    tableName: 'roles',
    timestamps: false,
  });

  Role.associate = (models) => {

    Role.hasMany(models.User, {
      as: 'roleUser',
      foreignKey: 'id_role'
    })
  }

  return Role;
};
