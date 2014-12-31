var passport = require('passport');
var db = require('./db');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  // console.log('user is being seriliazed');
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // console.log('user be deserialized');
  db.User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) {
  db.User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    console.log('user', user);
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log('Errorrrr');
        return done(err);
      }
      if(isMatch) {
        console.log('match found');
        return done(null, user);
      } else {
        console.log('NOT MATCH!');
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));



module.exports = passport;