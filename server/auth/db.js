var mongodb = require('mongodb');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var bcrypt = require('bcrypt');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

// mongoose uri string format is different from vanilla mongodb:
var mongodbUri = 'mongodb://nmandel:backmassage4@ds031271.mongolab.com:31271/icecommusers';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

// 30 second connection timeout reccommended by mongolab:
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

mongoose.connect(mongooseUri, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

db.userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  apiKey: {type: String},
  url: {type: String}
});

// Password verification
db.userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

db.userSchema.pre('save', function(next) {
  console.log('3 reached the bcrypt middleware');
  var user = this;
  if(!user.isModified('password')) {
    return next();
  }

  var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  user.password = bcrypt.hashSync(user.password, salt);
  user.apiKey = bcrypt.hashSync(user.username, salt).slice(10).replace(/\./g, '');
  next();
});

db.User = mongoose.model('User', db.userSchema);

module.exports = db;