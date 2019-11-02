module.exports = (sequelize, DataTypes) => {
  let Recording = sequelize.define('Recording', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    start: {
        type: DataTypes.DATE,
        primaryKey: true
    }, 
    end: DataTypes.DATE,
    numPitches: DataTypes.INTEGER,
    description: DataTypes.STRING
  });

  return Recording;
};
