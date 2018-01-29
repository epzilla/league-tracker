const crypto = require('crypto');
const constants = require('../constants');
let Op;
let Sports;
let Players;
let Persons;
let Coaches;
let Leagues;
let TennisMatches;
let FootballMatches;
let BaseballMatches;
let BasketballMatches;
let SoccerMatches;
let HockeyMatches;
let FoosballMatches;
let PingPongMatches;
let PingPongGames;
let sequelize;
let sendSocketMsg;

const getSportMatchModel = (id) => {
  return Sports.findById(id).then(sport => {
    switch (sport.name) {
      case 'Ping Pong':
      case 'Table Tennis':
        return [sport, PingPongMatches];
      default:
        return [sport, PingPongMatches];
    }
  });
};

const getMatchModelIncludes = (sport) => {
  switch (sport.name) {
    case 'Ping Pong':
    case 'Table Tennis':
      return [
        {model: PingPongGames, as: 'games'},
        {model: Players, as: 'players',
          include: [
            {model: Persons, as: 'person'}
          ]
        }
      ];
    default:
      return PingPongMatches;
  }
};

exports.init = (models, db, sendMsg, registerForMsg) => {
  Op = db.Op;
  Sports = models.Sports;
  Leagues = models.Leagues;
  Players = models.Players;
  Persons = models.Persons;
  PingPongMatches = models.PingPongMatches;
  PingPongGames = models.PingPongGames;
  sequelize = db;
  sendSocketMsg = sendMsg;
};

exports.live = (req, res) => {
  const leagueSlug = req.params.leagueSlug;
  const sportId = req.params.sportId;
  let sport;
  let Model;
  return Promise.all([
    Leagues.findOne({ where: { slug: leagueSlug }}),
    getSportMatchModel(sportId)
  ]).then(results => {
    let league = results[0];
    sport = results[1][0];
    Model = results[1][1];
    return Model.findAll({
      where: { finished: 0, leagueId: league.id },
      order: [['startTime', 'ASC']],
      include: getMatchModelIncludes(sport)
    });
  }).then(matches => {
    return res.json(matches || []);
  });
};

exports.recent = (req, res) => {
  const leagueSlug = req.params.leagueSlug;
  const sportId = req.params.sportId;
  let sport;
  let Model;
  return Promise.all([
    Leagues.findOne({ where: { slug: leagueSlug }}),
    getSportMatchModel(sportId)
  ]).then(results => {
    let league = results[0];
    sport = results[1][0];
    Model = results[1][1];
    return Model.findAll({
      where: { leagueId: league.id, finished: 1 },
      order: [['finishTime', 'DESC']],
      limit: req.params.count !== null && req.params.count !== undefined ? req.params.count : 25,
      include: getMatchModelIncludes(sport)
    });
  }).then(matches => {
    return res.json(matches || []);
  });
};

exports.upcoming = (req, res) => {
  const leagueSlug = req.params.leagueSlug;
  const sportId = req.params.sportId;
  let sport;
  let Model;
  return Promise.all([
    Leagues.findOne({ where: { slug: leagueSlug }}),
    getSportMatchModel(sportId)
  ]).then(results => {
    let league = results[0];
    sport = results[1][0];
    Model = results[1][1];
    return Model.findAll({
      where: { started: 0, leagueId: league.id },
      order: [['startTime', 'ASC']],
      include: getMatchModelIncludes(sport)
    });
  }).then(matches => {
    return res.json(matches || []);
  });
};