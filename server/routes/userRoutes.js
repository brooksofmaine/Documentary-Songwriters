const express = require('express');
let router = express.Router();
let db;

/*
 * To create a user, post to the endpoint /api/user/create
 * with the username, firstName, lastName, and email in the body of the request
 *
 * For example, to create a user for Bob Smith:
 *   Post /api/user/create
 *   With data:
 *   {
 *     username:  bobbyS
 *     firstName: Bob
 *     lastName:  Smith
 *     email:     email@email.com
 *   }
 */
router.post('/create', (req, res) => {
  db.User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  }).then((newUserInstance) => {
    res.json(newUserInstance.get({ plain: true }));
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'username taken' });
      return;
    }

    console.log('Error while creating user.');
    console.log(err);
    res.status(500).json({ err: err });
  });
});

/*
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
  }).catch((err) => {
    console.log('Error while retrieving user.');
    console.log(err);
    res.status(500).json({ err: err });
  });
});

const keyCheck = (key) => {
  return (key === 'username' ||
          key === 'email' ||
          key === 'firstName' || 
          key === 'lastName');
};

/*
 * To change some attribute of a user, post to the endpoint /api/user/{username}/change/{key}
 * where username is that of the user and key is the name of the attribute to change
 * and with the name and value of the attribute in the body of the request
 *
 * Valid keys are:
 * - username
 * - email
 * - firstName
 * - lastName
 *
 * For example, to change the username of user bobbyS to robertS:
 *   Post /api/user/bobbyS/change/username
 *   With data { username: robertS }
 */
router.post('/:username/change/:key', (req, res) => {
  let username = req.params.username;
  let key = req.params.key;
  let val = req.body[key];
  let updateVals = {};
  updateVals[key] = val;

  if (!keyCheck(key)) {
    res.status(400).json({ err: 'key not recognized' });
    return;
  }

  db.User.update(updateVals, {
    where: {username: username},
    returning: true,
    raw: true
  }).then(([numRows, rowsAffected]) => {
    if (numRows === 0) {
      res.status(404).json({ err: 'user not found' });
      return;
    }

    res.json(rowsAffected[0]);
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'username taken' });
      return;
    }

    console.log(`Error while changing ${key}`);
    console.log(err);
    res.status(500).json({ err: err });
  });
});

module.exports = router;
module.exports.init = (database) => { db = database; };
