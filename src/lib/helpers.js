import parse from 'date-fns/parse';
import isThisYear from 'date-fns/is_this_year';
import differenceInDays from 'date-fns/difference_in_days'
import distanceInWords from 'date-fns/distance_in_words'
import format from 'date-fns/format';
import { DEVICE_TYPES } from './constants';

export const lightenOrDarken = (col, amt) => {
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    let num = parseInt(col, 16);
    let red = (num >> 16) + amt;
    if (red > 255) {
      red = 255;
    } else if (red < 0) {
      red = 0;
    }

    let blue = ((num >> 8) & 0x00FF) + amt;
    if (blue > 255) {
      blue = 255;
    } else if (blue < 0) {
      blue = 0;
    }

    let green = (num & 0x0000FF) + amt;
    if (green > 255) {
      green = 255;
    } else if (green < 0) {
      green = 0;
    }

    return (usePound?"#":"") + String("000000" + (green | (blue << 8) | (red << 16)).toString(16)).slice(-6);
};

export const getFormattedMatchDate = (game) => {
  let date = parse(game.finishTime);
  let now = new Date();

  if (differenceInDays(now, date) < 7) {
    return `${format(date, 'dddd')} at ${format(date, 'h:mm')}`;
  }

  if (isThisYear(date)) {
    return format(date, 'M/D');
  }

  return format(date, 'M/D/YY');
};

export const getMatchTimeAgo = (match) => {
  return distanceInWords(new Date(), parse(match.startTime), { includeSeconds: true, addSuffix: true });
};

export const getTeamName = (match, teamNum) => {
  if (match.doubles && teamNum === 1) {
    return `${match.player1Lname} / ${match.partner1Lname}`;
  } else if (match.doubles && teamNum === 2) {
    return `${match.player2Lname} / ${match.partner2Lname}`;
  } else {
    return match[`player${teamNum}Fname`] + ' ' + match[`player${teamNum}Lname`];
  }
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
    stats.p1name = match.doubles ? `${g.player1Lname} / ${g.partner1Lname}` : g.player1Fname;
    stats.p2name = match.doubles ? `${g.player2Lname} / ${g.partner2Lname}` : g.player2Fname;
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

export const getFullPlayerName = (p) => {
  let name = '';

  if (p.fname) {
    name += p.fname;
  }

  if (p.middleInitial) {
    if (name.trim().length > 0) {
      name += ` ${p.middleInitial}`;
    } else {
      name += p.middleInitial;
    }
  }

  if (p.lname) {
    if (name.trim().length > 0) {
      name += ` ${p.lname}`;
    } else {
      name += p.lname;
    }
  }

  console.log(name);
  return name;
};

export const getBestGuessDevice = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const greaterDimension = height >= width ? height : width;
  const lesserDimension = greaterDimension === height ? width: height;
  const hiDpi = window.matchMedia('(min-resolution: 120dpi)').matches || window.matchMedia('(-webkit-min-device-pixel-ratio: 1.3)').matches;

  if (greaterDimension < 800) {
    return DEVICE_TYPES.MOBILE_DEVICE;
  } else if (greaterDimension < 1200 && lesserDimension < 800) {
    return DEVICE_TYPES.TABLET_DEVICE;
  } else if (greaterDimension < 1800 && lesserDimension >= 800 || greaterDimension < 2400 && hiDpi) {
    return DEVICE_TYPES.LAPTOP_DEVICE
  } else if (greaterDimension > 1800) {
    return DEVICE_TYPES.DESKTOP_DEVICE
  }

  return DEVICE_TYPES.OTHER_DEVICE;
};

export const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
};