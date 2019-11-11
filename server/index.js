const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./models');
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

app.post('/user/create', (req, res) => {
  db.createUser(req.body.username, req.body.firstName, req.body.lastName, req.body.email).then((newUser) => {
    res.json(newUser);
  });
});

app.get('/user/:username', (req, res) => {
  db.getUser(req.params.username).then((user) => {
    res.json(user);
  });
});

// start app only after database is created and models are synchronized
db.init((models) => {
  models.sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`App running on port ${port}.`);

      // test create user

      db.createUser('bobbyS', 'bob', 'smith', 'email@email.com').then((newUser) => {
        console.log("CREATED NEW USER");
        console.log(newUser);
        /*
        // test get user
        db.getUser('bobbyS').then((user) => {
          console.log("FOUND USER: bobbyS");
          console.log(user);

          // test change username
          db.changeUsername('bobbyS', 'robertS').then((user) => {
            console.log("USERNAME CHANGE");
            console.log(user);

            // test other user attribute modifiers
            db.changeEmail('robertS', 'real@email.com').then((user) => {
              console.log("EMAIL CHANGE");
              console.log(user);
            });

            db.changeFirstName('robertS', 'robert').then((user) => {
              console.log("FIRST NAME CHANGE");
              console.log(user);
            });

            db.changeLastName('robertS', 'smith-jenkins').then((user) => {
              console.log("LAST NAME CHANGE");
              console.log(user);
            });
          });
        });*/
      });

    });
  });
});
