var express = require('express');
var app = express();
var server = require('http').Server(app);
var session = require('express-session');
var mongoose = require('mongoose');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var path = require('path');
var mailController = require('./mail/mailController');
var mongoose = require('mongoose');
var mongooseURI = require('./config/database');
var User = require('./user/userModel');

var passport = require('./auth/passport');

// 30 second connection timeout reccommended by mongolab:
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };


mongoose.connect(mongooseURI.URI, options);


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
app.use(flash());

app.use(express.static('.'));

app.get('/checkUsername', function(req, res) {
  if (req.user) {
    res.json(req.user);
    console.log('req', req.user.username);
  }
})

app.get('/checkUserExists', function(req, res) {
  console.log('checking if user exists: ', req.query.username);
  var alreadyExisting = false;
  User.find(function(err, data){
    data.forEach(function(item) {
      if (item.username === req.query.username) {
        alreadyExisting = true;
      }
    })
    res.json({"alreadyExisting":alreadyExisting});
  })
})

app.post('/loginChecker', passport.loginAuth)

app.post('/signupChecker', mailController.sendConfirmationEmail);
// app.post('/login', passport.loginAuth);
// app.post('/signup', passport.signupAuth);

app.get('/verify', mailController.verficationOfAccount, passport.signupAuth);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.get('/recover', mailController.recoveredPassword);
app.post('/lostpassword', mailController.sendForgotPasswordEmail);
app.post('/reset', mailController.resetPassword, passport.loginAuth);


app.get('/loggedin', function(req, res) {
  console.log('checking', req.user);
  res.send(req.isAuthenticated() ? req.user : '0');
});



app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile(path.resolve(__dirname + '/../index.html'));
});

server.listen(process.env.PORT || 3000);