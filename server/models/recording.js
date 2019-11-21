module.exports = (sequelize, DataTypes) => {
  let Recording = sequelize.define('Recording', {
    start: {
      type: DataTypes.DATE,
      primaryKey: true
    },
    end: DataTypes.DATE,
    numPitches: DataTypes.INTEGER,
    instrument: DataTypes.STRING,
    description: DataTypes.STRING
  });

  return Recording;
};
