import { Component } from 'preact';
import { SCORE_UPDATE, GAME_FINISHED, GAME_STARTED, MATCH_FINISHED } from '../lib/constants';
import WebSocketService from '../lib/websocket-service';
import BoxScore from './boxScore';

export default class LiveScoreboard extends Component {
  constructor(props) {
    super(props);
    this.state = { match: props.match, scoreFlash: null, gameFlash: false, matchFlash: false };
  }

  componentDidMount() {
    WebSocketService.subscribe(SCORE_UPDATE, this.onScoreUpdate);
    WebSocketService.subscribe(GAME_STARTED, this.onGameStart);
    WebSocketService.subscribe(GAME_FINISHED, this.onGameFinish);
    WebSocketService.subscribe(MATCH_FINISHED, this.onMatchFinish);
  }

  componentWillUnmount() {
    WebSocketService.unsubscribe(SCORE_UPDATE, this.onScoreUpdate);
    WebSocketService.unsubscribe(GAME_STARTED, this.onGameStart);
    WebSocketService.unsubscribe(GAME_FINISHED, this.onGameFinish);
    WebSocketService.unsubscribe(MATCH_FINISHED, this.onMatchFinish);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match) {
      this.setState({ match: nextProps.match });
    }
  }

  onScoreUpdate = ({ game, scorer }) => {
    let { match } = this.state;
    let i = match.games.findIndex(g => g.gameId === game.gameId);
    if (i !== -1) {
      match.games[i] = game;
      if (this.scoreFlashTimeout) {
        clearTimeout(this.scoreFlashTimeout);
      }

      this.setState({ match, scoreFlash: {game: i, scorer: scorer} }, () => {
        setTimeout(() => {
          this.scoreFlashTimeout = this.setState({ scoreFlash: null });
        }, 5000);
      });
    }
  };

  onGameStart = (game) => {
    let { match } = this.state;
    let i = match.games.findIndex(g => g.gameId === game.gameId);
    if (i === -1) {
      match.games.push(game);
      this.setState({ match });
    }
  };

  onGameFinish = ({ game }) => {
    let { match } = this.state;
    let i = match.games.findIndex(g => g.gameId === game.gameId);
    if (i !== -1) {
      match.games[i] = game;
      this.setState({ match, gameFlash: i, scoreFlash: null }, () => {
        this.gameFlashTimeout = setTimeout(() => {
          this.setState({ gameFlash: null });
        }, 5000);
      });
    }
  };

  onMatchFinish = (match) => {
    this.setState({ match, matchFlash: true }, () => {
      setTimeout(() => {
        this.matchFlashTimeout = this.setState({ matchFlash: null });
      }, 5000);
    });
  };

  render() {
    return <BoxScore jumbotron={true} {...this.state} />
  }
}
