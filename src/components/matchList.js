import { Component } from 'preact';
import BoxScore from './boxScore';

export default class MatchList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { matches, sport } = this.props;
    return (
      <div class="match-list">
        { this.props.live ? <h3 class="align-center live">Live</h3> : null }
        { this.props.recent ? <h3 class="align-center recent">Recent</h3> : null }
        <ul class="recent-match-list">
          { matches.map(m => <li><BoxScore match={m} sport={sport} /></li>) }
        </ul>
      </div>
    );
  }
}
