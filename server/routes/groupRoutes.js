const express = require('express');
let router = express.Router();
let db;

router.post('/create', (req, res) => {
  db.Group.create({
    groupName: req.body.groupName,
    dateCreated: req.body.dateCreated,
    description: req.body.description,
    public: req.body.public
  }).then((newGroupInstance) => {
    res.json(newGroupInstance.get({ plain: true }));
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'group name taken' });
      return;
    }

    console.log('Error while creating group.');
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.get('/:groupName', (req, res) => {
  db.Group.findByPk(req.params.groupName).then((modelInstance) => {
    if (modelInstance === null) {
      res.status(404).json({ err: 'group not found' });
      return;
    }

    res.json(modelInstance.get({ plain: true }));
  }).catch((err) => {
    console.log('Error while retrieving group.');
    console.log(err);
    res.status(500).json({ err: err });
  });
});

module.exports = router;
module.exports.init = (database) => { db = database; };
