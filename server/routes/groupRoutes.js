const express = require('express');
const utils = require('./utils');
const anyValuesUndefined = utils.anyValuesUndefined;
const groupKeyCheck = utils.groupKeyCheck;
let router = express.Router();
let db;

/*
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
router.post('/create', (req, res) => {
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
router.post('/:groupName/change/:key', (req, res) => {
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

module.exports = router;
module.exports.init = (database) => { db = database; };
