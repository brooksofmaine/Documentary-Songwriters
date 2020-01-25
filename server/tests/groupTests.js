//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const should = chai.should();
const baseURL = '/api/group';

chai.use(chaiHttp);

before(function(done) {
  app.startDB(done);
});

describe('Group', function() {
  let server;
  let groupData = {
    groupName: 'group1',
    description: 'this is the group1 description',
    visible: true
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
    it('should create a group that does not already exist', function(done) {
      server.post(baseURL + '/create')
        .set('content-type', 'application/json')
        .send(groupData)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.groupName.should.equal(groupData.groupName);
          res.body.description.should.equal(groupData.description);
          res.body.visible.should.equal(groupData.visible);
          done();
        });
    });

    it('should not create a group that already exists', function(done) {
      server.post(baseURL + '/create')
        .set('content-type', 'application/json')
        .send(groupData)
        .end(function(err, res) {
          res.should.have.status(409);
          res.should.be.json;
          res.body.err.should.equal('group name taken');
          done();
        });
    });
  });

  describe('Get', function() {
    it('should get a group that already exists', function(done) {
      server.get(baseURL + '/' + groupData.groupName)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.groupName.should.equal(groupData.groupName);
          res.body.description.should.equal(groupData.description);
          res.body.visible.should.equal(groupData.visible);
          done();
        });
    });

    it('should not get a group that does not already exist', function(done) {
      server.get(baseURL + '/doesNotExist')
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.err.should.equal('group not found');
          done();
        });
    });
  });

  describe('Change', function() {
    // change groupName, description, visible
    // attempt to change for group that does not exist
    // attempt to change a field that does not exist
    // attempt to change a groupName that is already taken
    let newGroup = {
      groupName: 'group2',
      description: 'this is the group2 description',
      visible: true
    };

    for (let [key, value] of Object.entries(newGroup)) {
      let data = {};
      data[key] = value;

      it('should change a group\'s ' + key + ' to a new ' + key, function(done) {
        server.post(baseURL + '/' + groupData.groupName + '/change/' + key)
          .set('content-type', 'application/json')
          .send(data)
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body[key].should.equal(newGroup[key]);
            groupData[key] = res.body[key];
            done();
          });
      });
    }

    // now userData == newUser

    it('should not change anything for a group if the attribute is invalid', function(done) {
      server.post(baseURL + '/' + groupData.groupName + '/change/notAnAttribute')
        .set('content-type', 'application/json')
        .send({ notAnAttribute: 'someValue' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.json;
          res.body.err.should.equal('key not recognized');
          done();
        });
    });

    it('should not change anything for a group that does not already exist', function(done) {
      server.post(baseURL + '/doesNotExist/change/groupname')
        .set('content-type', 'application/json')
        .send({ groupName: 'someGroupname' })
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.err.should.equal('group not found');
          done();
        });
    });

    let secondGroup = {
      groupName: 'group3',
      description: 'this is the group3 description',
      visible: true
    };

    it('should not change a group\'s groupName if the new groupName is already taken', function(done) {
      // need to create a second group, changing own groupName to itself does not error
      server.post(baseURL + '/create')
        .set('content-type', 'application/json')
        .send(secondGroup)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.groupName.should.equal(secondGroup.groupName);
          res.body.description.should.equal(secondGroup.description);
          res.body.visible.should.equal(secondGroup.visible);


          server.post(baseURL + '/' + groupData.groupName + '/change/groupName')
            .set('content-type', 'application/json')
            .send({ groupName: secondGroup.groupName })
            .end(function(err, res) {
              res.should.have.status(409);
              res.should.be.json;
              res.body.err.should.equal('groupName taken');
              done();
            });
        });
    });
  });
});
