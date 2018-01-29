let Leagues;
let Sports;

exports.init = (models) => {
  Leagues = models.Leagues;
  Sports = models.Sports;
};

exports.getAll = (req, res) => {
  return Leagues.findAll({ include: [{ all: true }] }).then(p => res.json(p)).catch(err => res.status(500).send(err));
};

exports.get = (req, res) => {
  return Leagues.find({ where: { slug: req.params.leagueSlug }, include: [{ model: Sports, as: 'sport' }] }).then(p => res.json(p)).catch(err => res.status(500).send(err));
};