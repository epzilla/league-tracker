const bcrypt = require('bcryptjs');
let Users;
let Leagues;
let Competitions;
let LeagueAdmins;
let LeagueScorekeepers;
let Sports;

const makeSalt = () => bcrypt.genSaltSync(10);
const encryptPassword = (pw, salt) => bcrypt.hashSync(pw, salt);
const passwordAuth = (User, plainText) => (encryptPassword(plainText, User.salt) === User.hashedPassword);

const stripSensitiveFields = (user) => {
  let obj = user.get({ plain: true });
  delete obj.hashedPassword;
  delete obj.salt;
  delete obj.provider;
  return obj;
};

exports.init = (models) => {
  Users = models.Users;
  Leagues = models.Leagues;
  Competitions = models.Competitions;
  LeagueAdmins = models.LeagueAdmins;
  LeagueScorekeepers = models.LeagueScorekeepers;
  Sports = models.Sports;
};

exports.getAll = (req, res) => {
  return Users.findAll().then(u => res.json(u.map(user => stripSensitiveFields(user))));
};

exports.get = (req, res) => {
  return Users.findById(req.params.userId, {
    include: [
      {model: Leagues, as: 'leagues', include: [
        {model: Competitions, as: 'competitions'},
        {model: Sports, as: 'sport'}
      ]}
    ]
  }).then(u => res.json(stripSensitiveFields(u)));
};

exports.getLeaguesForUser = (req, res) => {
  return Promise.all([
    LeagueAdmins.findAll({ where: { userId: req.params.userId }, include: [{all: true}] }),
    LeagueScorekeepers.findAll({ where: { userId: req.params.userId }, include: [{all: true}] })
  ]).then(results => {
    let leagues = [...results[0], ...results[1]].map(l => l.League);
    return res.json(leagues);
  }).catch(err => {
    return res.status(500).send(err);
  });
};

/**
 * Create user
 */
exports.create = (req, res, next) => {
  let newUser = Users.build(req.body);
  newUser.provider = 'local';
  newUser.salt = makeSalt();
  newUser.hashedPassword = encryptPassword(req.body.password, newUser.salt);
  delete newUser.password;
  newUser.save().then(createdUser => {
    req.logIn(createdUser, err => {
      if (err) return next(err);
      return res.json(stripSensitiveFields(createdUser));
    });
  }).catch(err => {
    return res.status(400).send(err);
  });
};

/**
 * Change password
 */
exports.changePassword = (req, res, next) => {
  const userId = req.user._id;
  const oldPass = String(req.body.oldPassword);
  const newPass = String(req.body.newPassword);

  return Users.findById(userId).then(user => {
    if (passwordAuth(user, oldPass)) {
      user.salt = makeSalt();
      user.hashedPassword = encryptPassword(newPass, user.salt);
      return user.save().then(() => {
        return res.send(200);
      });
    } else {
      return res.status(400).send();
    }
  }).catch(err => {
    return res.status(500).send();
  });
};

/**
 * Get current user
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
