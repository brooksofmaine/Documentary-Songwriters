// //During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

// //Require the dev-dependencies
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../index');
// const should = chai.should();
// const baseURL = '/api/recording';

// chai.use(chaiHttp);

// before(function(done) {
//   app.startDB(done);
// });

// describe('Recording', function() {
//   let server;
//   let userData = {
//     username: 'johnS',
//     firstName: 'john',
//     lastName: 'smith',
//     email: 'johnsmith@email.com',
//     password: 'foobar'
//   };

//   let recordingData = {
//     username:    userData.username,
//     startTime:   '2016-04-23T18:25:43.511Z',
//     endTime:     '2016-04-23T19:25:43.511Z',
//     instrument:  'piano',
//     numPitches:  100,
//     description: 'moonlight sonata'
//   };

//   let recordingData2 = {
//     username:    userData.username,
//     startTime:   '2016-04-23T20:25:43.511Z',
//     endTime:     '2016-04-23T21:25:43.511Z',
//     instrument:  'violin',
//     numPitches:  200,
//     description: 'fur elise'
//   };

//   let userData2 = {
//     username: 'johnCena',
//     firstName: 'john',
//     lastName: 'cena',
//     email: 'johncena@email.com',
//     password: 'foobar'
//   };

//   before(function(done) {
//     server = chai.request(app).keepOpen();
//     done();
//   });

//   after(function(done) {
//     server.close();
//     done();
//   });

// /*****************************************************************************/

//   describe('Create', function() {

//     it('should create a recording for current user', function(done) {
//       server.post('/api/user/create')
//         .set('content-type', 'application/json')
//         .send(userData)
//         .end(function(err, res) {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.username .should.equal(userData.username);
//           res.body.firstName.should.equal(userData.firstName);
//           res.body.lastName .should.equal(userData.lastName);
//           res.body.email    .should.equal(userData.email);
//         });
//       server.post(baseURL + '/create') 
//         .set('content-type', 'application/json')
//         .send(recordingData)
//         .end(function(err, res) {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.username   .should.equal(recordingData.username);
//           res.body.startTime  .should.equal(recordingData.startTime);
//           res.body.endTime    .should.equal(recordingData.endTime);
//           res.body.instrument .should.equal(recordingData.instrument);
//           res.body.numPitches .should.equal(recordingData.numPitches);
//           res.body.description.should.equal(recordingData.description);
//           done();
//         });
//     });

//     it('should create a second recording for current user', function(done) {
//       server.post(baseURL + '/create') 
//         .set('content-type', 'application/json')
//         .send(recordingData2)
//         .end(function(err, res) {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.username   .should.equal(recordingData2.username);
//           res.body.startTime  .should.equal(recordingData2.startTime);
//           res.body.endTime    .should.equal(recordingData2.endTime);
//           res.body.instrument .should.equal(recordingData2.instrument);
//           res.body.numPitches .should.equal(recordingData2.numPitches);
//           res.body.description.should.equal(recordingData2.description);
//           done();
//         });
//     });

//     it('should not create a recording that overlaps in time with another', function(done) {
//       server.post(baseURL + '/create')
//         .set('content-type', 'application/json')
//         .send(recordingData)
//         .end(function(err, res) {
//           res.should.have.status(409);
//           res.should.be.json;
//           res.body.err.should.equal('already recorded');
//           done();
//         });
//     });
//   });

// /*****************************************************************************/

//   describe('Get', function() {
//     it('should get the recordings that already exist for user', function(done) {
//       server.get('/api/user/'+userData.username+'/recordings')
//         .end(function(err, res) {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.an('array').that.is.not.empty;
//           res.body.should.be.an('array').that.has.lengthOf(2);
//           res.body.every((rec) => { rec.username.should.equal(userData.username) });
//           res.body[0].startTime  .should.equal(recordingData.startTime);
//           res.body[0].endTime    .should.equal(recordingData.endTime);
//           res.body[0].instrument .should.equal(recordingData.instrument);
//           res.body[0].numPitches .should.equal(recordingData.numPitches);
//           res.body[0].description.should.equal(recordingData.description);
//           res.body[1].startTime  .should.equal(recordingData2.startTime);
//           res.body[1].endTime    .should.equal(recordingData2.endTime);
//           res.body[1].instrument .should.equal(recordingData2.instrument);
//           res.body[1].numPitches .should.equal(recordingData2.numPitches);
//           res.body[1].description.should.equal(recordingData2.description);
//           done();
//         });
//     });

