let Coaches;
let Competitions;
let Leagues;
let Op;
let Persons;
let Players;
let Rosters;
let Teams;

exports.init = (models, db) => {
  Op = db.Op;
  Coaches = models.Coaches;
  Competitions = models.Competitions;
  Leagues = models.Leagues;
  Persons = models.Persons;
  Players = models.Players;
  Rosters = models.Rosters;
  Teams = models.Teams;
};

exports.getAll = (req, res) => {
  return Rosters.findAll({ include: [{ all: true }] }).then(p => res.json(p)).catch(err => res.status(500).send(err));
};

exports.getByTeamCompetition = (req, res) => {
  return Rosters.find({
    where: { [Op.and]: [{ teamId: req.params.teamId}, { competitionId: req.params.competitionId}] },
    include: [
      { model: Teams, as: 'team'},
      { model: Players, as: 'players', include: [{ model: Persons, as: 'person'}]},
      { model: Coaches, as: 'coaches', include: [{ model: Persons, as: 'person'}]}
    ]
  }).then(p => res.json(p)).catch(err => {
    res.status(500).send(err);
  });
};