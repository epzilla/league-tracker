let Users;
let Leagues;
let Competitions;
let LeagueAdmins;
let LeagueScorekeepers;
let Sports;

exports.init = (models) => {
  Users = models.Users;
  Leagues = models.Leagues;
  Competitions = models.Competitions;
  LeagueAdmins = models.LeagueAdmins;
  LeagueScorekeepers = models.LeagueScorekeepers;
  Sports = models.Sports;
};

exports.getAll = (req, res) => {
  return Users.findAll().then(u => res.json(u));
};

exports.get = (req, res) => {
  return Users.findById(req.params.userId, {
    include: [
      {model: Leagues, as: 'leagues', include: [
        {model: Competitions, as: 'competitions'},
        {model: Sports, as: 'sport'}
      ]}
    ]
  }).then(u => res.json(u));
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