const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { Client } = require('pg');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const defaultURI = 'postgres://' + config.username + ':' + config.password + '@' + config.host + ':' + config.port + '/postgres';
let db = {};

// create database using pg (sequelize sync creates tables)
module.exports.init = (cb) => {
  const client = new Client({ connectionString: defaultURI });
  client.connect((err) => {
    if (err) throw err;
  });

  client.query('CREATE DATABASE ' + config.database, (err, res) => {
    client.end();
    

    let sequelize;
    // TODO change config setup for custom use (DONT STORE PASSWORD IN PLAIN TEXT IN PROD - config.js)
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
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

    cb(db);
  });
};

/*******************************************************************
    USERS
*******************************************************************/

module.exports.createUser = (username, firstName, lastName, email) => {
  return db.User.create({
    username: username,
    firstName: firstName,
    lastName: lastName,
    email: email
  }).then((modelInstance) => {
    return modelInstance.get({plain: true});
  });
};

module.exports.getUser = (username) => {
  return db.User.findByPk(username).then((modelInstance) => {
    return modelInstance.get({plain: true});
  });
};

module.exports.changeUsername = (old_username, new_username) => {
  return db.User.update({
    username: new_username
  }, {
    where: {username: old_username},
    returning: true,
    raw: true
  }).then(([numRows, [user]]) => {
    return user;
  });
};

module.exports.changeEmail = (username, email) => {
  return db.User.update({
    email: email
  }, {
    where: {username: username},
    returning: true,
    raw: true
  }).then(([numRows, [user]]) => {
    return user;
  });
};

module.exports.changeFirstName = (username, firstName) => {
  return db.User.update({
    firstName: firstName
  }, {
    where: {username: username},
    returning: true,
    raw: true
  }).then(([numRows, [user]]) => {
    return user;
  });
};

module.exports.changeLastName = (username, lastName) => {
  return db.User.update({
    lastName: lastName
  }, {
    where: {username: username},
    returning: true,
    raw: true
  }).then(([numRows, [user]]) => {
    return user;
  });
};


/*******************************************************************
    RECORDINGS
*******************************************************************/


module.exports.createRecording = (username, start, end, numPitches, instrument, description) => {
  // get a user, create a recording form the user
  // We need the line that estblishes association between users and recordings
  // Create a recording by first getting the user and calling the addRecording function

  // Create a recording agnostic of 

  return db.Recording.create({
    username: username,
    start: start,
    end: end,
    instrument: instrument,
    numPitches: numPitches,
    description: description
  }).then((modelInstance) => {
    return modelInstance.get({plain: true});
  });
};

module.exports.getRecording = (username, lowRange, highRange) => {
  return db.Recording.findAll({
    where: {
      username: username, 
      start: {
        [Op.lte]: highRange,
        [Op.gte]: lowRange
      }
    }
  }).then((modelInstance) => {
    return modelInstance.get({plain: true});
  });
};


module.exports.changeRecordingDescription = (username, start, description) => {
  return db.Recording.update({
    description: description
  }, {
    where: {
      username: username,
      start: start
    },
    returning: true,
    raw: true
  }).then(([numRows, [recording]]) => {
    return recording;
  });
};






