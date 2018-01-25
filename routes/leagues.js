let Leagues;

exports.init = (models) => {
  Leagues = models.Leagues;
};

exports.get = (req, res) => {
  return Leagues.findAll().then(p => res.json(p));
};