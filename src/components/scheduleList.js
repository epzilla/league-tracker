import { Component } from 'preact';
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
    return (
      <div class="league-standings">
        <div class="match-list">
          <h3 class="align-center">Schedule</h3>
          { this.state.matches.length > 0 ? <MatchList upcoming matches={this.state.matches} sport={this.props.league.sport} /> : null }
        </div>
      </div>
    );
  }
}
