export const calculateExpectedPointsPerMatch = (match) => {
  let expectedPerGame;

  let finishedGames = match.games.filter(g => g.finished);
  if (finishedGames.length > 0) {
    expectedPerGame = finishedGames.reduce((sum, current) => sum + (current.score1 + current.score2), 0) / finishedGames.length;
  } else {
    expectedPerGame = (match.playTo * 1.75);
  }

  if (match.playAllGames) {
    return expectedPerGame * match.bestOf;
  }

  return expectedPerGame * Math.ceil((match.bestOf + Math.ceil(match.bestOf / 2)) / 2);
};

export const getScoreHeaderLine = (match, game) => {
  if (game.score1 > game.score2) {
    let teamName = match.doubles ? `${match.player1Lname}/${match.partner1Lname}` : match.player1Lname;
    return `${game.score1}-${game.score2} (F), ${teamName}`;
  } else {
    let teamName = match.doubles ? `${match.player2Lname}/${match.partner2Lname}` : match.player2Lname;
    return `${game.score2}-${game.score1} (F), ${teamName}`;
  }
};

export const getTeamName = (match, teamNum) => {
  let player = teamNum === 1 ? match.players.find(p => p.id === match.player1Id) : match.players.find(p => p.id === match.player2Id);

  if (match.doubles) {
    let partner = teamNum === 1 ? match.players.find(p => p.id === match.partner1Id) : match.players.find(p => p.id === match.partner2Id);
    return `${player.person.lname} / ${partner.person.lname}`;
  } else {
    return player.person.fname ? `${player.person.fname} ${player.person.lname}` : player.person.lname;
  }
};

export const getFriendlyName = (match, teamNum) => {
  if (match.doubles) {
    return getTeamName(match, teamNum);
  } else {
    let player = teamNum === 1 ? match.players.find(p => p.id === match.player1Id) : match.players.find(p => p.id === match.player2Id);
    return player.person.fname ? player.person.fname : player.person.lname;
  }
};

export const getStatsForMatch = (match) => {
  let stats = {
    p1GamesWon: 0,
    p2GamesWon: 0,
    p1TotalPoints: 0,
    p2TotalPoints: 0,
    p1name: '',
    p2name: '',
    resultString: '',
    pointsWonString: '',
    winner: null
  };

  match.games.forEach(g => {
    stats.p1TotalPoints += g.score1;
    stats.p2TotalPoints += g.score2;
    stats.p1name = getFriendlyName(match, 1);
    stats.p2name = getFriendlyName(match, 2);
    if (g.score1 > g.score2) {
      stats.p1GamesWon++;
    } else {
      stats.p2GamesWon++;
    }
  });

  if (stats.p1GamesWon > stats.p2GamesWon) {
    stats.resultString = `${stats.p1name} won, ${stats.p1GamesWon}-${stats.p2GamesWon}`;
    stats.winner = match.player1Id;
  } else if (stats.p2GamesWon > stats.p1GamesWon) {
    stats.resultString = `${stats.p2name} won, ${stats.p2GamesWon}-${stats.p1GamesWon}`;
    stats.winner = match.player2Id;
  } else {
    stats.resultString = `Draw, ${stats.p2GamesWon}-${stats.p1GamesWon}`;
  }

  if (stats.p1TotalPoints > stats.p2TotalPoints) {
    stats.pointsWonString = `${stats.p1name} outscored ${stats.p2name} ${stats.p1TotalPoints}-${stats.p2TotalPoints}`;
  } else if (stats.p2TotalPoints > stats.p1TotalPoints) {
    stats.pointsWonString = `${stats.p2name} outscored ${stats.p1name} ${stats.p2TotalPoints}-${stats.p1TotalPoints}`;
  } else {
    stats.pointsWonString = `Total points were even, ${stats.p2TotalPoints}-${stats.p1TotalPoints}`;
  }

  return stats;
};