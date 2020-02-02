module.exports = (sequelize, DataTypes) => {
  let Recording = sequelize.define('Recording', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    startTime: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    endTime: DataTypes.STRING,
    numPitches: DataTypes.INTEGER,
    instrument: DataTypes.STRING,
    description: DataTypes.STRING
  });

  return Recording;
};
