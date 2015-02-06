var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  apiKey: {type: String},
  url: {type: String, default: ""},
  user_limit: {type: Number, default: 1000}
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.changeApiKey = function(callback) {
  var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  this.apiKey = bcrypt.hashSync(this.apiKey, salt).slice(10).replace(/\./g, '');
  this.save();
  callback(this);
};

userSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) {
    return next();
  }

  var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  user.password = bcrypt.hashSync(user.password, salt);
  user.apiKey = bcrypt.hashSync(user.username, salt).slice(10).replace(/\./g, '');
  next();
});



// Change when releasing/ clear DB before
module.exports = mongoose.model('User', userSchema);
