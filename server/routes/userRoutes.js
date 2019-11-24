const express = require('express');
const utils = require('./utils');
const anyValuesUndefined = utils.anyValuesUndefined;
const userKeyCheck = utils.userKeyCheck;
let router = express.Router();
let db;

/*
 * TODO: Make sure not already logged in
 * TODO: hash password
 */
router.post('/create', (req, res) => {
  let createObj = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password // TODO hash password
  };

  // TODO make this a blank/null/undefined check
  if (anyValuesUndefined(createObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  db.User.create(createObj).then((user) => {
    res.redirect(`${user.get('username')}`)
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

/*
 * TODO: Show list of groups user is in or is admin of only if user is viewing themselves
 */
router.get('/:username', (req, res) => {
  db.User.findOne({
    where: { username: req.params.username },
    include: [
      { model: db.Group, attributes: ['groupName'], through: { attributes: [] } }
    ]
  }).then((user) => {
    if (user === null) {
      res.status(404).json({ err: 'user not found' });
      return;
    }

    res.json(user);
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
 */
router.post('/edit', (req, res) => {
  let username = req.body.username; // TODO get this from auth
  let key = req.body.key;
  let val = req.body.value;
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
    returning: true
  }).then(([numRows, rowsAffected]) => {
    if (numRows === 0) {
      res.status(404).json({ err: 'user not found' });
      return;
    }

    res.redirect(`${rowsAffected[0].get('username')}`);
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

module.exports = router;
module.exports.init = (database) => { db = database; };
