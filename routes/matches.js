const crypto = require('crypto');
const constants = require('../constants');
let Matches;
let sequelize;
let sendSocketMsg;

exports.init = (models, db, sendMsg, registerForMsg) => {
  Matches = models.Matches;
  sequelize = db;
  sendSocketMsg = sendMsg;
};

exports.live = (req, res) => {
  const leagueId = req.params.leagueId;
  return Matches.findOne({ where: { $and: [{ leagueId: leagueId }, { final: 0 }]}}).then(match => {
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
          id: {
            $in: playerIds
          }
        }
      }),
      SimpleGames.findAll({
        where: {
          matchId: match.id
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
  let foundMatches;
  return Matches.findAll({
    order: sequelize.literal('start_time DESC'),
    limit: req.params.count
  }).then(matches => {
    if (!matches || matches.length === 0) {
      return res.json({});
    }

    let playerIds = [];
    foundMatches = matches;
    matches.forEach(m => {
      if (playerIds.indexOf(m.player1Id) === -1) {
        playerIds.push(m.player1Id);
      }
      if (playerIds.indexOf(m.player2Id) === -1) {
        playerIds.push(m.player2Id);
      }
      if (m.partner1Id && playerIds.indexOf(m.partner1Id) === -1) {
        playerIds.push(m.partner1Id);
      }
      if (m.partner2Id && playerIds.indexOf(m.partner2Id) === -1) {
        playerIds.push(m.partner2Id);
      }
    });

    return Promise.all([
      Players.findAll({
        where: {
          id: {
            $in: playerIds
          }
        }
      }),
      SimpleGames.findAll({
        where: {
          matchId: {
            $in: matches.map(m => m.id)
          }
        }
      })
    ]);
  }).then(results => {
    let players = results[0];
    let augmentedMatches = foundMatches.map(m => augmentMatch(m, players));
    let games = results[1];
    games.map(g => {
      let match = augmentedMatches.find(m => m.id === g.matchId);
      if (match) {
        g = augmentGame(g, match)
        if (!match.games) {
          match.games = [];
        }
        match.games.push(g);
        return g;
      }
    });
    return res.json(augmentedMatches);
  });
};