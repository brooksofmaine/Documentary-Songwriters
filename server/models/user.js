module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    weeklyAchievement: DataTypes.INTEGER,
    LastPlayedInstrument: DataTypes.STRING
    //to do: profilePicture?
  }, {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { },
      }
    }
  });

  User.prototype.toJSON = () => {
    let values = Object.assign({}, this.get({plain: true}));

    delete values.password;
    return values;
  };

  return User;
};