//     it('should return no recordings if user does not exist', function(done) {
//       server.get('/api/user/notAUser/recordings')
//         .end(function(err, res) {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.an('array').that.is.empty;
//           done();
//         });
//     });

//     it('should return no recordings if user has none yet', function(done) {
//       server.post('/api/user/create')
//         .set('content-type', 'application/json')
//         .send(userData2)
//         .end(function(err, res) {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.username .should.equal(userData2.username);
//           res.body.firstName.should.equal(userData2.firstName);
//           res.body.lastName .should.equal(userData2.lastName);
//           res.body.email    .should.equal(userData2.email);
//         });
//       server.get('/api/user/'+userData2.username+'/recordings')
//         .end(function(err, res) {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.an('array').that.is.empty;
//           done();
//         });
//     });
//   });

// /*****************************************************************************/


//   // describe('Edit', function() {
//   //   let recordingDataUpdate = {
//   //     username: recordingData.username,
//   //     startTime: recordingData.startTime,
//   //     key: 'description',
//   //     val: 'this is the new description'
//   //   };

//   //   it('should change a recording\'s description', function(done) {
//   //     server.post(baseURL + '/edit')
//   //       .set('content-type', 'application/json')
//   //       .send(recordingDataUpdate)
//   //       .end(function(err, res) {
//   //         res.should.have.status(200);
//   //         res.should.be.json;
//   //         res.body.description.should.equal(recordingDataUpdate.val);
//   //         res.body.username   .should.equal(recordingData.username);
//   //         res.body.startTime  .should.equal(recordingData.startTime);
//   //         res.body.endTime    .should.equal(recordingData.endTime);
//   //         res.body.instrument .should.equal(recordingData.instrument);
//   //         res.body.numPitches .should.equal(recordingData.numPitches);
//   //         done();
//   //       });
//   //   });

//   //   it('should not change anything for a recording if the attribute is invalid', function(done) {
//   //     server.post(baseURL + '/edit')
//   //       .set('content-type', 'application/json')
//   //       .send({
//   //         username:  recordingData.username,
//   //         startTime: recordingData.startTime,
//   //         key: 'notAValidAttribute',
//   //         val: 'notAValidAttributeValue'
//   //       }).end(function(err, res) {
//   //         res.should.have.status(400);
//   //         res.should.be.json;
//   //         res.body.err.should.equal('key not recognized');
//   //         done();
//   //       });
//   //   });
//   // });

// /*****************************************************************************/


//   // describe('Delete', function() {
//   //   it('should delete the given recording from database', function(done) {
//   //     server.post(baseURL + '/delete') 
//   //       .set('content-type', 'application/json')
//   //       .send(recordingData2)
//   //       .end(function(err, res) {
//   //         console.log(res);
//   //         res.should.have.status(200);
//   //         res.should.be.json;
//   //         done();
//   //       });
//   //   });

//   //   it('deleted recording should no longer exist', function(done) {
//   //     server.get('/api/user/'+recordingData2.username+'/recordings')
//   //       .end(function(err, res) {
//   //         res.should.have.status(200);
//   //         res.should.be.json;
//   //         res.body.should.be.an('array').that.is.not.empty;
//   //         res.body.should.be.an('array').that.has.lengthOf(1);
//   //         res.body[0].username   .should.equal(recordingData2.username);
//   //         res.body[0].startTime  .should.equal(recordingData.startTime);
//   //         res.body[0].endTime    .should.equal(recordingData.endTime);
//   //         res.body[0].instrument .should.equal(recordingData.instrument);
//   //         res.body[0].numPitches .should.equal(recordingData.numPitches);
//   //         res.body[0].description.should.equal(recordingData.description);
//   //         done();
//   //       });
//   //   });
//   // });

// });






