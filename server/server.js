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
var Users = require('./user/userModel');
var passport = require('./auth/passport');
var userController = require('./user/userController');
var MongoStore = require('connect-mongo')(session);

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
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static('.'));

app.get('/checkUsername', function(req, res) {
  if (req.user) {
    res.json(req.user);
  }
});

// Can refactor these two blocks into one
app.post('/checkUsernameExists', userController.checkUsernameExists);

app.post('/checkEmailExists', userController.checkEmailExists);

app.post('/lockDomain', userController.lockDomain);

app.post('/loginChecker', passport.authenticate('local-login'), function(req, res) {
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
  res.send(req.isAuthenticated() ? req.user : '0');
});

app.put('/change-api', userController.changeAPIKey);

app.get('/getAPIStats', function(req, res){
  Stats.find({apiKey: {$regex : ".*" + req.user.apiKey + ".*"}}).find(function(err, stats){
    if(err) throw err;
    res.json(stats);
  });
});

app.get('/getAdminStats', function(req, res) {
  Stats.find(function(err, stats) {
    if(err) throw err;
    res.json(stats);
  })
})

app.get('/getAdminUserData', function(req, res) {
  Users.find(function(err, users) {
    if(err) throw err;
    res.json(users);
  })
})

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile(path.resolve(__dirname + '/../index.html'));
});

server.listen(process.env.PORT || 3000);
