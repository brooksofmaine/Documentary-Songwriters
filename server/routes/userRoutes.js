const express = require('express');
const utils = require('./utils');
const anyValuesUndefined = utils.anyValuesUndefined;
const userKeyCheck = utils.userKeyCheck;
let router = express.Router();
let db;

/*
 * TODO: Implement login       - POST /api/user/login
 * TODO: Add recording to user - POST /api/user/{username}/record
 * TODO: Get recording of user - GET  /api/user/{username}/?...
 */

/*
 * TODO: Make sure not already logged in
 * TODO: hash password
 *
 * To create a user, post to the endpoint /api/user/create
 * with the username, firstName, lastName, and email in the body of the request
 *
 * For example, to create a user for Bob Smith:
 *   Post /api/user/create
 *   With data:
 *   {
 *     username:  "bobbyS",
 *     firstName: "Bob",
 *     lastName:  "Smith",
 *     email:     "email@email.com"
 *   }
 */
router.post('/create', (req, res) => {
  let createObj = {
    username:  req.body.username,
    firstName: req.body.firstName,
    lastName:  req.body.lastName,
    email:     req.body.email,
    password:  req.body.password // TODO hash password
  };

  // console.log(req.body);
  // console.log(createObj);

  if (anyValuesUndefined(createObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  db.User.create(createObj).then((newUserInstance) => {
    res.json(newUserInstance.get({ plain: true }));
    return;
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'username taken' });
      return;
    }

    console.log('Error while creating user.');
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});

// TODO implement me
router.post('/login', (req, res) => {
  res.redirect('/' + req.body.username);
});

/*
 * TODO: Show list of groups user is in or is admin of only if user is viewing themselves
 *
 * To get a user, get the endpoint /api/user/{username}
 * where username is that of the user
 *
 * For example, to get user bobbyS:
 *   Get /api/user/bobbyS
 */
router.get('/:username', (req, res) => {
  db.User.findByPk(req.params.username).then((modelInstance) => {
    if (modelInstance === null) {
      res.status(404).json({ err: 'user not found' });
      return;
    }

    res.json(modelInstance.get({ plain: true }));
    return;
  }).catch((err) => {
    console.log('Error while retrieving user.');
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});

/*
 * TODO Ensure user is logged in and user making request is changing only themselves
 * TODO hash password if changing password
 *
 * To change some attribute of a user, post to the endpoint /api/user/{username}/change/{key}
 * where username is that of the user and key is the name of the attribute to change
 * and with the name and value of the attribute in the body of the request
 *
 * Valid keys for users are:
 * - username
 * - email
 * - firstName
 * - lastName
 *
 * For example, to change the username of user bobbyS to robertS:
 *   Post /api/user/bobbyS/change/username
 *   With data { username: "robertS" }
 */
router.post('/:username/change/:key', (req, res) => {
  let username = req.params.username;
  let key = req.params.key;
  let val = req.body[key];
  let updateObj = {};
  updateObj[key] = val;

  if (!userKeyCheck(key)) {
    res.status(400).json({ err: 'key not recognized' });
    return;
  }

  if (anyValuesUndefined(updateObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  db.User.update(updateObj, {
    where: { username: username },
    returning: true,
    raw: true
  }).then(([numRows, rowsAffected]) => {
    if (numRows === 0) {
      res.status(404).json({ err: 'user not found' });
      return;
    }

    res.json(rowsAffected[0]);
    return;
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'username taken' });
      return;
    }

    console.log(`Error while changing ${key}`);
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});



/*
 * TODO: can we filter by start time in here?
 * it wasn't working so well within the `where` clause, but maybe we can do it 
 * after getting the recordingArr
 * 
 * To get a user's recordings, get the endpoint 
 * /api/user/{username}/recordings
 *
 * where username is that of the user
 *
 * For example, to get recordings for user bobbyS,
 * 
 *   GET /api/user/bobbyS/recordings
 *
 */
router.get('/:username/recordings', (req, res) => {
  db.Recording.findAll({
    where: {
      username: req.params.username
    }
  }).then((recordingArr) => {
    if (recordingArr === null) {
      res.status(404).json({ err: 'recordings not found' });
      return;
    }
    res.json(recordingArr.map((recording) => { return recording.get({ plain: true }) }));
    return;

  }).catch((err) => {
    console.log('Error while retrieving recordings.');
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});



module.exports = router;
module.exports.init = (database) => { db = database; };
