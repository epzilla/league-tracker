const players = require('./players');
const matches = require('./matches');
const devices = require('./devices');

module.exports = function (models, app, sequelize, sendSocketMsg, registerForMsg) {
  matches.init(models, sequelize, sendSocketMsg, registerForMsg);
  players.init(models);
  devices.init(models);

  // Players
  app.get('/api/players', players.get);
  app.post('/api/players', players.create);

  // Matches/Games
  app.get('/api/matches/by-players/:player1Id/:player2Id', matches.matchesByPlayers);
  app.get('/api/matches/most-recent/:count', matches.mostRecent);
  app.get('/api/matches/current', matches.current);
  app.get('/api/matches/can-update-score/:deviceId', matches.canUpdate);
  app.get('/api/matches/:id', matches.findById);
  app.post('/api/matches/create', matches.create);
  app.post('/api/matches/update', matches.update);
  app.post('/api/matches/finish', matches.finish);
  app.post('/api/matches/add-devices', matches.addDevices);
  app.post('/api/games/add', matches.addGame);
  app.post('/api/games/update', matches.updateGame);

  // Devices
  app.get('/api/devices', devices.get);
  app.post('/api/devices', devices.create);

  app.del('/api/reset-all', (req, res) => {
    return sequelize.query(`
      delete from games where id in
      ( select
          g.id as gameId
        from
          (select * from matches m where finished = 0 order by start_time limit 1) as m
          join games g on g.match_id = m.id
          join players p1 on m.player1_id = p1.id
          join players p2 on m.player2_id = p2.id
        order by m.start_time desc
      )`, { type: sequelize.QueryTypes.DELETE }
    )
    .then(() => sequelize.query(`delete from match_key`, { type: sequelize.QueryTypes.DELETE }))
    .then(() => sequelize.query(`delete from matches where finished = 0`, { type: sequelize.QueryTypes.DELETE }))
    .then(() => sequelize.query(`delete from devices`, { type: sequelize.QueryTypes.DELETE }))
    .then(() => res.sendStatus(200))
    .catch(e => res.status(500).send(e));
  });

  app.get('/*', (req, res) => res.render('index'));
};