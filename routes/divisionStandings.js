let Competitions;
let Divisions;
let DivisionStandings;
let Leagues;
let Op;
let Players;
let TeamOrPlayerStandings;
let Teams;
const matches = require('./matches');

exports.init = (models, db) => {
  Op = db.Op;
  Competitions = models.Competitions;
  Divisions = models.Divisions;
  DivisionStandings = models.DivisionStandings;
  Leagues = models.Leagues;
  Players = models.Players;
  Sports = models.Sports;
  TeamOrPlayerStandings = models.TeamOrPlayerStandings;
  Teams = models.Teams;
};

const updatePingPongStandings = (req, res, league) => {
  return matches.getMatchesFromCompetition(league).then(matches => {
    let players = {};
    res.json(matches);
  }).catch(e => {
    console.log(e);
    res.status(500).send(e);
  });
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

exports.updateLeagueStandings = (req, res) => {
  let leagueSlug = req.params.leagueSlug;
  let league;
  let sport;
  return Leagues.find({ where: { slug: leagueSlug }, include: [
    { model: Teams, as: 'teams' },
    { model: Sports, as: 'sport' },
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
  ]}).then(l => {
    league = l;
    sport = l.sport;
    switch (sport) {
      case 'Soccer':
        return;
      default:
        return updatePingPongStandings(req, res, league);
    }
    return matches.getMatchesFromCompetition(league);
  }).catch(e => {
    console.log(e);
    res.status(500).send(e);
  });
};