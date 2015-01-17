var User = require('./userModel');

var userController = {};
userController.lockDomain = lockDomain;

function lockDomain(req, res) {
  var user = req.user;
  var domain = req.body.domain || "";
  User.update(user, { url: domain}, function(err) {
    res.send('successful saving')
  });
}

module.exports = userController;