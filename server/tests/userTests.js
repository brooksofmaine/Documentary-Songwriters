//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const should = chai.should();

chai.use(chaiHttp);

before(function(done) {
  app.startDb(done);
});

describe('User', function() {
  let server;
  let userData = {
    username: 'bobbyS',
    firstName: 'bob',
    lastName: 'smith',
    email: 'email@email.com'
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
      server.post('/user/create')
        .set('content-type', 'application/json')
        .send(userData)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.username.should.equal(userData.username);
          res.body.firstName.should.equal(userData.firstName);
          res.body.lastName.should.equal(userData.lastName);
          res.body.email.should.equal(userData.email);
          done();
        });
    });

    it('should not create a user that already exists', function(done) {
      server.post('/user/create')
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
      server.get(`/user/${userData.username}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.username.should.equal(userData.username);
          res.body.firstName.should.equal(userData.firstName);
          res.body.lastName.should.equal(userData.lastName);
          res.body.email.should.equal(userData.email);
          done();
        });
    });

    it('should not get a user that does not already exist', function(done) {
      server.get('/user/doesNotExist')
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.err.should.equal('user not found');
          done();
        });
    });
  })
});
