const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { Client } = require('pg');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
<<<<<<< HEAD
const defaultURI = process.env.DATABASE_URL || 'postgres://' + config.username + ':' + config.password + '@' + config.host + ':' + config.port + "/" + config.database;
=======
>>>>>>> 6f00ce2c293748a1635bec0830119bbc45d488a5
let db = {};


// create database using pg (sequelize sync creates tables)
module.exports.init = (done) => {
    let sequelize;
    // TODO change config setup for custom use (DONT STORE PASSWORD IN PLAIN TEXT IN PROD - config.js)
    if (config.use_env_variable && process.env[config.use_env_variable]) {
      sequelize = new Sequelize(process.env[config.use_env_variable], {logging: false});
    } else {
      sequelize = new Sequelize(config.database, config.username, config.password, config);
    }

    fs
      .readdirSync(__dirname)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
      })
      .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
      });

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    db.User.hasMany(db.Recording, {as: 'recordings', foreignKey: 'username'});



    let UserGroups = sequelize.define("user_groups", {
      role: Sequelize.STRING
    });

    // db.User.belongsToMany(db.Group, {through: 'GroupUser'});
    // db.Group.belongsTo(db.User, {as: 'admin'});
    db.User.belongsToMany(db.Group, {through: UserGroups});
    db.Group.belongsToMany(db.User, {through: UserGroups});

    done(db);
};
