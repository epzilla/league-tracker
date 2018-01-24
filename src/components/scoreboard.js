import { getFormattedMatchDate, getStatsForMatch, getMatchTimeAgo } from '../lib/helpers';

const Scoreboard = ({ match, jumbotron }) => {
  const stats = getStatsForMatch(match);
  let footer;

  if (jumbotron && match.finished) {
    footer = (
      <div class="flex-col flex-center">
        <p class="final flex-center">Final</p>
        <p class="center">{ stats.resultString }</p>
        <p class="font-small center">{ stats.pointsWonString }</p>
      </div>
    );
  } else if (jumbotron) {
    footer = (
      <p class="time-block flex-center">
        <i class="fa fa-clock-o"></i>
        <span class="time-ago">Started { getMatchTimeAgo(match) }</span>
      </p>
    );
  } else {
    footer = (
      <div class="flex-col flex-center">
        <p class="center">{ stats.resultString }</p>
        <p class="font-small center">{ stats.pointsWonString }</p>
      </div>
    );
  }

  return (
    <div class={`scoreboard ${jumbotron ? '' : 'box-score'}`}>
      { match.finished ? <h4 class="date-time-header">{ getFormattedMatchDate(match) }</h4> : null }
      <div class="header-row flex">
        <span class="player-name"></span>
        {
          match.games.map((g, i) => {
            return (
              <span class={`score-number-box ${g.gameFinished ? 'finished' : 'current'}`}>{i + 1}</span>
            )
          })
        }
      </div>
      <div class="score-row flex">
        <span class="player-name">{ match.games[0].player1Fname } { match.games[0].player1Lname }</span>
        {
          match.games.map((g, i) => {
            return (
              <span class={`score-number-box ${g.gameFinished && g.score1 > g.score2 ? 'win' : 'loss'}`}>{ g.score1 }</span>
            )
          })
        }
      </div>
      <div class="score-row flex">
        <span class="player-name">{ match.games[0].player2Fname } { match.games[0].player2Lname }</span>
        {
          match.games.map((g, i) => {
            return (
              <span class={`score-number-box ${g.gameFinished && g.score2 > g.score1 ? 'win' : 'loss'}`}>{ g.score2 }</span>
            )
          })
        }
      </div>
      <div class="score-row stats-row flex-center">
        { footer }
      </div>
    </div>
  );
};

export default Scoreboard;