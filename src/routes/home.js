import { Component } from 'preact';
import Rest from '../lib/rest-service';
import { Link } from 'preact-router/match';
import LocalStorageService from '../lib/local-storage-service';
import WebSocketService from '../lib/websocket-service';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      leagues: []
    };
  }

  componentDidMount() {
    // Fake a rest call for now
    Rest.get(`users/${this.props.user.id}`).then(user => {
      this.setState({ user, leagues: user.leagues });
    });
  }

  render() {
    return (
      <div class="main home">
        {
          this.state.leagues ?
          <section class="my-leagues">
            <h2>My Leagues</h2>
            { this.state.leagues.map(league => <Link href={`/leagues/${league.id}`}>{ league.name }</Link>) }
          </section>
          : null
        }
      </div>
    );
  }
}
