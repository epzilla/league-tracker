import { Component } from 'preact';
import { Link } from 'preact-router/match';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Rest from '../lib/rest-service';

export default class SoccerMatchDayGroup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { date, matches, sport } = this.props;
    return (
      <div class="match-day-group">
        <h4>{ format(parse(date), 'M/D') }</h4>
        <ul>
          {
            matches.map(m => {
              return <pre>{ m.team1.title } { m.team2.title }</pre>
            })
          }
        </ul>
      </div>
    );
  }
}