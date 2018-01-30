import { Component } from 'preact';
import { Link } from 'preact-router/match';
import { NEW_MATCH_PERMISSION_GRANTED, MATCH_STARTED, MATCH_FINISHED } from '../lib/constants';
import LocalStorageService from '../lib/local-storage-service';
import Rest from '../lib/rest-service';
import WebSocketService from '../lib/websocket-service';
import LeagueStandings from '../components/LeagueStandings';
import MatchList from '../components/MatchList';
import ScheduleList from '../components/ScheduleList';
import SegmentedControl from '../components/SegmentedControl';

export default class LeagueHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: null,
      recentMatches: [],
      standings: [],
      liveMatches: [],
      tab: 0
    };
  }

  componentDidMount() {
    WebSocketService.subscribe(MATCH_STARTED, this.onMatchStart);
    WebSocketService.subscribe(MATCH_FINISHED, this.onMatchFinish);
    Rest.get('users/me').then(user => this.setState({ user }));
    Rest.get(`leagues/${this.props.leagueSlug}`).then(league => {
      this.setState({ league }, () => {
        this.getMostRecent();
        this.getLive();
        this.getStandings();
        if (this.props.setLeague) {
          this.props.setLeague(league);
        }
        });
    });
  }

  componentWillUnmount() {
    this.props.setLeague(null);
    WebSocketService.unsubscribe(MATCH_STARTED, this.onMatchStart);
    WebSocketService.unsubscribe(MATCH_FINISHED, this.onMatchFinish);
  }

  getLeagueInfo = () => {
    return Rest.get(`leagues/${this.props.leagueSlug}`).then(league => {
      this.setState({ league });
      return league;
    });
  };

  getStandings = () => {
    Rest.get(`standings/${this.props.leagueSlug}`).then(standings => this.setState({ standings }));
  };

  getMostRecent = () => {
    Rest.get(`matches/recent/${this.state.league.sport.id}/${this.props.leagueSlug}`).then(recentMatches => this.setState({ recentMatches }));
  };

  getLive = () => {
    Rest.get(`matches/live/${this.state.league.sport.id}/${this.props.leagueSlug}`).then(liveMatches => this.setState({ liveMatches }));
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

  toggleTab = (e) => {
    this.setState({ tab: e });
  };

  render() {
    let { liveMatches, recentMatches, league, user, standings } = this.state;
    return (
      <article class="main home league-home">
        {/* user ? <h3>Admin privileges!</h3> : null */}
        <section class="league-home-tabs">
          <SegmentedControl
            options={[
              { label: 'Standings', value: 0 },
              { label: 'Scores', value: 1 }
            ]}
            value={this.state.tab}
            onChange={(e) => this.toggleTab(e)}
          />
        </section>
        <section class="league-home-col league-left-sidebar">
          { liveMatches && liveMatches.length > 0 ? <MatchList live matches={liveMatches} /> : null }
          { recentMatches && recentMatches.length > 0 ? <MatchList recent matches={recentMatches} /> : null }
        </section>
        <section class={`league-home-col league-main ${this.state.tab === 0 ? 'show' : 'hide'}`}>
          <LeagueStandings league={league} standings={standings} />
        </section>
        <section class={`league-home-col hide-large league-main ${this.state.tab === 1 ? 'show' : 'hide'}`}>
          { liveMatches && liveMatches.length > 0 ? <MatchList live matches={liveMatches} /> : null }
          { recentMatches && recentMatches.length > 0 ? <MatchList recent matches={recentMatches} /> : null }
          <ScheduleList league={league} upcoming={true} />
        </section>
        <section class="league-home-col league-right-sidebar">
          <ScheduleList league={league} upcoming={true} />
        </section>
      </article>
    );
  }
}
