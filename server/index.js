const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const models = require('./models');
let db;

const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth-routes');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.get('/', function (req, res) {
  res.json({ express : 'Hello world!' });
});

app.post('/user/create', (req, res) => {
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

app.get('/user/:username', (req, res) => {
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

// start app or defer to test env and provide utils
if (process.env.NODE_ENV !== 'test') {
  models.init((database) => {
    db = database;
    db.sequelize.sync().then(() => {
      app.listen(port, () => {
        console.log(`App running on port ${port}.`);
      });
    });
  });
} else {
  app.startDb = (done) => {
    models.init((database) => {
      db = database;
      db.sequelize.sync({ force: true }).then(() => {
        done();
      });
    });
  };

  module.exports = app;
}
