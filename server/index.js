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
    recordingRoutes.init(database);
    db = database;
    db.sequelize.sync({ force: true }).then(() => {
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
  app.startDB = startDB
  module.exports = app;
}
