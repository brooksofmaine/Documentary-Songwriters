const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const models = require('./models');
const passportSetup = require('./passport/passport-setup');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
let db;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
};

const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const session = require('express-session');

app.use(cors(corsOptions));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
secret: 'some_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);
app.use('/api/group', groupRoutes);

app.get('/api', function (req, res) {
  res.json({express: 'Hello world!'});
});

const startDB = (done) => {
  models.init((database) => {
    userRoutes.init(database);
    groupRoutes.init(database);
    passportSetup.init(database);
    db = database;
    db.sequelize.sync({force: true}).then(() => {
      done();
    });
  });
};

app.post('/group/changeGroupName', (req, res) => {
  db.Group.update({
    groupName: req.body.newGroupName
  }, {
    where: {groupName: req.body.oldGroupName},
    returning: true,
    raw: true
  }).then((newGroupInstance) => {
    res.json(newGroupInstance.get({ plain: true }));
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'group name taken' });
      return;
    }

    console.log('Error while changing group name.');
    console.log(err);
    res.status(500).json({ err: err });
  });
});

app.post('/group/changeGroupDescription', (req, res) => {
  db.Group.update({
    description: req.body.description
  }, {
    where: {groupName: req.body.groupName},
    returning: true,
    raw: true
  }).then((newGroupInstance) => {
    res.json(newGroupInstance.get({ plain: true }));
  }).catch((err) => {

    console.log('Error while changing group description.');
    console.log(err);
    res.status(500).json({ err: err });
  });
});

app.post('/group/changeGroupPrivacy', (req, res) => {
  db.Group.update({
    public: req.body.public
  }, {
    where: {groupName: req.body.groupName},
    returning: true,
    raw: true
  }).then((newGroupInstance) => {
    res.json(newGroupInstance.get({ plain: true }));
  }).catch((err) => {

    console.log('Error while changing group privacy.');
    console.log(err);
    res.status(500).json({ err: err });
  });
});

app.post('/group/deleteGroup', (req, res) => {
  db.Recording.destroy({
    where: {
      groupName: groupName
    }
  }).then((newGroupInstance) => {
    res.json(newGroupInstance.get({ plain: true }));
  }).catch((err) => {

    console.log('Error while deleting group.');
    console.log(err);
    res.status(500).json({ err: err });
  });
});


// start app or defer to test env and provide utils
if (process.env.NODE_ENV !== 'test') {
  startDB(() => {
    app.listen(port, () => {
      console.log(`App running on port ${port}.`);
    });
  });
} else {
  app.startDB = startDB;
  module.exports = app;
}
