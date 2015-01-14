// var bcrypt = require('bcrypt');
// var db = require('./db');
// var SALT_WORK_FACTOR = 10;

db.userSchema.pre('save', function(next) {
  console.log('3 reached the bcrypt middleware');
  var user = this;
  if(!user.isModified('password')) {
    return next();
  }

  var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  user.password = bcrypt.genSaltSync(user.password, salt);
  user.apiKey = bcrypt.genSaltSync(user.username, salt);
  console.log('apiKey', apiKey);
  next();

});

// module.exports = db.userSchema.pre;
