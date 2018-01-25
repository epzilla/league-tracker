let Users;
let Leagues;

exports.init = (models) => {
  Users = models.Users;
  Leagues = models.Leagues;
};

exports.getAll = (req, res) => {
  return Users.findAll().then(u => res.json(u));
};

exports.get = (req, res) => {
  return Users.findById(req.params.userId).then(u => res.json(u));
};

exports.getLeaguesForUser = (req, res) => {
  return Users.findById(req.params.userId).then(u => {
    let ids = u.leagueIds.split(',').map(id => parseInt(id));
    return Leagues.findAll({ where: { id: { $in: ids }}})
  }).then(leagues => {
    return res.json(leagues);
  }).catch(err => res.status(500).send(err));
};