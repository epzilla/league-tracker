const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const encryptPassword = (pw, salt) => bcrypt.hashSync(pw, salt);
const passwordAuth = (User, plainText) => (encryptPassword(plainText, User.salt) === User.hashedPassword);
let User;

/**
 * Passport configuration
 */
module.exports = function (usr) {
  User = usr;

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    if (!user || !user.id) {
      return done('No user');
    }
    return User.findById(user.id).then(u => {
      return done(null, u);
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
        if (!passwordAuth(user, password)) {
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