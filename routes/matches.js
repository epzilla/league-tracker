const crypto = require('crypto');
const constants = require('../constants');
let Sports;
let Players;
let TennisMatches;
let FootballMatches;
let BaseballMatches;
let BasketballMatches;
let SoccerMatches;
let HockeyMatches;
let FoosballMatches;
let PingPongMatches;
let sequelize;
let sendSocketMsg;

const getSportModel = (id) => {
  return Sports.findById(id).then(sport => {
    switch (sport.name) {
      case 'Ping Pong':
      case 'Table Tennis':
        return PingPongMatches;
      default:
        return PingPongMatches;
    }
  });
};

exports.init = (models, db, sendMsg, registerForMsg) => {
  Sports = models.Sports;
  Players = models.Players;
  PingPongMatches = models.PingPongMatches;
  sequelize = db;
  sendSocketMsg = sendMsg;
};

exports.live = (req, res) => {
  const leagueId = req.params.leagueId;
  const sportId = req.params.sportId;
  let foundMatch;
  return getSportModel(sportId).then(Model => {
    return Model.findOne({ where: { $and: [{ leagueId: leagueId }, { final: 0 }]}});
  }).then(match => {
    if (!match || match.length === 0) {
      return res.json({});
    }

    let playerIds = [];
    foundMatch = match;
    if (playerIds.indexOf(match.player1Id) === -1) {
      playerIds.push(match.player1Id);
    }
    if (playerIds.indexOf(match.player2Id) === -1) {
      playerIds.push(match.player2Id);
    }
    if (match.partner1Id && playerIds.indexOf(match.partner1Id) === -1) {
      playerIds.push(match.partner1Id);
    }
    if (match.partner2Id && playerIds.indexOf(match.partner2Id) === -1) {
      playerIds.push(match.partner2Id);
    }

    return Promise.all([
      Players.findAll({
        where: {
          $and: [
            {
              id: {
                $in: playerIds
              }
            },
            {
              sportId: sportId
            }
          ]
        }
      })
    ]);
  }).then(results => {
    let players = results[0];
    let augmentedMatch = augmentMatch(foundMatch, players);
    let games = results[1];
    games.map(g => {
      g = augmentGame(g, augmentedMatch)
      if (!augmentedMatch.games) {
        augmentedMatch.games = [];
      }
      augmentedMatch.games.push(g);
      return g;
    });
    return res.json(augmentedMatch);
  });
};

exports.recent = (req, res) => {
  const leagueId = req.params.leagueId;
  const sportId = req.params.sportId;
  let foundMatches;
  return getSportModel(sportId).then(Model => {
    return Model.findAll({
      order: [['finishTime', 'DESC']],
      limit: req.params.count !== null && req.params.count !== undefined ? req.params.count : 25,
      include: [{all: true}]
    });
  }).then(matches => {
    return res.json(matches || []);
  });
};