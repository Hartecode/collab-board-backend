'use strict';


const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { Users } = require('../users');

const expect = chai.expect;
const should = chai.should();


// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/user', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    Users.create({
      username: "hfsdhfuh",
      email: "email@email.com",
      avatarUrl: "https:/dskdk.com4",
      oauthId: "",
      githubProfileUrl: "https://github.com/testtest",
      githubRepos: "https://api.github.com/users/testteset/repos"
    })
  });

  afterEach(function() {
    return Users.remove({});
  });

  describe('GET /api/users/allusers', function () {

    it('should respond to GET `/api/users/allusers` with an array of users and status 200', function () {
      return chai.request(app)
        .get('/api/users/allusers')
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.forEach((user) => {
            item.should.be.a('object');
            item.should.include.keys('id', 'username', 'email', 'avatarUrl', 'oauthId', 'githubProfileUrl', 'githubRepos');
          });
        });
    });
  });



});