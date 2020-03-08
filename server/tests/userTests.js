//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const should = chai.should();
const baseURL = '/api/user';

chai.use(chaiHttp);

before(function(done) {
  app.startDB(done);
});

describe('User', function() {
  let server;
  let userData = {
    username: 'bobbyS',
    firstName: 'bob',
    lastName: 'smith',
    email: 'email@email.com',
    password: 'foobar',
    weeklyAchievement: 1,
    groups: ['group1', 'group2']
  };

  before(function(done) {
    server = chai.request(app).keepOpen();
    done();
  });

  after(function(done) {
    server.close();
    done();
  });

  describe('Create', function() {
    it('should create a user that does not already exist', function(done) {
      server.post(baseURL + '/create')
        .set('content-type', 'application/json')
        .send(userData)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.username.should.equal(userData.username);
          res.body.firstName.should.equal(userData.firstName);
          res.body.lastName.should.equal(userData.lastName);
          res.body.email.should.equal(userData.email);
          res.body.weeklyAchievement.should.equal(userData.weeklyAchievement);
          res.body.groups[0].should.equal(userData.groups[0]);
          done();
        });
    });

    it('should not create a user that already exists', function(done) {
      server.post(baseURL + '/create')
        .set('content-type', 'application/json')
        .send(userData)
        .end(function(err, res) {
          res.should.have.status(409);
          res.should.be.json;
          res.body.err.should.equal('username taken');
          done();
        });
    });
  });

  describe('Get', function() {
    it('should get a user that already exists', function(done) {
      server.get(baseURL + '/' + userData.username)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.username.should.equal(userData.username);
          res.body.firstName.should.equal(userData.firstName);
          res.body.lastName.should.equal(userData.lastName);
          res.body.email.should.equal(userData.email);
          res.body.weeklyAchievement.should.equal(userData.weeklyAchievement);
          res.body.groups[0].should.equal(userData.groups[0]);
          done();
        });
    });

    it('should not get a user that does not already exist', function(done) {
      server.get(baseURL + '/doesNotExist')
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.err.should.equal('user not found');
          done();
        });
    });
  });

  describe('Change', function() {
    // change username, email, firstName, lastName
    // attempt to change for someone who does not exist
    // attempt to change a field that does not exist
    // attempt to change a username that is already taken
    let newUser = {
      username: 'robertS',
      firstName: 'robert',
      lastName: 'smithson',
      email: 'new@email.com',
      password: 'password',
      weeklyAchievement: 2,
      groups: ['group3', 'group4']
    };

    for (let [key, value] of Object.entries(newUser)) {
      let data = {};
      data[key] = value;

      // THE PROBLEM IS HERE?!?!?!?!?
      it('should change a user\'s ' + key + ' to a new ' + key, function(done) {
        server.post(baseURL + '/' + userData.username + '/change/' + key)
          .set('content-type', 'application/json')
          .send(data)
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body[key].should.equal(newUser[key]);
            //console.log(res.body)
            userData[key] = res.body[key];
            done();
          });
      });
    }

    // now userData == newUser

    it('should not change anything for a user if the attribute is invalid', function(done) {
      server.post(baseURL + '/' + userData.username + '/change/notAnAttribute')
        .set('content-type', 'application/json')
        .send({ notAnAttribute: 'someValue' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.json;
          res.body.err.should.equal('key not recognized');
          done();
        });
    });

    it('should not change anything for a user that does not already exist', function(done) {
      server.post(baseURL + '/doesNotExist/change/username')
        .set('content-type', 'application/json')
        .send({ username: 'someUsername' })
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.err.should.equal('user not found');
          done();
        });
    });

    let secondUser = {
      username: 'bobbyS',
      firstName: 'bob',
      lastName: 'smith',
      email: 'email@email.com',
      password: 'anotherone',
      weeklyAchievement: 1,
      groups: ['group1', 'group2']
    };

    it('should not change a user\'s username if the new username is already taken', function(done) {
      // need to create a second user, changing own usernme to itself does not error
      server.post(baseURL + '/create')
        .set('content-type', 'application/json')
        .send(secondUser)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.username.should.equal(secondUser.username);
          res.body.firstName.should.equal(secondUser.firstName);
          res.body.lastName.should.equal(secondUser.lastName);
          res.body.email.should.equal(secondUser.email);
          res.body.weeklyAchievement.should.equal(userData.weeklyAchievement);
          res.body.groups[0].should.equal(userData.groups[0]);


          server.post(baseURL + '/' + userData.username + '/change/username')
            .set('content-type', 'application/json')
            .send({ username: secondUser.username })
            .end(function(err, res) {
              res.should.have.status(409);
              res.should.be.json;
              res.body.err.should.equal('username taken');
              done();
            });
        });
    });
  });
});
