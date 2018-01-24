const crypto = require('crypto');
const constants = require('../constants');
let SimpleGames;
let Matches;
let sequelize;
let sendSocketMsg;

const validateMatchToken = (req, res) => {
  const deviceId = req.body.deviceId || req.params.deviceId;
  if (!deviceId) {
    return Promise.reject(constants.DEVICE_CANNOT_UPDATE_MATCH);
  }
  const hash = crypto.createHash('sha256');
  hash.update('01a217ea-67bf-' + deviceId + '411a-965e-3e874e15e490');
  const hashedToken = hash.digest('hex');
  return sequelize.query(`select match_id from match_key where key = '${hashedToken}'`).then(result => {
    return (result.length > 0 && result[0].length > 0);
  });
};

const augmentMatch = (m, players) => {
  let match = m.get({ plain: true });
  let player1 = players.find(p => p.id === match.player1Id);
  let player2 = players.find(p => p.id === match.player2Id);
  let partner1 = match.partner1Id ? players.find(p => p.id === match.partner1Id) : null;
  let partner2 = match.partner2Id ? players.find(p => p.id === match.partner2Id) : null;
  let augMatch = Object.assign({
    player1Fname: player1.fname,
    player1Lname: player1.lname,
    player1MiddleInitial: player1.middleInitial,
    player2Fname: player2.fname,
    player2Lname: player2.lname,
    player2MiddleInitial: player2.middleInitial,
    partner1Fname: partner1 ? partner1.fname : null,
    partner1Lname: partner1 ? partner1.lname : null,
    partner1MiddleInitial: partner1 ? partner1.middleInitial : null,
    partner2Fname: partner2 ? partner2.fname : null,
    partner2Lname: partner2 ? partner2.lname : null,
    partner2MiddleInitial: partner2 ? partner2.middleInitial : null
  }, match);
  return augMatch;
};

const augmentGame = (g, match) => {
  let game = g.get({ plain: true });
  let augGame = Object.assign({
    player1Id: match.player1Id,
    player2Id: match.player2Id,
    partner1Id: match.partner1Id,
    partner2Id: match.partner2Id,
    player1Fname: match.player1Fname,
    player1Lname: match.player1Lname,
    player1MiddleInitial: match.player1MiddleInitial,
    player2Fname: match.player2Fname,
    player2Lname: match.player2Lname,
    player2MiddleInitial: match.player2MiddleInitial,
    partner1Fname: match.partner1Fname,
    partner1Lname: match.partner1Lname,
    partner1MiddleInitial: match.partner1MiddleInitial,
    partner2Fname: match.partner2Fname,
    partner2Lname: match.partner2Lname,
    partner2MiddleInitial: match.partner2MiddleInitial
  }, game);
  return augGame;
};

exports.init = (models, db, sendMsg, registerForMsg) => {
  SimpleGames = models.SimpleGames;
  Players = models.Players;
  Matches = models.Matches;
  sequelize = db;
  sendSocketMsg = sendMsg;
};

