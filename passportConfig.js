const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/**
 * Passport configuration
 */
module.exports = function (User) {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    if (!user || !user.id) {
      return done('No user');
    }
    return User.findById(user.id).then(u => {
      delete u['password'];
      delete u['salt'];
      delete u['hashedPassword'];
      return done(null, user);
    }).catch(err => {
      return done(err);
    });
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, (email, password, done) => {
      return User.findOne({ where: { email: email}}).then(user => {
        if (!user) {
          return done(null, false, {
            message: 'This email is not registered.'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'This password is not correct.'
          });
        }
        return done(null, user);
      }).catch(err => {
        return done(err);
      });
    }
  ));
};