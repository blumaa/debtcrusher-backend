'use strict';
module.exports = (sequelize, DataTypes) => {
  const SecondaryBacker = sequelize.define('SecondaryBacker', {
    secondaryProjectId: DataTypes.INTEGER,
    secondaryBackerId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {});
  SecondaryBacker.associate = function(models) {
    // associations can be defined here
    SecondaryBacker.belongsTo(models.User, {
      foreignKey: "secondaryBackerId",
      onDelete: "CASCADE"
    });
    SecondaryBacker.belongsTo(models.Project, {
      foreignKey: "secondaryProjectId",
      onDelete: "CASCADE"
    });

  };
  return SecondaryBacker;
};
