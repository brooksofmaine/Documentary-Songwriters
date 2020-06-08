const express = require('express');
const utils = require('./utils');
const anyValuesUndefined = utils.anyValuesUndefined;
const groupKeyCheck = utils.groupKeyCheck;
const ensureAuthenticated = require("authRoutes").ensureAuthenticated;
let router = express.Router();
let db;

/*
 * TODO: Add user making request as the admin
 *
 * To create a group, post to the endpoint /api/group/create
 * with the groupName, description, and visible (boolean) in the body of the request
 *
 * For example, to create a public group named FooBar:
 *   Post /api/group/create
 *   With data:
 *   {
 *     groupName:   "FooBar",
 *     description: "A good description",
 *     visible:     true
 *   }
 */
router.post('/create', ensureAuthenticated, (req, res) => {
  let createObj = {
    groupName: req.body.groupName,
    description: req.body.description,
    visible: req.body.visible
  };

  if (anyValuesUndefined(createObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  db.Group.create(createObj).then((newGroupInstance) => {
    res.json(newGroupInstance.get({ plain: true }));
    return;
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
});

/*
 * TODO: If group is private, only send group info if user is part of group
 * TODO: Send back list of users in group and some recording data
 *
 * To get a group, get the endpoint /api/group/{groupName}
 * where groupName is that of the group
 *
 * For example, to get group FooBar:
 *   Get /api/group/FooBar
 */
router.get('/:groupName', (req, res) => {
  db.Group.findByPk(req.params.groupName).then((modelInstance) => {
    if (modelInstance === null) {
      res.status(404).json({ err: 'group not found' });
      return;
    }

    res.json(modelInstance.get({ plain: true }));
    return;
  }).catch((err) => {
    console.log('Error while retrieving group.');
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});

/*
 * TODO: Ensure the person changing the group attributes is the group admin
 *
 * To change some attribute of a group, post to the endpoint /api/group/{groupName}/change/{key}
 * where groupName is that of the group and key is the name of the attribute to change
 * and with the name and value of the attribute in the body of the request
 *
 * Valid keys for groups are:
 * - groupName
 * - description
 * - visible (boolean)
 *
 * For example, to change the groupName of group FooBar to Baz:
 *   Post /api/group/FooBar/change/groupName
 *   With data { groupName: "Baz" }
 */
router.post('/:groupName/change/:key', ensureAuthenticated, (req, res) => {
  let groupName = req.params.groupName;
  let key = req.params.key;
  let val = req.body[key];
  let updateObj = {};
  updateObj[key] = val;

  if (!groupKeyCheck(key)) {
    res.status(400).json({ err: 'key not recognized' });
    return;
  }

  if (anyValuesUndefined(updateObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  db.Group.update(updateObj, {
    where: { groupName: groupName },
    returning: true,
    raw: true
  }).then(([numRows, rowsAffected]) => {
    if (numRows === 0) {
      res.status(404).json({ err: 'group not found' });
      return;
    }

    res.json(rowsAffected[0]);
    return;
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'groupName taken' });
      return;
    }

    console.log(`Error while changing ${key}`);
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});


//delete a group
//TODO: make sure only admin of group can delete a group
router.post('/:groupName/delete', ensureAuthenticated, (req, res) => {
  //req.user.username --> check if this is admin

  let groupName = req.params.groupName;
  db.Group.destroy({
    where: {
      groupName: groupName
    }
  }).then(([numRows, rowsAffected]) => {
    if (numRows === 0) {
      res.status(404).json({ err: 'group not found' });
      return;
    }
  }).catch((err) => {
    console.log('Error while retrieving group.');
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});

//add a user to a group
//TODO: make sure only admin of group can add user to a group
/*
 * To add a group's users, get the endpoint
 * /api/group/{groupName}/addUsers
 * where groupName is that of the group.
 *
 */
router.post('/:groupName/addUser', ensureAuthenticated, async (req, res, next) => {
  try {
    let groupName = req.params.groupName;
    let username = req.body.username;

    let groupInstance = await db.Group.findByPk(groupName);
    let userInstance = await db.User.findByPk(username);
    if (groupInstance === null) {
      res.status(404).json({err: 'group not found'});
      return;
    }
    if (userInstance === null) {
      res.status(404).json({err: 'user not found'});
      return;
    }

    let numRows = await userInstance.addGroup(groupInstance);
    if (numRows === 0) {
      res.status(404).json({err: 'group not found'});
      return;
    }

    numRows = await groupInstance.addUser(userInstance);
    if (numRows === 0) {
      res.status(404).json({err: 'user not found'});
    }

    res.json(groupInstance.get({ plain: true }));
  } catch (e) {
    // ref: https://expressjs.com/en/guide/error-handling.html
    next(e);
  }
});


//delete a user from a group
//TODO: make sure only admin of group can delete user from a group
router.post('/:groupName/removeUser', ensureAuthenticated, async (req, res, next) => {
  try {
    const groupName = req.params.groupName;
    const username = req.body.username;

    let groupInstance = await db.Group.findByPk(groupName);
    if (groupInstance === null) {
      res.status(404).json({ err: 'group not found' });
      return;
    }

    let userInstance = await db.User.findByPk(username);
    if (userInstance === null) {
      res.status(404).json({ err: 'user not found' });
      return;
    }

    if (!(await groupInstance.hasUser(userInstance))) {
      res.status(404).json({ err: 'user does not belong to the group' });
      return;
    }

    const numRows = groupInstance.removeUser(userInstance);
    if (numRows === 0) {
      res.status(404).json({ err: 'error when deleting' });
      return;
    }
  } catch (e) {
    next(e);
  }

});


/*
 * To get a group's users, get the endpoint 
 * /api/group/{groupName}/getUsers
 * where groupName is that of the group. 
 *
 */
router.get('/:groupName/getUsers', ensureAuthenticated, async (req, res, next) => {
  try {
    let groupName = req.params.groupName;

    let groupInstance = await db.Group.findByPk(groupName);
    if (groupInstance === null) {
      res.status(404).json({ err: 'group not found' });
      return;
    }
    let users = await groupInstance.getUsers({attributes: ['username', 'email', 'firstName', 'lastName']});

    let json = users.map(user => user.get({plain: true}));
    res.json(json);
  } catch(e) {
    next(e);
  }
});

module.exports = router;
module.exports.init = (database) => { db = database; };
