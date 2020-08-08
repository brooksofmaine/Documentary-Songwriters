require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const models = require('./models');
const passportSetup = require('./passport/passport-setup');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const recordingRoutes = require('./routes/recordingRoutes');
const path = require("path");
const env = process.env.NODE_ENV || 'development';
let db;

const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');

if (env === 'development') {
  const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
  };
  app.use(cors(corsOptions));
}

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
app.use('/api/recording', recordingRoutes);

app.get('/api', function (req, res) {
  res.json({express: 'Hello world!'});
});

if (env !== 'development') {
  app.use(express.static('../client/build'));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

const startDB = (done) => {
  models.init((database) => {
    userRoutes.init(database);
    groupRoutes.init(database);
    recordingRoutes.init(database);
    passportSetup.init(database);
    db = database;
    if (env === "development") {
      db.sequelize.sync({force: true}).then(() => {
        done();
      });
    } else {
      db.sequelize.sync().then(() => {
        done();
      });
    }
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
