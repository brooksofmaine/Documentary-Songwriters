const express = require('express');
const utils = require('./utils');
const anyValuesUndefined = utils.anyValuesUndefined;
const groupKeyCheck = utils.groupKeyCheck;
let router = express.Router();
let db;

/*
 * TODO: Add user to group      - POST /api/group/{groupName}/add
 * TODO: Remove user from group - POST /api/group/{groupName}/remove
 */

/*
 * TODO: Only allow logged in users to create groups
 * TODO: Add user making request as the admin
 */
router.post('/create', (req, res) => {
  let createObj = {
    groupName: req.body.groupName,
    description: req.body.description,
    visible: req.body.visible,
    adminUsername: req.body.adminUsername, // TODO get this from auth
  };

  if (anyValuesUndefined(createObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  db.Group.create(createObj).then((group) => {
    group.addMember(req.body.adminUsername).then((groupUser) => {
      res.redirect(`${group.get('groupName')}`);
      return;
    });
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
 * TODO: Send back list of users in group and some recording data?
 */
router.get('/:groupName', (req, res) => {
  db.Group.findOne({
    where: { groupName: req.params.groupName },
    include: [
      { model: db.User, as: 'members', attributes: ['username'], through: { attributes: [] } }
    ]
  }).then((group) => {
    if (group === null) {
      res.status(404).json({ err: 'group not found' });
      return;
    }

    let isMember = group.get('members').some((user) => user.get('username') === req.body.username); // TODO get this from auth
    let isVisible = group.get('visible');

    if (!isMember && !isVisible) {
      res.status(404).json({ err: 'group not found' });
      return;
    }

    res.json(group);
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
 */
router.post('/:groupName/edit', (req, res) => {
  let groupName = req.params.groupName;
  let key = req.body.key;
  let value = req.body.value;
  let updateObj = {};
  updateObj[key] = value;

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
  }).then(([numRows, rowsAffected]) => {
    if (numRows === 0) {
      res.status(404).json({ err: 'group not found' });
      return;
    }

    res.redirect(`../${rowsAffected[0].get('groupName')}`);
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

module.exports = router;
module.exports.init = (database) => { db = database; };
