module.exports = (sequelize, DataTypes) => {
  let Group = sequelize.define('Group', {
    groupName: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    dateCreated: DataTypes.DATE,
    description: DataTypes.STRING,
    public: DataTypes.BOOLEAN
  });

  return Group;
};
