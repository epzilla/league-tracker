import { Component } from 'preact';
import { Link } from 'preact-router/match';
import Rest from '../lib/rest-service';
import MatchList from '../components/MatchList';

export default class ScheduleList extends Component {
  constructor(props) {
    super(props);
    this.state = { matches: [] };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.league) {
      let { sport, slug } = nextProps.league;
      Rest.get(`matches/upcoming/${sport.id}/${slug}`).then(matches => {
        this.setState({ matches });
      });
    }
  }

  render() {
    let { user, league } = this.props;

    return (
      <div class="league-standings">
        <div class="schedule-list match-list">
          <header class="flex-center">
            <h3 class="flex-1 flex-center">Schedule</h3>
            { league && <Link href={`/leagues/${league.slug}/schedule`} class="edit-link abs-right">View</Link> }
          </header>
          { this.state.matches.length > 0 ? <MatchList upcoming matches={this.state.matches} sport={this.props.league.sport} /> : null }
        </div>
      </div>
    );
  }
}