exports.findById = (req, res) => {
  let foundMatch;
  return Matches.findById(req.params.id).then(match => {
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

exports.create = (req, res) => {
  const matchInfo = req.body;
  const deviceId = matchInfo.deviceId || req.params.deviceId;
  if (!deviceId) {
    return res.status(400).send(constants.NO_DEVICE_ID);
  }

  let match, game;
  return Matches.findOne({
    where: {
      finished: 0
    }
  }).then(matchInProgress => {
    if (matchInProgress) {
      return res.status(400).send(constants.MATCH_IN_PROGRESS);
    }

    return Matches.create({
      player1Id: matchInfo.player1.id,
      player2Id: matchInfo.player2.id,
      partner1Id: matchInfo.partner1 ? matchInfo.partner1.id : null,
      partner2Id: matchInfo.partner2 ? matchInfo.partner2.id : null,
      doubles: matchInfo.doubles,
      updateEveryPoint: matchInfo.updateEveryPoint,
      bestOf: matchInfo.bestOf || 4,
      playTo: matchInfo.playTo || 21,
      winByTwo: matchInfo.winByTwo || 1,
      playAllGames: matchInfo.playAllGames || 0
    });
  }).then(m => {
    match = {
      games: [{
        gameId: null
      }],
      id: m.id,
      doubles: m.doubles,
      player1Id: m.player1Id,
      player2Id: m.player2Id,
      partner1Id: m.partner1Id,
      partner2Id: m.partner2Id,
      player1Fname: matchInfo.player1.fname,
      player1Lname: matchInfo.player2.lname,
      player1MiddleInitial: matchInfo.player2.middleInitial,
      player2Fname: matchInfo.player2.fname,
      player2Lname: matchInfo.player2.lname,
      player2MiddleInitial: matchInfo.player2.middleInitial,
      partner1Fname: matchInfo.partner1 ? matchInfo.partner1.fname : null,
      partner1Lname: matchInfo.partner1 ? matchInfo.partner1.lname : null,
      partner1MiddleInitial: matchInfo.partner1 ? matchInfo.partner1.middleInitial : null,
      partner2Fname: matchInfo.partner2 ? matchInfo.partner2.fname : null,
      partner2Lname: matchInfo.partner2 ? matchInfo.partner2.lname : null,
      partner2MiddleInitial: matchInfo.partner2 ? matchInfo.partner2.middleInitial : null,
      updateEveryPoint: m.updateEveryPoint,
      bestOf: m.bestOf,
      playTo: m.playTo,
      winByTwo: m.winByTwo,
      playAllGames: m.playAllGames,
      finished: m.finished,
      startTime: m.startTime,
      finishTime: m.finishTime
    };
    const hash = crypto.createHash('sha256');
    hash.update('01a217ea-67bf-' + deviceId + '411a-965e-3e874e15e490');
    const hashedToken = hash.digest('hex');
    const initialScore = m.updateEveryPoint ? 0 : m.playTo;
    return Promise.all([
      sequelize.query(`insert into match_key (key, match_id) values ('${hashedToken}', '${m.id}')`, { type: sequelize.QueryTypes.INSERT }),
      sequelize.query(`insert into games (match_id, score1, score2) values ('${m.id}', ${initialScore}, ${initialScore})`, { type: sequelize.QueryTypes.INSERT })
    ]);
  }).then(result => {

    game = {
      gameId: result[1][0],
      score1: 0,
      score2: 0,
      matchFinished: 0,
      gameFinished: 0,
      player1Id: match.player1Id,
      player2Id: match.player2Id,
      player1Fname: matchInfo.player1.fname,
      player1Lname: matchInfo.player1.lname,
      player1MiddleInitial: matchInfo.player1.middleInitial,
      player2Fname: matchInfo.player2.fname,
      player2Lname: matchInfo.player2.lname,
      player2MiddleInitial: matchInfo.player2.middleInitial,
      partner1Fname: matchInfo.partner1 ? matchInfo.partner1.fname : null,
      partner1Lname: matchInfo.partner1 ? matchInfo.partner1.lname : null,
      partner1MiddleInitial: matchInfo.partner1 ? matchInfo.partner1.middleInitial : null,
      partner2Fname: matchInfo.partner2 ? matchInfo.partner2.fname : null,
      partner2Lname: matchInfo.partner2 ? matchInfo.partner2.lname : null,
      partner2MiddleInitial: matchInfo.partner2 ? matchInfo.partner2.middleInitial : null,
    };
    match.games[0] = game;
    sendSocketMsg(constants.MATCH_STARTED, match, deviceId);
    return res.json({
      match: match,
      deviceId: deviceId
    });
  });
};

exports.canUpdate = (req, res) => {
  return validateMatchToken(req, res).then(result => {
    res.send(result);
  });
};

exports.update = (req, res) => {
  const match = req.body.match;
  return validateMatchToken(req, res).then(result => {
    if (!result) {
      return res.sendStatus(400);
    }

    return Matches.findOne({ where: { id: match.id }});
  }).then(m => {
    m.player1Id = match.player1Id;
    m.player2Id = match.player2Id;
    m.finished = match.finished;
    return m.save();
  }).then(() => {
    return res.json(match);
  }).catch(e => {
    return res.send(500, e);
  });
};

exports.addDevices = (req, res) => {
  const match = req.body.match;
  const devices = req.body.devices;
  return validateMatchToken(req, res).then(result => {
    if (!result) {
      return res.sendStatus(400);
    }

    let promises = devices.map(d => {
      const hash = crypto.createHash('sha256');
      hash.update('01a217ea-67bf-' + d.id + '411a-965e-3e874e15e490');
      const hashedToken = hash.digest('hex');
      return sequelize.query(`insert into match_key (key, match_id) values ('${hashedToken}', '${match.id}')`, { type: sequelize.QueryTypes.INSERT });
    });

    return Promise.all(promises);
  }).then(result => {
    let packet = { match, deviceIds: devices.map(dev => dev.id) };
    sendSocketMsg(constants.ADDED_DEVICES_TO_MATCH, packet, req.body.deviceId);
    return res.json(packet);
  }).catch(e => {
    return res.status(500).send(e);
  });
};

exports.finish = (req, res) => {
  const match = req.body.match;
  let finishedMatch;
  return validateMatchToken(req, res).then(result => {
    if (!result) {
      return res.sendStatus(400);
    }

    return Matches.findOne({ where: { id: match.id }});
  })
  .then(m => {
    m.player1Id = match.player1Id;
    m.player2Id = match.player2Id;
    m.partner1Id = match.partner1Id;
    m.partner2Id = match.partner2Id;
    m.finished = 1;
    m.finishTime = new Date();
    return m.save();
  })
  .then(() => Matches.findOne({ where: { id: match.id }}))
  .then(updatedMatch => {
    finishedMatch = updatedMatch;
    return Promise.all([
      sequelize.query(`delete from match_key where match_id='${match.id}'`, { type: sequelize.QueryTypes.DELETE }),
      sequelize.query(`
        select
          p1.fname as player1Fname,
          p1.lname as player1Lname,
          p1.mi as player1MiddleInitial,
          p1.id as player1Id,
          p2.fname as player2Fname,
          p2.lname as player2Lname,
          p2.mi as player2MiddleInitial,
          p2.id as player2Id,
          p3.fname as partner1Fname,
          p3.lname as partner1Lname,
          p3.mi as partner1MiddleInitial,
          p3.id as partner1Id,
          p4.fname as partner2Fname,
          p4.lname as partner2Lname,
          p4.mi as partner2MiddleInitial,
          p4.id as partner2Id,
          g.score1,
          g.score2,
          m.id as matchId,
          m.doubles as doubles,
          g.id as gameId,
          m.finished as matchFinished,
          g.finished as gameFinished,
          m.best_of as bestOf,
          m.win_by_two as winByTwo,
          m.play_to as playTo,
          m.update_every_point as updateEveryPoint,
          m.play_all_games as playAllGames,
          m.start_time as startTime,
          m.finish_time as finishTime
        from
          (select * from matches m where id = ${match.id} limit 1) as m
          join games g on g.match_id = m.id
          join players p1 on m.player1_id = p1.id
          join players p2 on m.player2_id = p2.id
          join players p3 on m.partner1_id = p3.id
          join players p4 on m.partner2_id = p4.id`, { type: sequelize.QueryTypes.SELECT}
      )
    ]);
  })
  .then(result => {
    let json = {
      games: result[1],
      id: finishedMatch.id,
      doubles: finishedMatch.doubles,
      player1Id: finishedMatch.player1Id,
      player2Id: finishedMatch.player2Id,
      partner1Id: finishedMatch.partner1Id,
      partner2Id: finishedMatch.partner2Id,
      updateEveryPoint: finishedMatch.updateEveryPoint,
      playAllGames: finishedMatch.playAllGames,
      bestOf: finishedMatch.bestOf,
      playTo: finishedMatch.playTo,
      winByTwo: finishedMatch.winByTwo,
      finished: finishedMatch.finished,
      startTime: finishedMatch.startTime,
      finishTime: finishedMatch.finishTime
    }
    sendSocketMsg(constants.MATCH_FINISHED, json, req.body.deviceId);
    res.json(json);
  })
  .catch(e => {
    return res.send(500, e);
  });
};

exports.addGame = (req, res) => {
  try {
    const match = req.body.match;
    const oldGame = match.games[match.games.length - 1];
    return validateMatchToken(req, res).then(result => {
      if (!result) {
        return res.sendStatus(400);
      }

      return sequelize.query(`insert into games (match_id) values ('${match.id}')`, { type: sequelize.QueryTypes.INSERT })
    }).then(result => {
      const game = {
        gameId: result[0],
        matchId: match.id,
        score1: match.updateEveryPoint ? 0 : match.playTo,
        score2: match.updateEveryPoint ? 0 : match.playTo,
        matchFinished: 0,
        gameFinished: 0,
        player1Id: match.player1Id,
        player2Id: match.player2Id,
        partner1Id: match.partner1Id,
        partner2Id: match.partner2Id,
        player1Fname: oldGame.player1Fname,
        player1Lname: oldGame.player1Lname,
        player1MiddleInitial: oldGame.player1MiddleInitial,
        player2Fname: oldGame.player2Fname,
        player2Lname: oldGame.player2Lname,
        player2MiddleInitial: oldGame.player2MiddleInitial,
        partner1Fname: oldGame.partner1Fname,
        partner1Lname: oldGame.partner1Lname,
        partner1MiddleInitial: oldGame.partner1MiddleInitial,
        partner2Fname: oldGame.partner2Fname,
        partner2Lname: oldGame.partner2Lname,
        partner2MiddleInitial: oldGame.partner2MiddleInitial
      };
      sendSocketMsg(constants.GAME_STARTED, game, req.body.deviceId);
      res.json(game);
    });
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.updateGame = (req, res) => {
  const game = req.body.game;
  const scorer = req.body.scorer;
  return validateMatchToken(req, res).then(result => {
    if (!result) {
      return res.sendStatus(400);
    }

    return SimpleGames.findOne({ where: { gameId: game.gameId }});
  }).then(g => {
    g.score1 = game.score1;
    g.score2 = game.score2;
    g.gameFinished = game.gameFinished;
    return g.save();
  }).then(() => {
    return Matches.findById(game.matchId);
  }).then(m => {
    if (game.gameFinished) {
      sendSocketMsg(constants.GAME_FINISHED, { game }, req.body.deviceId);
    } else if (m.updateEveryPoint) {
      sendSocketMsg(constants.SCORE_UPDATE, { game, scorer }, req.body.deviceId);
    }
    return res.json(game);
  }).catch(e => {
    return res.send(500, e);
  });
};

exports.current = (req, res) => {
  return Matches.findOne({ where: { finished: 0}}).then(match => {
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

exports.mostRecent = (req, res) => {
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

exports.matchesByPlayers = (req, res) => {
  const player1Id = parseInt(req.params.player1Id);
  const player2Id = parseInt(req.params.player2Id);
  return Promise.all([
    Matches.findAll({
      order: sequelize.literal('start_time DESC'),
      limit: req.params.count
    }),
    sequelize.query(`
      select
        p1.fname as player1Fname,
        p1.lname as player1Lname,
        p1.mi as player1MiddleInitial,
        p1.id as player1Id,
        p2.fname as player2Fname,
        p2.lname as player2Lname,
        p2.mi as player2MiddleInitial,
        p2.id as player2Id,
        p3.fname as partner1Fname,
        p3.lname as partner1Lname,
        p3.mi as partner1MiddleInitial,
        p3.id as partner1Id,
        p4.fname as partner2Fname,
        p4.lname as partner2Lname,
        g.score1,
        g.score2,
        m.id as matchId,
        m.doubles as doubles,
        g.id as gameId,
        m.finished as matchFinished,
        g.finished as gameFinished,
        m.best_of as bestOf,
        m.win_by_two as winByTwo,
        m.play_to as playTo,
        m.update_every_point as updateEveryPoint,
        m.play_all_games as playAllGames,
        m.start_time as startTime,
        m.finish_time as finishTime
      from matches m
        left outer join games g on g.match_id = m.id
        left outer join players p1 on p1.id = m.player1_id
        left outer join players p2 on p2.id = m.player2_id
        left outer join players p3 on p3.id = m.partner1_id
        left outer join players p4 on p4.id = m.partner2_id
      where ((p1.id = ${player1Id} and p2.id = ${player2Id}) or (p2.id = ${player1Id} and p1.id = ${player2Id})) and (doubles = 0)
      order by m.start_time desc`, { type: sequelize.QueryTypes.SELECT}
    )
  ]).then(result => {
    let matchResults = {};
    let statPack = {
      player1Id: player1Id,
      player2Id: player2Id,
      meetings: result[0].length,
      p1MatchesWon: 0,
      p2MatchesWon: 0,
      matchesDrawn: 0,
      p1GamesWon: 0,
      p2GamesWon: 0,
      p1TotalPoints: 0,
      p2TotalPonts: 0
    };
    let augmentedMatches = result[0].map(m => {
      matchResults[m.id] = {
        p1wins: 0,
        p2wins: 0
      };
      return {
        games: [],
        id: m.id,
        player1Id: m.player1Id,
        player2Id: m.player2Id,
        updateEveryPoint: m.updateEveryPoint,
        playAllGames: m.playAllGames,
        bestOf: m.bestOf,
        playTo: m.playTo,
        winByTwo: m.winByTwo,
        finished: m.finished,
        startTime: m.startTime,
        finishTime: m.finishTime
      };
    });

    result[1].forEach(g => {
      let match = augmentedMatches.find(m => m.id === g.matchId);
      if (match) {
        match.games.push(g);
        if (g.player1Id === player1Id) {
          statPack.p1TotalPoints += g.score1;
          statPack.p2TotalPonts += g.score2;
          if (g.score1 > g.score2) {
            statPack.p1GamesWon++;
            matchResults[match.id].p1wins++;
          } else if (g.score2 > g.score1) {
            statPack.p2GamesWon++;
            matchResults[match.id].p2wins++;
          }
        } else {
          statPack.p1TotalPoints += g.score2;
          statPack.p2TotalPonts += g.score1;
          if (g.score1 > g.score2) {
            statPack.p2GamesWon++;
            matchResults[match.id].p2wins++;
          } else if (g.score2 > g.score1) {
            statPack.p1GamesWon++;
            matchResults[match.id].p1wins++;
          }
        }
      }
    });
    Object.keys(matchResults).forEach(matchId => {
      let id = parseInt(matchId);
      if (matchResults[id].p1wins > matchResults[id].p2wins) {
        statPack.p1MatchesWon++;
      }
      else if (matchResults[id].p2wins > matchResults[id].p1wins) {
        statPack.p2MatchesWon++;
      }
      else {
        statPack.matchesDrawn++;
      }
    });
    return res.json({
      matches: augmentedMatches,
      stats: statPack
    });
  });
};