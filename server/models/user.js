const bcrypt = require("bcrypt-nodejs");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      displayName: {
        type: Sequelize.STRING,
        unique: true
      },
      birthDate: {
        type: Sequelize.DATEONLY
      },
      bio: {
        type: Sequelize.STRING
      },
      donationPool: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    },
    {}
  );
  User.beforeSave((user, options) => {
    if (user.changed("password")) {
      user.password = bcrypt.hashSync(
        user.password,
        bcrypt.genSaltSync(10),
        null
      );
    }
  });
  User.prototype.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };
  User.associate = function(models) {
    User.hasOne(models.Project, {
      foreignKey: 'userId',
      as: 'project'
    })
    User.hasMany(models.ProjectBacker, {
      foreignKey: 'backerId',
      as: 'backing'
    })
    User.hasMany(models.SecondaryBacker, {
      foreignKey: 'secondaryBackerId',
      as: 'secondaryBacking'
    })

    // associations can be defined here
  };
  return User;
};
