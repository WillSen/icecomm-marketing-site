var User = require('./userModel');

var userController = {};
userController.lockDomain = lockDomain;
userController.checkUsernameExists = checkUsernameExists;
userController.checkEmailExists = checkEmailExists;
userController.changeAPIKey = changeAPIKey;

function lockDomain(req, res) {
  var user = req.user;
  var domain = req.body.domain || "";
  User.update(user, { url: domain}, function(err) {
    res.send('successful saving')
  });
}

function checkUsernameExists(req, res) {
  var username = req.body.username;
  var alreadyExisting = {};
  alreadyExisting.alreadyExisting = true;
  User.findOne({username: username}, function(err, foundUser) {
    console.log('foundUser', foundUser);
    if (!foundUser) {
      alreadyExisting.alreadyExisting = false;
    }
    res.send(alreadyExisting);
  });
}

function checkEmailExists(req, res) {
  var email = req.body.email;
  var alreadyExisting = {};
  alreadyExisting.alreadyExisting = true;
  User.findOne({email: email}, function(err, foundEmail) {
    console.log('foundEmail', foundEmail);
    if (!foundEmail) {
      alreadyExisting.alreadyExisting = false;
    }
    res.send(alreadyExisting);
  });
}

function changeAPIKey(req ,res) {
  var user = req.user;
  console.log('user', user);
  User.findOne({username: user.username}, function(err, foundUser) {
    console.log(foundUser);
    foundUser.changeApiKey(function(newUser) {
      res.send(newUser);
    });
  });
}

module.exports = userController;