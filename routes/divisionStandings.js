let Competitions;
let Divisions;
let DivisionStandings;
let Leagues;
let Op;
let Persons;
let Players;
let TeamOrPlayerStandings;
let Teams;
const matches = require('./matches');
const flatten = require('../helpers').flatten;

exports.init = (models, db) => {
  Op = db.Op;
  Competitions = models.Competitions;
  Divisions = models.Divisions;
  DivisionStandings = models.DivisionStandings;
  Leagues = models.Leagues;
  Persons = models.Persons;
  Players = models.Players;
  Sports = models.Sports;
  TeamOrPlayerStandings = models.TeamOrPlayerStandings;
  Teams = models.Teams;
};

const getStandingsFromCurrentCompetition = (league) => {
  return new Promise((resolve, reject) => {
    const competition = league.competitions.find(c => !!c.current);
    if (!competition) {
      reject('no current competition found');
    }
    let promises = [];
    let subPromises = [];
    competition.divisionStandings.forEach(cd => {
      let p = new Promise((resolve, reject) => {
        TeamOrPlayerStandings.findAll({ where: { divisionStandingsId: cd.id }, include: [
          { model: Players, as: 'player', include: [
            { model: Persons, as: 'person'}
          ]}
        ]})
          .then(st => resolve(st))
          .catch(err => reject(err));
      });
      subPromises.push(p);
    });
    Promise.all(subPromises)
      .then(results => resolve(results))
      .catch(err => reject(err));
  }).then(standings => flatten(standings));
};

const resetPlayerStandings = (standings) => {
  return standings.map(s => {
    s.wins = 0;
    s.losses = 0;
    s.draws = 0;
    s.pointsLost = 0;
    s.pointsWon = 0;
    s.gamesWon = 0;
    s.gamesLost = 0;
    return s;
  });
};

const updatePingPongStandings = (req, res, league) => {
  return Promise.all([
    matches.getMatchesFromCompetition(league),
    getStandingsFromCurrentCompetition(league)
  ]).then(result => {
    let matches = result[0];
    let playerStandings = resetPlayerStandings(result[1]);
    matches.forEach(m => {
      if (m.finished) {
        let player1;
        let player2;
        let partner1;
        let partner2;
        let team1wins = 0;
        let team2wins = 0;
        m.players.forEach(p => {
          if (p.id === m.player1Id) {
            player1 = playerStandings.find(pl => pl.playerId === p.id);
          } else if (p.id === m.player2Id) {
            player2 = playerStandings.find(pl => pl.playerId === p.id);
          } else if (m.doubles && p.id === m.partner1Id) {
            partner1 = playerStandings.find(pl => pl.playerId === p.id);
          } else if (m.doubles && p.id === m.partner2Id) {
            partner2 = playerStandings.find(pl => pl.playerId === p.id);
          }
        });
        m.games.forEach(g => {
          player1.pointsWon += g.score1;
          player2.pointsWon += g.score2;
          partner1 && (partner1.pointsWon += g.score1);
          partner2 && (partner2.pointsWon += g.score2);

          player1.pointsLost += g.score2;
          player2.pointsLost += g.score1;
          partner1 && (partner1.pointsLost += g.score2);
          partner2 && (partner2.pointsLost += g.score1);

          if (g.score1 > g.score2) {
            player1.gamesWon++;
            player2.gamesLost++;
            partner1 && ++partner1.gamesWon;
            partner2 && ++partner2.gamesLost;
            team1wins++;
          } else if (g.score2 > g.score1) {
            player2.gamesWon++;
            player1.gamesLost++;
            partner2 && ++partner2.gamesWon;
            partner1 && ++partner1.gamesLost;
            team2wins++;
          }
        });
        if (team1wins > team2wins) {
          player1.wins++;
          player2.losses++;
          partner1 && ++partner1.wins;
          partner2 && ++partner2.losses;
        } else if (team2wins > team1wins) {
          player2.wins++;
          player1.losses++;
          partner2 && ++partner2.wins;
          partner1 && ++partner1.losses;
        } else {
          player1.draws++;
          player2.draws++;
          partner1 && ++partner1.draws;
          partner2 && ++partner2.draws;
        }
      }
    });
    playerStandings.forEach(ps => {
      ps.winPct = (ps.wins + (0.5 * ps.draws)) / (ps.wins + ps.draws + ps.losses);
      ps.points = (3 * ps.wins) + ps.draws;
    });
    playerStandings.sort((a, b) => {
      if (a.points > b.points) {
        return -1;
      } else if (b.points < a.points) {
        return 1;
      } else if (a.wins > b.wins) {
        return -1;
      } else if (b.wins > a.wins) {
        return 1;
      } else if (a.gamesWon > b.gamesWon) {
        return -1;
      } else if (b.gamesWon > a.gamesWon) {
        return -1;
      } else if (a.pointsWon > b.pointsWon) {
        return -1;
      } else if (b.pointsWon > a.pointsWon) {
        return -1;
      }
      return 0;
    });
    for (let i = 0; i < playerStandings.length; i++) {
      playerStandings[i].standing = i + 1;
    }
    return Promise.all(playerStandings.map(ps => ps.save()));
  }).then(models => {
    res.json(models);
  }).catch(e => {
    console.dir(e);
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