const passport = require('passport');

/**
 * Logout
 */
exports.logout = (req, res) => {
  req.logout();
  res.send(200);
};

/**
 * Login
 */
exports.login = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);

    req.logIn(user, function (err) {

      if (err) return res.send(err);
      res.json(req.user);
    });
  })(req, res, next);
};