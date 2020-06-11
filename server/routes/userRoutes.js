const express = require('express');
const utils = require('./utils');
const anyValuesUndefined = utils.anyValuesUndefined;
const userKeyCheck = utils.userKeyCheck;
let router = express.Router();
const hashPassword = require('../auth/passport-setup').hashPassword;
const ensureAuthenticated = utils.ensureAuthenticated;
let db;


router.get('/:userName/getGroups', (req, res) => {
   let userName = req.params.userName;
   console.log("in getGroups!");

   // check that user exists first
   let user = db.User.findByPk(userName).then((modelInstance) => {
     if (modelInstance === null) {
        console.log("Did not find any users")
       res.status(404).json({ err: 'user not found' });
       return;
     }

     db.User.findOne({
        where: {username : userName},
        include: db.Group
     }).then((result) => {
        res.json(result.get({plain: true}))
     });
     return;
   }).catch((err) => {
     console.log('Error while retrieving user.');
     console.log(err);
     res.status(500).json({ err: err });
     return;
   });

 });



router.post('/:userName/addGroups', (req, res) =>{
  let userName = req.params.userName;
  let groupObj = {
    groupName: req.body.groupName,
    description: req.body.description,
    visible: req.body.visible
  };

  if (anyValuesUndefined(groupObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }
  db.User.findByPk(userName).then((UserInstance) => {
      db.Group.findByPk(req.body.groupName).then((newGroupInstance) => {
        if (newGroupInstance == null) {
          console.log('Group name not found');
          res.status(404).json({err: 'Group name not found'});
          return
        }

        UserInstance.addGroup(newGroupInstance, {}).then((x) => {
        res.json(newGroupInstance.get({ plain: true }));
        return;
        })

      }).catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          res.status(409).json({ err: 'group name taken' });
          return;
        }

        console.log('Error while creating group.');
        console.log(err);
        res.status(500).json({ err: err });
        return;
      });
  }).catch((err) => {
     console.log('Error while retrieving user.');
     console.log(err);
     res.status(500).json({ err: err });
     return;
  });
});

/*
 * TODO: Make sure not already logged in
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
// WARNING: for now, this only returns a success message due to some weird bugs.
router.post('/create', async (req, res) => {
  let createObj = {
    username:  req.body.username,
    firstName: req.body.firstName,
    lastName:  req.body.lastName,
    email:     req.body.email,
    password:  await hashPassword(req.body.password),
    weeklyAchievement: req.body.weeklyAchievement,
    LastPlayedInstrument: req.body.LastPlayedInstrument
  };

  if (createObj.LastPlayedInstrument === undefined) {
    createObj.LastPlayedInstrument = "";
  }

  // console.log(req.body);
  // console.log(createObj);

  if (anyValuesUndefined(createObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  try {
    let newUserInstance = await db.User.create(createObj);
    res.json(newUserInstance.toJSON());
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'username taken' });
    } else {
      console.log('Error while creating user.');
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
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
  db.User.findByPk(req.params.username, {
    attributes: {exclude: ['password']}
  }).then((modelInstance) => {
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
router.post('/:username/change/:key', ensureAuthenticated, async (req, res) => {
  if (!req.is('json')) {
    res.status(400).json({err: 'Please specify the correct content type.'});
    return;
  }
  let username = req.params.username;
  let key = req.params["key"];
  let val = req.body[key];
  let updateObj = {};

  // Error checking
  // username cannot be changed for now.
  if (!userKeyCheck(key) || key === "username") {
    res.status(400).json({ err: 'key not recognized' });
    return;
  } else if (anyValuesUndefined(updateObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  // If the thing to be changed is password, hash it first.
  if (key === "password") {
    val = await hashPassword(val);
    updateObj[key] = val;
    const numRows = await db.User.scope("withPassword").update(updateObj, {
                where: { username: username },
              });
    if (numRows === 0) {
      res.status(404).json({ err: 'user not found' });
      return;
    }
    res.json({"success": "password updated"});
    return;
  }

  updateObj[key] = val;
  db.User.update(updateObj, {
    where: { username: username },
    returning: true
  }).then(([numRows, rowsAffected]) => {
    if (numRows === 0) {
      res.status(404).json({ err: 'user not found' });
      return;
    }

    res.json(rowsAffected[0].toJSON());
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
 * To get a user's recordings, get the endpoint 
 * /api/user/{username}/recordings
 * where username is that of the user. This will return an array of 
 * Recording objects.
 *
 * For example, to get recordings for user bobbyS,
 *   GET /api/user/bobbyS/recordings
 *
 * TODO: can we filter start times via query parameters?
 *
 */
router.get('/:username/recordings', (req, res) => {
  db.Recording.findAll({
    where: {
      username: req.params.username
    },
    order: [
      ['startTime', 'DESC'],
    ]
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
