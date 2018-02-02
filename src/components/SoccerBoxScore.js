import { getFormattedMatchDate, getMatchTimeAgo } from '../lib/helpers';
import { getStatsForMatch } from '../lib/soccerHelpers';

const getHourGlassIcon = (match, currentGame) => {
  let game = match.games[currentGame];
  let previousPoints = match.games.filter(g => g.finished).reduce((sum, current) => sum + (current.score1 + current.score2), 0) || 0;
  let totalPoints = previousPoints + (game ? (game.score1 + game.score2) : 0);
  let expectedTotalPoints = calculateExpectedPointsPerMatch(match);
  let pct = totalPoints / expectedTotalPoints;
  if (pct < 0.25) {
    return 'start';
  } else if (pct < 0.8) {
    return 'half';
  }

  return 'end';
};

const shouldFlashScore = (scoreFlash, match, teamNum) => {
  if (scoreFlash) {
    let playerIds;
    if (teamNum === 1 && match.team1Id === scoreFlash.scorer) {
      return true;
    } else if (teamNum === 2 && match.team2Id === scoreFlash.scorer) {
      return true;
    }
  }

  return false;
};

const getClassesForScoreBox = (match, scoreFlash, teamNum) => {
  let classes = 'score-number-box';
  if (match.finished) {
    if ((match.score1 > match.score2 && teamNum === 1) || (match.score2 > match.score1 && teamNum === 2)) {
      classes += ' win';
    } else {
      classes += ' loss';
    }
  }

  if (scoreFlash && shouldFlashScore(scoreFlash, match, teamNum)) {
    classes += ' flash';
  }

  return classes;
};

const SoccerBoxScore = ({ match, jumbotron, scoreFlash, mini, matchFlash }) => {
  const stats = match.finished ? getStatsForMatch(match) : null;
  let footer;
  let classes = 'scoreboard soccer ';
  if (mini) {
    classes += ' mini';
  }

  if (!jumbotron) {
    classes += ' box-score';
  } else if (matchFlash) {
    classes += ' flash-final';
  }

  if (!match.started && !match.finished) {
    classes += ' future-match';
    return (
      <div class={classes}>
        <div class="score-row flex">
          <div class="flex-col">
            <span class="player-name">{ match.team1.short_name }</span>
            <span class="player-name">{ match.team2.short_name }</span>
          </div>
          <div class="flex-col flex-pull-right flex-center">
            <h4 class="date-time-header">{ getFormattedMatchDate(match) }</h4>
          </div>
        </div>
      </div>
    );
  }

  if (jumbotron && match.finished) {
    footer = (
      <div class="flex-col flex-center">
        <p class="final flex-center">Final</p>
      </div>
    );
  } else if (jumbotron) {
    footer = (
      <p class="flex-col">
        <p class="match-info-block">
          <i class="fa fa-clock-o"></i>
          <span class="match-info">Started { getMatchTimeAgo(match) }</span>
        </p>
      </p>
    );
  }

  return (
    <div class={classes}>
      { match.finished ? <h4 class="date-time-header">{ getFormattedMatchDate(match) }</h4> : null }
      <div class="score-row flex">
        <span class={`player-name ${match.winner === 1 ? 'winner' : ''}`}>{ match.team1.short_name }</span>
        <span class={ getClassesForScoreBox(match, scoreFlash, 1) }>{ match.score1 }</span>
      </div>
      <div class="score-row flex">
        <span class={`player-name ${match.winner === 2 ? 'winner' : ''}`}>{ match.team2.short_name }</span>
        <span class={ getClassesForScoreBox(match, scoreFlash, 2) }>{ match.score2 }</span>
      </div>
      <div class="score-row stats-row flex-center">
        { footer }
      </div>
    </div>
  );
};

export default SoccerBoxScore;