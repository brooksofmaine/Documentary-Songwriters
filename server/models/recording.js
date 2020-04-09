module.exports = (sequelize, DataTypes) => {
  let Recording = sequelize.define('Recording', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    startTime: {
      type: DataTypes.DATE,
      primaryKey: true
    },
    endTime: DataTypes.DATE,
    numPitches: DataTypes.INTEGER,
    instrument: DataTypes.STRING,
    description: DataTypes.STRING
  });

  return Recording;
};
