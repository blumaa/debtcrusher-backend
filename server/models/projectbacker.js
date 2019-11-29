"use strict";
module.exports = (sequelize, DataTypes) => {
  const ProjectBacker = sequelize.define(
    "ProjectBacker",
    {
      primaryProjectId: DataTypes.INTEGER,
      backerId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER
    }
  );
  ProjectBacker.associate = function(models) {
    ProjectBacker.belongsTo(models.User, {
      foreignKey: "backerId",
      onDelete: "CASCADE"
    });
    ProjectBacker.belongsTo(models.Project, {
      foreignKey: "primaryProjectId",
      onDelete: "CASCADE"
    });
  };
  return ProjectBacker;
};
