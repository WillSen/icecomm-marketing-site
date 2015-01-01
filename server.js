var express = require('express');
var app = express();
var server = require('http').Server(app);
var session = require('express-session');
var db = require('./auth/db');
var bcrypt = require('./auth/bcryptFile');
var mongoose = require('mongoose');
var passport = require('./auth/passport');
var bodyParser = require('body-parser');

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

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      console.log('req session: ', req.session);
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  }) (req, res, next);
});

app.post('/signup', function(req, res, next) {
  console.log(req.body);
  var newUser = new db.User({ username: req.body.username, email: req.body.email, password: req.body.password, apiKey: '' });
  newUser.save(function(err) {
    console.log('attempting to save user');
    if(err) {
      console.log(err);
    } else {
      console.log('user: ' + newUser.username + " saved.");
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          console.log('req session: ', req.session);
          req.session.messages =  [info.message];
          return res.redirect('/login')
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      }) (req, res, next);
    }
  });
});


server.listen(3000);
