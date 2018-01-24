import { Component } from 'preact';
import Rest from '../lib/rest-service';
import BoxScore from '../components/boxScore';

export default class MatchSummary extends Component {
  constructor(props) {
    super(props);
    this.state = { match: null };
  }

  componentDidMount() {
    Rest.get(`matches/${this.props.id}`).then(match => {
      if (match && match.games && match.games.length > 0) {
        match.player1Fname = match.games[0].player1Fname;
        match.player1Lname = match.games[0].player1Lname;
        match.player2Fname = match.games[0].player2Fname;
        match.player2Lname = match.games[0].player2Lname;
        this.setState({ match });
      }
    });
  }

  render() {
    return (
      <div class="main match-summary">
        <h2 class="align-center primary-text">Match Summary</h2>
        { this.state.match ? <BoxScore jumbotron={true} match={ this.state.match } /> : null }
      </div>
    );
  }
}
