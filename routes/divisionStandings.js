let Divisions;
let DivisionStandings;
let Leagues;
let Competitions;
let Teams;
let TeamStandings;
let Op;

exports.init = (models, db) => {
  Op = db.Op;
  Divisions = models.Divisions;
  DivisionStandings = models.DivisionStandings;
  Competitions = models.Competitions;
  Leagues = models.Leagues;
  Teams = models.Teams;
  TeamStandings = models.TeamStandings;
};

exports.get = (req, res) => {
  return DivisionStandings.findAll().then(p => res.json(p));
};

exports.getLeagueWithStandings = (req, res) => {
  let leagueSlug = req.params.leagueSlug;
  return Leagues.find({ where: { slug: leagueSlug }, include: [
    { model: Players, as: 'players'},
    { model: Teams, as: 'teams', include: [
      { model: Players, as: 'players'}
    ]},
    { model: Divisions, as: 'divisions', include: [
      { model: Teams, as: 'teams'}
    ]},
    { model: Competitions, as: 'competitions', include: [
      { model: DivisionStandings, as: 'divisionStandings', include: [
        { model: Divisions, as: 'division'},
        { model: TeamStandings, as: 'teamStandings', include: [
          { model: Teams, as: 'team'}
        ]}
      ]}
    ]}
  ]}).then(league => {
    if (league) {
      return res.json(league);
    }
    return res.status(400).send(`Could not find standings for ${leagueSlug}`);
  }).catch(e => res.status(500).send(e));
};