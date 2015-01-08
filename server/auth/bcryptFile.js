var bcrypt = require('bcrypt');
var db = require('./db');
var SALT_WORK_FACTOR = 10;

db.userSchema.pre('save', function(next) {
  console.log('3 reached the bcrypt middleware');
  var user = this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      console.log('4 hashing password in bcrypt');
      if(err) return next(err);
      user.password = hash;
      // next();
      bcrypt.hash(user.username, salt, function(err, hash) {
        console.log('5 hashing api in bcrypt');
        if(err) return next(err);
        console.log(hash);
        user.apiKey = hash;
        next();
      })
    });
  });
});

// module.exports = db.userSchema.pre;
