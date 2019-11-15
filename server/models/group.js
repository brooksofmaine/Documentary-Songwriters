module.exports = (sequelize, DataTypes) => {
  let Group = sequelize.define('Group', {
    groupName: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    description: DataTypes.STRING,
    visible: DataTypes.BOOLEAN
  });

  return Group;
};
