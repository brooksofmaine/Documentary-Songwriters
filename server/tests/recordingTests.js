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

describe('Recording', function() {
  let server;
  let userData = {
    username: 'johnS',
    firstName: 'john',
    lastName: 'smith',
    email: 'johnsmith@email.com',
    password: 'foobar'
  };

  let recordingData = {
    username:    userData.username,
    startTime:   '2016-04-23T18:25:43.511Z',
    endTime:     '2016-04-23T19:25:43.511Z',
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
    it('should create a preliminary user to attach recordings to', function(done) {
      server.post('/api/user/create')
        .set('content-type', 'application/json')
        .send(userData)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.username .should.equal(userData.username);
          res.body.firstName.should.equal(userData.firstName);
          res.body.lastName .should.equal(userData.lastName);
          res.body.email    .should.equal(userData.email);
          done();
        });
    });

    it('should create a recording for current user', function(done) {
      server.post(baseURL + '/create') 
        .set('content-type', 'application/json')
        .send(recordingData)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.username   .should.equal(recordingData.username);
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


  describe('Get', function() {
    it('should get a recording that already exists', function(done) {
      server.get('/api/user/'+userData.username+'/recordings')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.username   .should.equal(recordingData.username);
          res.body.startTime  .should.equal(recordingData.startTime);
          res.body.endTime    .should.equal(recordingData.endTime);
          res.body.instrument .should.equal(recordingData.instrument);
          res.body.numPitches .should.equal(recordingData.numPitches);
          res.body.description.should.equal(recordingData.description);
          done();
        });
    });

    it('should not get a recording that does not already exist', function(done) {
      server.get('/api/user/'+recordingData.username+'/recordings?lowRange="0"&highRange="0"')
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.err.should.equal('recordings not found');
          done();
        });
    });
  });



  // describe('Edit', function() {
  //   let newRecordingData = {
  //     username: recordingData.username,
  //     startTime: recordingData.startTime,
  //     key: 'description',
  //     val: 'this is the new description'
  //   };

  //   it('should change a recording\'s description', function(done) {
  //     server.post(baseURL + '/edit')
  //       .set('content-type', 'application/json')
  //       .send(newRecordingData)
  //       .end(function(err, res) {
  //         res.should.have.status(200);
  //         res.should.be.json;
  //         res.body[newRecordingData.key].should.equal(newRecordingData.val);
  //         done();
  //       });
  //   });

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


  //   // it('should not change anything for a recording that does not already exist', function(done) {
  //   //   server.post(baseURL + '/edit')
  //   //     .set('content-type', 'application/json')
  //   //     .send({
  //   //       startTime: 'Wed, 20 July 2015 06:00:00 GMT',
  //   //       key: 'description',
  //   //       val: 'not found'
  //   //     })
  //   //     .end(function(err, res) {
  //   //       res.should.have.status(404);
  //   //       res.should.be.json;
  //   //       res.body.err.should.equal('recording not found');
  //   //       done();
  //   //     });
  //   // });
  // });

});
