import { Component } from 'preact';
import { Link } from 'preact-router/match';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Rest from '../lib/rest-service';

export default class MatchDayGroup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { date, matches } = this.props;
    if (date && matches) {
      return (
        <div class="match-day-group">
          <h4>{ format(parse(date), 'M/D') }</h4>
          <ul>
            {
              matches.map(m => {
                let player1 = m.players.find(p => p.id === m.player1Id);
                let player2 = m.players.find(p => p.id === m.player2Id);
                return <pre>{ player1.person.fname } { player2.person.fname }</pre>
              })
            }
          </ul>
        </div>
      );
    }
  }
}