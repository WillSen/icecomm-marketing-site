var expect = require('chai').expect;
var db = require('../server/auth/db');
var mongoose = require('mongoose');
var mongodbUri = 'mongodb://nmandel:backmassage4@ds031271.mongolab.com:31271/icecommusers';
var mongooseUri = mongoose.connect(mongodbUri);

describe('Database Spec', function() {
  before(function(done) {
    db.User.remove({username: 'test'}, function() {
      done();
    });
  });

  it('should create a user', function(done) {
    // console.log(db.User.create);
    db.User.create({username: 'test', email: "email", password: 'test'}, function(err, createdUser) {
      console.log('createdUser', createdUser);
      expect(createdUser.apiKey).to.have.length.gt(48);
      done();
    });
  });
});