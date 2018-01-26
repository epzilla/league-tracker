import { Component } from 'preact';
import Rest from '../lib/rest-service';
import { Link } from 'preact-router/match';
import { NEW_MATCH_PERMISSION_GRANTED, MATCH_STARTED, MATCH_FINISHED } from '../lib/constants';
import LiveScoreboard from '../components/liveScoreboard';
import BoxScore from '../components/boxScore';
import LocalStorageService from '../lib/local-storage-service';
import WebSocketService from '../lib/websocket-service';

export default class LeagueHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: null,
      recentMatches: [],
      standings: [],
      liveMatches: []
    };
  }

  componentDidMount() {
    WebSocketService.subscribe(MATCH_STARTED, this.onMatchStart);
    WebSocketService.subscribe(MATCH_FINISHED, this.onMatchFinish);
    this.getLeagueInfo().then(league => {
      this.setState({ league }, () => {
        this.getMostRecent();
        // this.getLive();
        this.getStandings();
      });
    })
  }

  componentWillUnmount() {
    WebSocketService.unsubscribe(MATCH_STARTED, this.onMatchStart);
    WebSocketService.unsubscribe(MATCH_FINISHED, this.onMatchFinish);
  }

  getLeagueInfo = () => {
    return Rest.get(`leagues/${this.props.leagueId}`).then(league => {
      this.setState({ league });
      return league;
    });
  };

  getStandings = () => {
    Rest.get(`standings/${this.props.leagueId}`).then(standings => this.setState({ standings }));
  };

  getMostRecent = () => {
    Rest.get(`matches/recent/${this.state.league.sport.id}/${this.props.leagueId}`).then(recentMatches => this.setState({ recentMatches }));
  };

  getLive = () => {
    Rest.get(`matches/live/${this.state.league.sport.id}/${this.props.leagueId}`).then(liveMatches => this.setState({ liveMatches }));
  };

  onMatchStart = (match) => {
    let { liveMatches } = this.state;
    liveMatches.unshift(match);
    this.setState({ liveMatches });
  };

  onMatchFinish = (match) => {
    // Wait for the live scoreboard to show the final score, do any animations/etc.
    setTimeout(() => {
      this.getMostRecent();
      this.getLive();
    }, 10000);
  };

  render() {
    let { liveMatches, recentMatches } = this.state;
    return (
      <div class="main home league-home">
        { recentMatches && recentMatches.length > 0 ?
          <div class="recent-matches">
            <h3 class="align-center primary-text">Recent Matches</h3>
            <ul class="recent-match-list">
              { recentMatches.map(rm => <li><BoxScore match={rm} sport={this.props.sport} /></li>) }
            </ul>
          </div>
          : null
        }
        { liveMatches && liveMatches.length > 0 ?
          liveMatches.map(lm => <LiveScoreboard match={ lm } sport={this.props.sport} />)
          : null
        }
      </div>
    );
  }
}
