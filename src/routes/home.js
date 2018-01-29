import { Component } from 'preact';
import Rest from '../lib/rest-service';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';
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
    const { user } = this.props;
    if (user) {
      Rest.get(`users/${user.id}/leagues`).then(leagues => {
        this.setState({ user, leagues: leagues });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      Rest.get(`users/${nextProps.user.id}/leagues`).then(leagues => {
        this.setState({ user: nextProps.user, leagues: leagues });
      });
    }
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
