module.exports = (sequelize, DataTypes) => {
  let Recording = sequelize.define('Recording', {
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    numPitches: DataTypes.INTEGER,
    instrument: DataTypes.STRING,
    description: DataTypes.STRING
  });

  return Recording;
};
