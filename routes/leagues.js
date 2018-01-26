let Leagues;

exports.init = (models) => {
  Leagues = models.Leagues;
};

exports.getAll = (req, res) => {
  return Leagues.findAll({ include: [{ all: true }] }).then(p => res.json(p)).catch(err => res.status(500).send(err));
};

exports.get = (req, res) => {
  return Leagues.findById(req.params.leagueId, { include: [{ all: true }] }).then(p => res.json(p)).catch(err => res.status(500).send(err));
};