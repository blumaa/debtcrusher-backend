const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    name: DataTypes.STRING,
    goal: DataTypes.INTEGER,
    school: DataTypes.STRING,
    perMonth: DataTypes.INTEGER,
    stripe_user_id: DataTypes.STRING,
    funded: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }

  }, {});
  Project.associate = function(models) {
    Project.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
    Project.hasMany(models.ProjectBacker, {
      foreignKey: 'primaryProjectId',
      as: 'projectBackers'
    })
    Project.hasMany(models.SecondaryBacker, {
      foreignKey: 'secondaryProjectId',
      as: 'secondaryBackers'
    })

  };
  return Project;
};
