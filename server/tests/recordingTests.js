//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const should = chai.should();
const baseURL = '/api/recording';

chai.use(chaiHttp);

before(function(done) {
  app.startDB(done);
});

describe('Create', function() {
  let userData = {
    username: 'bobbyS',
    firstName: 'bob',
    lastName: 'smith',
    email: 'email@email.com',
    password: 'foobar'
  };
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
        done();
      });
  });
});

describe('Recording', function() {
  let server;
  let recordingData = {
    userName:    'bobbyS',
    startTime:   'Wed, 27 July 2016 07:45:00 GMT',
    endTime:     'Wed, 27 July 2016 07:51:00 GMT',
    instrument:  'piano',
    numPitches:  100,
    description: 'moonlight sonata'
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
    it('should create a recording for current user', function(done) {
      server.post(baseURL + '/create')
        .set('content-type', 'application/json')
        .send(recordingData)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.userName   .should.equal(recordingData.userName);
          res.body.startTime  .should.equal(recordingData.startTime);
          res.body.endTime    .should.equal(recordingData.endTime);
          res.body.instrument .should.equal(recordingData.instrument);
          res.body.numPitches .should.equal(recordingData.numPitches);
          res.body.description.should.equal(recordingData.description);
          done();
        });
    });

    it('should not create a recording that overlaps in time with another', function(done) {
      server.post(baseURL + '/create')
        .set('content-type', 'application/json')
        .send(recordingData)
        .end(function(err, res) {
          res.should.have.status(409);
          res.should.be.json;
          res.body.err.should.equal('already recorded');
          done();
        });
    });
  });



  // describe('Get recording', function() {
  //   it('should get a recording that already exists', function(done) {
  //     server.get('/api/user/'+recordingData.userName+'/recordings?low="' +recordingData.startTime+ '"&high="' +recordingData.endTime+ '"')
  //       .end(function(err, res) {
  //         res.should.have.status(200);
  //         res.should.be.json;
  //         res.body.userName   .should.equal(recordingData.userName);
  //         res.body.startTime  .should.equal(recordingData.startTime);
  //         res.body.endTime    .should.equal(recordingData.endTime);
  //         res.body.instrument .should.equal(recordingData.instrument);
  //         res.body.numPitches .should.equal(recordingData.numPitches);
  //         res.body.description.should.equal(recordingData.description);
  //         done();
  //       });
  //   });

  //   it('should not get a recording that does not already exist', function(done) {
  //     server.get('/api/user/'+recordingData.userName+'/recordings?low="0"&high="0"')
  //       .end(function(err, res) {
  //         res.should.have.status(404);
  //         res.should.be.json;
  //         res.body.err.should.equal('recordings not found');
  //         done();
  //       });
  //   });
  // });



  // describe('Edit recording', function() {
  //   let newRecordingData = {
  //     userName:    'user2',
  //     startTime:   'Wed, 20 July 2016 06:00:00 GMT',
  //     endTime:     'Wed, 20 July 2016 06:02:00 GMT',
  //     instrument:  'violin',
  //     numPitches:  200,
  //     description: 'never gonna give you up'
  //   };

  //   it('should change a recording\'s description', function(done) {
  //     server.post(baseURL + '/edit')
  //       .set('content-type', 'application/json')
  //       .send({
  //         startTime: 'Wed, 20 July 2016 06:00:00 GMT',
  //         key: 'description',
  //         val: 'rickroll'
  //       })
  //       .end(function(err, res) {
  //         res.should.have.status(200);
  //         res.should.be.json;
  //         res.body[key].should.equal(newRecordingData[key]);
  //         recordingData[key] = res.body[key];
  //         done();
  //       });
  //   });

  //   // now userData == newUser

  //   it('should not change anything for a recording if the attribute is invalid', function(done) {
  //     server.post(baseURL + '/edit')
  //       .set('content-type', 'application/json')
  //       .send({ 
  //         notAnAttribute: 'someValue' 
  //       })
  //       .end(function(err, res) {
  //         res.should.have.status(400);
  //         res.should.be.json;
  //         res.body.err.should.equal('key not recognized');
  //         done();
  //       });
  //   });


  //   it('should not change anything for a user that does not already exist', function(done) {
  //     server.post(baseURL + '/edit')
  //       .set('content-type', 'application/json')
  //       .send({
  //         startTime: 'Wed, 20 July 2015 06:00:00 GMT',
  //         key: 'description',
  //         val: 'not found'
  //       })
  //       .end(function(err, res) {
  //         res.should.have.status(404);
  //         res.should.be.json;
  //         res.body.err.should.equal('recording not found');
  //         done();
  //       });
  //   });
  // });

});
