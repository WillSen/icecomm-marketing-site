var passport = require('passport');
var User = require('../user/userModel');
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
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use('/lost', new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Unknown user ' + username });
    }
    return done(null, user);
  });
}))


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Unknown user ' + username });
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log('error', err);
        return done(err);
      }
      if(isMatch) {
        console.log('match found');
        return done(null, user);
      } else {
        console.log('no matches were found');
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


passport.loginAuth = function(req, res, next) {
  console.log('username', req.body.username);
  console.log('password', req.body.password);
  passport.authenticate('local', function(err, user, info) {
    console.log('user', user);
    if (err) { return next(err) }
    if (!user) {
      console.log('req session: ', req.session);
      req.session.messages =  [info.message];
      console.log('info', info);
      return res.json(false);
      // return res.redirect('/#/login');
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json(user);
      // return res.redirect('/');
    });
  }) (req, res, next);
}

passport.signupAuth = function(req, res, next) {
  var newUser = new User({ username: req.body.username, email: req.body.email, password: req.body.password, apiKey: '' });
  newUser.save(function(err) {
    console.log('attempting to save user');
    if(err) {
      console.log('Error with saving new user', err);
      return res.json(false);
      // return res.redirect('/#/signup');
    } else {
      console.log('user: ' + newUser.username + " saved.");
      req.logIn(newUser, function(err) {
        if (err) {
          return next(err);
        }
        // next()
        // return res.json(newUser);
        return res.redirect('/');
      });
    }
  });
};

module.exports = passport;
