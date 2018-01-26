const passport = require('passport');
let sequelize;

const stripSensitiveFields = (user) => {
  let obj = user.get({ plain: true });
  delete obj.hashedPassword;
  delete obj.salt;
  delete obj.provider;
  return obj;
};

exports.init = (db) => {
  sequelize = db;
};

/**
 * Logout
 */
exports.logout = (req, res) => {
  const id = req.session.id;
  req.logout();
  // Clean up session in the database
  sequelize.query(`DELETE FROM sessions WHERE sid = '${id}'`, { type: sequelize.QueryTypes.DELETE});
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
      res.json(stripSensitiveFields(req.user));
    });
  })(req, res, next);
};