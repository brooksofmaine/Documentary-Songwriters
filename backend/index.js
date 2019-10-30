const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./models');
let models;
const port = 5000;

const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth-routes');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use('/auth', authRoutes);

app.get('/', function (req, res) {
  // res.render('index');
  res.send(({express : 'Hello world!'}))
});

app.get('/users', (req, res) => {
  models.User.findAll().then((users) => {
    res.status(200).json(users);
  });
});

// start app only after database is created and models are synchronized
db.init((_models) => {
  models = _models;
  models.sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`App running on port ${port}.`);
    });
  });
});
