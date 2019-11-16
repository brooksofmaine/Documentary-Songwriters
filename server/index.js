const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const models = require('./models');
const passportSetup = require('./config/passport-setup');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
let db;

const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(cors());
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({secret: 'some_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
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
