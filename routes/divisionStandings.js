let Competitions;
let Divisions;
let DivisionStandings;
let Leagues;
let Op;
let Players;
let TeamOrPlayerStandings;
let Teams;

exports.init = (models, db) => {
  Op = db.Op;
  Competitions = models.Competitions;
  Divisions = models.Divisions;
  DivisionStandings = models.DivisionStandings;
  Leagues = models.Leagues;
  Players = models.Players;
  TeamOrPlayerStandings = models.TeamOrPlayerStandings;
  Teams = models.Teams;
};

exports.get = (req, res) => {
  return DivisionStandings.findAll().then(p => res.json(p));
};

exports.getLeagueWithStandings = (req, res) => {
  let leagueSlug = req.params.leagueSlug;
  return Leagues.find({ where: { slug: leagueSlug }, include: [
    { model: Teams, as: 'teams' },
    { model: Divisions, as: 'divisions', include: [
      { model: Teams, as: 'teams'}
    ]},
    { model: Competitions, as: 'competitions', include: [
      { model: DivisionStandings, as: 'divisionStandings', include: [
        { model: Divisions, as: 'division'},
        { model: TeamOrPlayerStandings, as: 'teamOrPlayerStandings', include: [
          { model: Teams, as: 'team'},
          { model: Players, as: 'player', include: [{ all: true }]}
        ]}
      ]}
    ]}
  ]}).then(league => {
    if (league) {
      return res.json(league);
    }
    return res.status(400).send(`Could not find standings for ${leagueSlug}`);
  }).catch(e => {
    res.status(500).send(e);
  });
};