import { Component } from 'preact';
import Rest from '../lib/rest-service';
import { Link } from 'preact-router/match';
import { NEW_MATCH_PERMISSION_GRANTED, MATCH_STARTED, MATCH_FINISHED } from '../lib/constants';
import LiveScoreboard from '../components/liveScoreboard';
import BoxScore from '../components/boxScore';
import LocalStorageService from '../lib/local-storage-service';
import WebSocketService from '../lib/websocket-service';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      recentMatches: [],
      currentMatch: null,
      canUpdateScore: false,
      matchInProgress: false
    };
  }

  componentDidMount() {
    WebSocketService.subscribe(MATCH_STARTED, this.onMatchStart);
    WebSocketService.subscribe(MATCH_FINISHED, this.onMatchFinish);
    Rest.get('players').then(players => this.setState({ players }));
    this.getMostRecent();
  }

  componentWillReceiveProps({ updatableMatchIds }) {
    if (updatableMatchIds && updatableMatchIds.length > 0) {
      this.checkCanUpdate(updatableMatchIds)
    }
  }

  componentWillUnmount() {
    WebSocketService.unsubscribe(MATCH_STARTED, this.onMatchStart);
    WebSocketService.unsubscribe(MATCH_FINISHED, this.onMatchFinish);
  }

  getMostRecent = () => {
    Rest.get('matches/most-recent/5').then(matches => {
      if (matches.length > 0) {
        let currentMatch = matches.shift();
        this.setState({
          currentMatch: currentMatch,
          recentMatches: matches,
          matchInProgress: !currentMatch.finished
        }, this.checkCanUpdate);
      }
    });
  };

  onMatchStart = (match) => {
    let { recentMatches, currentMatch, matchInProgress } = this.state;
    if (currentMatch) {
      recentMatches.unshift(Object.assign({}, currentMatch));
    }
    currentMatch = match;
    matchInProgress = true;
    this.setState({ recentMatches, currentMatch, matchInProgress });
  };

  onMatchFinish = (match) => {
    // Wait for the live scoreboard to show the final score, do any animations/etc.
    setTimeout(() => {
      this.getMostRecent();
    }, 10000);
  };

  checkCanUpdate = (matchIds) => {
    if (matchIds || this.state.matchInProgress) {
      Rest.get(`matches/can-update-score/${this.props.device.id}`).then(canUpdateScore => {
        let showNewPermission = matchIds && !this.state.canUpdateScore && canUpdateScore && this.props.postAlert;
        this.setState({ canUpdateScore, matchInProgress: true }, () => {
          if (showNewPermission) {
            this.props.postAlert({ type: 'info', msg: NEW_MATCH_PERMISSION_GRANTED });
          }
        });
      });
    }
  };

  render() {
    let { matchInProgress, currentMatch, recentMatches, canUpdateScore } = this.state;
    let matchStatus = matchInProgress ? 'Match in Progress' : 'Latest Match';
    return (
      <div class="main home">
        { currentMatch ? <h2 class="align-center primary-text">{ matchStatus }</h2> : null }
        { currentMatch ? <LiveScoreboard match={ currentMatch } /> : null }
        { !matchInProgress && this.props.device ? <Link href="/new-match" class="btn big primary center margin-top-1rem">Start New Match</Link> : null }
        { matchInProgress && canUpdateScore ? <Link href="/update-score" class="btn big success update-score">Update Score</Link> : null }
        { recentMatches && recentMatches.length > 0 ? <hr /> : null }
        { recentMatches && recentMatches.length > 0 ? <h3 class="align-center primary-text">Recent Matches</h3> : null }
        { recentMatches && recentMatches.length > 0 ? recentMatches.map(rm => <BoxScore match={rm} />) : null }
      </div>
    );
  }
}
