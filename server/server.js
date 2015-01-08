var express = require('express');
var app = express();
var server = require('http').Server(app);
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var db = require('./auth/db');
var bcrypt = require('./auth/bcryptFile');
var passport = require('./auth/passport');

////////////////////////
// Testing
////////////////////////
// var userWallace = new db.User({ username: 'Wallace', email: 'wally@example.com', password: 'poop', apiKey: '' });

// userWallace.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('user: ' + userWallace.username + " saved.");
//   }
// });

// db.User.find(function(err, data){
//   console.log('finding mongoose data');
//   data.forEach(function(item) {
//     console.log(item);
//   })
//   // console.log(data);
// })

////////////////////////
// End Testing
////////////////////////

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({ 
  secret: 'keyboard cat', 
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('.'));

app.get('/checkUsername', function(req, res) {
  if (req.user) {
    res.json({username: req.user.username});
    console.log('req', req.user.username);
  }
  // res.json({A: 5});
})

app.get('/checkUserExists', function(req, res) {
  //req.params.tryusername
  //query database with req.params.tryusername
  // if present res.send(false)
  // else res.send(true)
  console.log('checking if user exists: ', req.query.username);
  // var alreadyExists = false;
  var alreadyExisting = false;
  db.User.find(function(err, data){
    console.log('finding mongoose data');
    data.forEach(function(item) {
      console.log(item.username);
      if (item.username === req.query.username) {
        alreadyExisting = true;
      } 
    })
    // res.json({alreadyExisting: false});
    res.json({"alreadyExisting":alreadyExisting});
  })
})

app.post('/login', passport.loginAuth);
app.post('/signup', passport.signupAuth);

server.listen(process.env.PORT || 3000);