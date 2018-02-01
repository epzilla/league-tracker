import { Component } from 'preact';
import { Link } from 'preact-router/match';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Rest from '../lib/rest-service';
import MatchList from '../components/MatchList';
import PingPongMatchDayGroup from '../components/PingPongMatchDayGroup';
import SoccerMatchDayGroup from '../components/SoccerMatchDayGroup';

export default class MatchDayGroup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { date, matches, sport } = this.props;
    if (date && matches && sport) {
      switch (sport.name) {
        case 'Soccer':
          return <SoccerMatchDayGroup {...this.props} />;
        default:
          return <PingPongMatchDayGroup {...this.props} />;
      }
    }
  }
}
