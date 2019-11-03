module.exports = (sequelize, DataTypes) => {
  let Recording = sequelize.define('Recording', {
    start: DataTypes.DATE, 
    end: DataTypes.DATE,
    pitchesPlayed: DataTypes.INTEGER,
    description: DataTypes.STRING
  });

  return Recording;
};
