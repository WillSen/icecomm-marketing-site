var express = require('express');
var app = express();
var server = require('http').Server(app);
var db = require('./db');
var bcrypt = require('./middleware/bcrypt');
var mongoose = require('mongoose');

db.hola();

var User = mongoose.model('User', db.userSchema);
var userWallace = new User({ username: 'wallace', email: 'wallace@example.com', password: 'wally', apiKey: '' });

userWallace.save(function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('user: ' + userWallace.username + " saved.");
  }
});


app.use(express.static('.'));

server.listen(3000);
