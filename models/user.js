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
    dateCreated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
    //to do: profilePicture?
  });

  return User;
};
