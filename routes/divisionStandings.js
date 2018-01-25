let DivisionStandings;

exports.init = (models) => {
  DivisionStandings = models.DivisionStandings;
};

exports.get = (req, res) => {
  return DivisionStandings.findAll().then(p => res.json(p));
};