import { Component } from 'preact';
import CSSTransitionGroup from 'preact-css-transition-group';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { groupBy, orderBy } from '../lib/helpers';
import LocalStorageService from '../lib/local-storage-service';
import Rest from '../lib/rest-service';
import ScheduleList from '../components/Expandable';
import MatchDayGroup from '../components/MatchDayGroup';

export default class LeagueSchedule extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Rest.get(`leagues/${this.props.leagueSlug}`).then(({ sport }) => {
      this.setState({ sport });
    });
    Rest.get(`matches/all/${this.props.leagueSlug}`).then(matches => {
      const groupedMatches = groupBy(matches, m => format(m.startTime, 'YYYY/M/D'));
      // matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      const groupedKeys = orderBy(Object.keys(groupedMatches), k => parse(k).getTime());
      console.log(groupedMatches);
      console.log(groupedKeys);
      this.setState({ groupedMatches, groupedKeys });
    });
  }

  render() {
    return (
      <div class="league-schedule">
        { this.state.groupedKeys ?
          this.state.groupedKeys.map(key => <MatchDayGroup date={key} sport={this.state.sport} matches={this.state.groupedMatches[key]} />)
          : null
        }
      </div>
    );
  }
}
