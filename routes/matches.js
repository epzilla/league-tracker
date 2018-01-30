const crypto = require('crypto');
const constants = require('../constants');
let BaseballMatches;
let BasketballMatches;
let Coaches;
let Competitions;
let FoosballMatches;
let FootballMatches;
let HockeyMatches;
let Leagues;
let Op;
let Persons;
let PingPongGames;
let PingPongMatches;
let Players;
let sendSocketMsg;
let sequelize;
let SoccerMatches;
let Sports;
let TennisMatches;

const getSportMatchModel = (id) => {
  return Sports.findById(id).then(sport => {
    switch (sport.name) {
      case 'Soccer':
        return [sport, SoccerMatches];
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
    case 'Soccer':
      return [
        {model: SoccerMatches, as: 'match'},
        {model: Teams, as: 'teams'}
      ];
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

const getModelsFromReq = (req) => {
  const leagueSlug = req.params.leagueSlug;
  const sportId = req.params.sportId;
  let competition;
  let sport;
  let Model;
  return Promise.all([
    Leagues.findOne({ where: { slug: leagueSlug }, include: [{ model: Competitions, as: 'competitions' }]}),
    getSportMatchModel(sportId)
  ]).then(results => {
    let league = results[0];
    let competitions = league.competitions;
    competition = competitions.find(c => !!c.current);
    sport = results[1][0];
    Model = results[1][1];
    return { competition, sport, Model };
  });
};

exports.init = (models, db, sendMsg, registerForMsg) => {
  Op = db.Op;
  sequelize = db;
  sendSocketMsg = sendMsg;
  Competitions = models.Competitions;
  Leagues = models.Leagues;
  Persons = models.Persons;
  PingPongGames = models.PingPongGames;
  PingPongMatches = models.PingPongMatches;
  Players = models.Players;
  Sports = models.Sports;
};

exports.live = (req, res) => {
  return getModelsFromReq(req).then(({ competition, sport, Model }) => {
    return Model.findAll({
      where: { finished: 0, competitionId: competition.id },
      order: [['startTime', 'ASC']],
      include: getMatchModelIncludes(sport)
    });
  }).then(matches => {
    return res.json(matches || []);
  });
};

exports.recent = (req, res) => {
  return getModelsFromReq(req).then(({ competition, sport, Model }) => {
    return Model.findAll({
      where: { competitionId: competition.id, finished: 1 },
      order: [['finishTime', 'DESC']],
      limit: req.params.count !== null && req.params.count !== undefined ? req.params.count : 25,
      include: getMatchModelIncludes(sport)
    });
  }).then(matches => {
    return res.json(matches || []);
  });
};

exports.upcoming = (req, res) => {
  return getModelsFromReq(req).then(({ competition, sport, Model }) => {
    return Model.findAll({
      where: { started: 0, competitionId: competition.id },
      order: [['startTime', 'ASC']],
      include: getMatchModelIncludes(sport)
    });
  }).then(matches => {
    return res.json(matches || []);
  });
};