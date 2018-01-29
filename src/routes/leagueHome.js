import { Component } from 'preact';
import Rest from '../lib/rest-service';
import { Link } from 'preact-router/match';
import { NEW_MATCH_PERMISSION_GRANTED, MATCH_STARTED, MATCH_FINISHED } from '../lib/constants';
import LeagueStandings from '../components/leagueStandings';
import ScheduleList from '../components/scheduleList';
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
      this.getMostRecent();
      this.getLive();
      // this.getStandings();
      if (this.props.setLeague) {
        this.props.setLeague(league);
      }
    })
  }

  componentWillUnmount() {
    this.props.setLeague(null);
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
    let { liveMatches, recentMatches, league } = this.state;
    return (
      <article class="main home league-home">
        <section class="league-left-sidebar">
          { liveMatches && liveMatches.length > 0 ?
            <div class="match-list">
              <h3 class="align-center live">Live</h3>
              <ul class="recent-match-list">
                { liveMatches.map(rm => <li><BoxScore match={rm} sport={this.props.sport} /></li>) }
              </ul>
            </div>
            : null
          }
          { recentMatches && recentMatches.length > 0 ?
            <div class="match-list">
              <h3 class="align-center">Recent</h3>
              <ul class="recent-match-list">
                { recentMatches.map(rm => <li><BoxScore match={rm} sport={this.props.sport} /></li>) }
              </ul>
            </div>
            : null
          }
        </section>
        <section class="league-main">
          <LeagueStandings league={league} />
        </section>
        <section class="league-right-sidebar">
          <ScheduleList league={league} upcoming={true} />
        </section>
      </article>
    );
  }
}
