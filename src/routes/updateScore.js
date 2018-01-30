import { Component } from 'preact';
import { route } from 'preact-router';
import { SCORE_UPDATE, GAME_STARTED, GAME_FINISHED, MATCH_FINISHED } from '../lib/constants';
import { getTeamName, getScoreHeaderLine } from '../lib/helpers';
import LocalStorageService from '../lib/local-storage-service';
import Rest from '../lib/rest-service';
import WebSocketService from '../lib/websocket-service';
import Expandable from '../components/Expandable';
import GenericModal from '../components/GenericModal';
import Stepper from '../components/Stepper';
import Toggle from '../components/Toggle';

export default class UpdateScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: null,
      showConfirmEndMatch: false,
      gamesCollapsed: {}
    };
  }

  componentDidMount() {
    let match;
    WebSocketService.subscribe(SCORE_UPDATE, this.onScoreUpdateFromElsewhere);
    WebSocketService.subscribe(GAME_STARTED, this.onGameStartedElsewhere);
    WebSocketService.subscribe(MATCH_FINISHED, this.onMatchFinishedFromElsewhere);
    WebSocketService.subscribe(GAME_FINISHED, this.onGameFinishedFromElsewhere);
  }

  componentWillUnmount() {
    WebSocketService.unsubscribe(SCORE_UPDATE, this.onScoreUpdateFromElsewhere);
  }

  onScoreUpdateFromElsewhere = ({ game, scorer }) => {
    let { match } = this.state;
    let i = match.games.findIndex(g => g.gameId === game.gameId);
    if (i !== -1) {
      match.games[i] = game;
      this.setState({ match });
    }
  };

  setGameFromElsewhere = (game) => {
    let { match } = this.state;
    let i = match.games.findIndex(g => g.gameId === game.gameId);
    if (i === -1) {
      match.games.push(game);
    } else {
      match.games[i] = game;
    }

    this.setState({ match }, () => {
      if (game.gameFinished) {
        let { gamesCollapsed } = this.state;
        gamesCollapsed[game.gameId] = true;
        this.setState({ gamesCollapsed });
      }
    });
  };

  onGameStartedElsewhere = this.setGameFromElsewhere;

  onGameFinishedFromElsewhere = ({ game }) => this.setGameFromElsewhere(game);

  onMatchFinishedFromElsewhere = (m) => {
    let { match } = this.state;
    if (m.id === match.id) {
      route('/');
    }
  };

  scoreChange = (game, playerNum, { amount }) => {
    let { match, gamesCollapsed } = this.state;
    let { games } = match;
    let i = games.findIndex(g => g.gameId === game.gameId);
    if (i !== -1) {
      let checkForFinishedMatch = false;
      games[i][`score${ playerNum }`] = amount;
      if (amount >= match.playTo && (!match.winByTwo || Math.abs(games[i].score1 - games[i].score2) > 1)) {
        games[i].gameFinished = 1;
        gamesCollapsed[games[i].gameId] = true;
        checkForFinishedMatch = true;
        this.setState({ gamesCollapsed });
      }
      Rest.post('games/update', { game: games[i], scorer: playerNum }).then(() => {
        match.games = games;
        this.setState({ match }, () => {
          if (checkForFinishedMatch) {
            this.checkIfMatchFinished();
          }
        });
      });
    }
  };

  checkIfMatchFinished = () => {
    let { match } = this.state;
    let wins1 = 0;
    let wins2 = 0;
    match.games.forEach(g => {
      if (g.score1 > g.score2 && g.gameFinished) {
        wins1++;
      }
      else if (g.score2 > g.score1 && g.gameFinished) {
        wins2++;
      }
    });
    if (match.bestOf && (
      (wins1 + wins2 === match.bestOf) ||
      (wins1 > match.bestOf / 2 && !match.playAllGames) ||
      (wins2 > match.bestOf / 2 && !match.playAllGames)
    )) {
      this.confirmEndMatch();
    } else {
      this.addGame();
    }
  };

  toggleFinished = (id) => {
    const { match, gamesCollapsed } = this.state;
    let i = match.games.findIndex(g => g.gameId === id);
    if (i !== -1) {
      match.games[i].gameFinished = !match.games[i].gameFinished;
      Rest.post('games/update', { game: match.games[i] }).then(() => {
        this.setState({ match }, () => {
          if (match.games[i].gameFinished) {
            gamesCollapsed[match.games[i].gameId] = true;
            this.setState({ gamesCollapsed });
            this.checkIfMatchFinished();
          }
        });
      });
    }
  };

  toggleExpanded = (gameId) => {
    let { gamesCollapsed } = this.state;
    if (gamesCollapsed.hasOwnProperty(gameId)) {
      gamesCollapsed[gameId] = !gamesCollapsed[gameId];
      this.setState({ gamesCollapsed });
    }
  };

  addGame = () => {
    Rest.post('games/add', this.state).then(g => {
      let { match, gamesCollapsed } = this.state;
      match.games.push(g);
      gamesCollapsed[g.gameId] = false;
      this.setState({ match, gamesCollapsed });
    });
  };

  confirmEndMatch = () => {
    this.setState({ showConfirmEndMatch: true });
  };

  endMatch = () => {
    let { match } = this.state;
    match.finished = 1;
    Rest.post('matches/finish', { match}).then(() => {
      let matchIds = LocalStorageService.get('match-ids');
      if (matchIds) {
        let i = matchIds.indexOf(match.id);
        if (i !== -1) {
          matchIds.splice(i, 1);
          LocalStorageService.set('match-ids', matchIds);
        }
      }
      route(`/match-summary/${match.id}`);
    });
  };

  dismissEndMatchModal = () => {
    this.setState({ showConfirmEndMatch: false });
  };

  render() {
    const { match, showConfirmEndMatch } = this.state;
    let games;
    if (match) {
        games = match.games.map((g, i) => {
          let title = `Game ${i + 1}`;
          if (g.gameFinished) {
            title += ` — ${getScoreHeaderLine(match, g)}`;
          }

          return (
            <li>
              <Expandable title={title} collapsed={ this.state.gamesCollapsed[g.gameId] } id={g.gameId} toggle={(id) => this.toggleExpanded(id)}>
                <div class="game-update-row">
                  <div class="flex-col flex-center">
                    <h4>{ getTeamName(match, 1) }</h4>
                    <Stepper full min={0} onChange={(e) => this.scoreChange(g, 1, e)} initialValue={g.score1}/>
                  </div>
                  <div class="flex-col flex-justify-end">
                    <div class="stepper-separator">
                      <h4 class="vs-symbol align-center">vs</h4>
                    </div>
                  </div>
                  <div class="flex-col flex-center">
                    <h4>{ getTeamName(match, 2) }</h4>
                    <Stepper full min={0} onChange={(e) => this.scoreChange(g, 2, e)} initialValue={g.score2}/>
                  </div>
                </div>
                <div class="flex final-score-toggle">
                  <label>Final?</label>
                  <Toggle id={`game-${i}-finished`} toggled={this.toggleFinished} onOff={g.gameFinished} property={g.gameId} />
                </div>
              </Expandable>
            </li>
          );
      });
    }

    return (
      <div class="main update-score">
        <h2 class="align-center">Update Score</h2>
        <p class="match-update-info">
          { match ? <i class="fa fa-info-circle"></i> : null }
          { match ? <span>Playing to { match.playTo }, { match.playAllGames ? 'total of' : 'best of' } { match.bestOf } games.</span> : null }
        </p>
        <ul class="games-list select-list">
          { games }
        </ul>
        <button class="btn big success" onClick={this.confirmEndMatch}>
          <i class="fa fa-check"></i>
          <span>End Match</span>
        </button>
        <GenericModal
          header="Confirm End Match"
          show={showConfirmEndMatch}
          content="Are you sure you want to end this match?"
          confirmText="Yep! It's Over, son!"
          cancelText="Oops! No."
          confirm={this.endMatch}
          dismiss={this.dismissEndMatchModal}
        />
      </div>
    );
  }
}