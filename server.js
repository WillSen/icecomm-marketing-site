var express = require('express');
var app = express();
var server = require('http').Server(app);
var db = require('./auth/db');
var bcrypt = require('./auth/bcryptFile');
var mongoose = require('mongoose');
var passport = require('./auth/passport');

db.hola();

////////////////////////
// Testing
////////////////////////
var userWallace = new db.User({ username: 'pp', email: 'pp@example.com', password: 'george', apiKey: '' });

userWallace.save(function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('user: ' + userWallace.username + " saved.");
  }
});

db.User.find(function(err, data){
  console.log('finding mongoose data');
  data.forEach(function(item) {
    console.log(item);
  })
  // console.log(data);
})
////////////////////////
// End Testing
////////////////////////

app.use(passport.initialize());

app.use(express.static('.'));

server.listen(3000);
