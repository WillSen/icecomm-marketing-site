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
var Stats = require('./stats/statsModel');
var passport = require('./config/passport');
var userController = require('./user/userController');

// 30 second connection timeout reccommended by mongolab:
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

mongoose.connect(mongooseURI.URI, options);

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
});

// Can refactor these two blocks into one
app.post('/checkUsernameExists', userController.checkUsernameExists);

app.post('/checkEmailExists', userController.checkEmailExists);

app.post('/lockDomain', userController.lockDomain);

app.post('/loginChecker', passport.authenticate('local-login'), function(req, res) {
  console.log('Dora the database explorer says HOLA! :)');
  res.send(req.user);
});

app.post('/signupChecker', mailController.sendConfirmationEmail);

app.get('/verify', mailController.verficationOfAccount, passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Sends email
app.post('/forgotPassword', mailController.sendForgotPasswordEmail);

// app.get('/recover', mailController.recoveredPassword);

// Verify that
app.post('/verifyResetCode', mailController.verifyResetCode);

// Send new password
app.post('/resetPassword', mailController.resetPassword, passport.authenticate('local-login'));

app.get('/loggedin', function(req, res) {
  console.log('checking', req.user);
  res.send(req.isAuthenticated() ? req.user : '0');
});

app.get('/getAPIStats', function(req, res){
  Stats.find({apiKey: {$regex : ".*" + req.user.apiKey + ".*"}}).find(function(err, stats){
    if(err) throw err;
    res.json(stats);
  });
});

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile(path.resolve(__dirname + '/../index.html'));
});

server.listen(process.env.PORT || 3000);
