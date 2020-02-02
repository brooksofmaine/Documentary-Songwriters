const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const models = require('./models');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const recordingRoutes = require('./routes/recordingRoutes');
let db;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/recording', recordingRoutes);

app.get('/api', function (req, res) {
  res.json({ express : 'Hello world!' });
});

const startDB = (done) => {
  models.init((database) => {
    userRoutes.init(database);
    groupRoutes.init(database);
    db = database;
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  }); 
};

// app.post('/group/changeGroupName', (req, res) => {
//   db.Group.update({
//     groupName: req.body.newGroupName
//   }, {
//     where: {groupName: req.body.oldGroupName},
//     returning: true,
//     raw: true
//   }).then((newGroupInstance) => {
//     res.json(newGroupInstance.get({ plain: true }));
//   }).catch((err) => {
//     if (err.name === 'SequelizeUniqueConstraintError') {
//       res.status(409).json({ err: 'group name taken' });
//       return;
//     }

//     console.log('Error while changing group name.');
//     console.log(err);
//     res.status(500).json({ err: err });
//   });
// });

// app.post('/group/changeGroupDescription', (req, res) => {
//   db.Group.update({
//     description: req.body.description
//   }, {
//     where: {groupName: req.body.groupName},
//     returning: true,
//     raw: true
//   }).then((newGroupInstance) => {
//     res.json(newGroupInstance.get({ plain: true }));
//   }).catch((err) => {

//     console.log('Error while changing group description.');
//     console.log(err);
//     res.status(500).json({ err: err });
//   });
// });

// app.post('/group/changeGroupPrivacy', (req, res) => {
//   db.Group.update({
//     public: req.body.public
//   }, {
//     where: {groupName: req.body.groupName},
//     returning: true,
//     raw: true
//   }).then((newGroupInstance) => {
//     res.json(newGroupInstance.get({ plain: true }));
//   }).catch((err) => {

//     console.log('Error while changing group privacy.');
//     console.log(err);
//     res.status(500).json({ err: err });
//   });
// });

// app.post('/group/deleteGroup', (req, res) => {
//   db.Recording.destroy({
//     where: {
//       groupName: groupName
//     }
//   }).then((newGroupInstance) => {
//     res.json(newGroupInstance.get({ plain: true }));
//   }).catch((err) => {

//     console.log('Error while deleting group.');
//     console.log(err);
//     res.status(500).json({ err: err });
//   });
// });


// start app or defer to test env and provide utils
if (process.env.NODE_ENV !== 'test') {
  startDB(() => {
    app.listen(port, () => {
      console.log(`App running on port ${port}.`);
    });
  });
} else {
  app.startDB = startDB
  module.exports = app;
}
