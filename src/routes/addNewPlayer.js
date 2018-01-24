import { Component } from 'preact';
import { route } from 'preact-router';
import { getFullPlayerName } from '../lib/helpers';
import * as Constants from '../lib/constants';
import Rest from '../lib/rest-service';

export default class AddNewPlayer extends Component {
  constructor(props) {
    super(props);
    this.isSubmitting = false;
    this.state = {
      playerNames: [],
      name: null,
      disableSubmit: false,
      submittedPlayer: null
    };
  }

  componentDidMount() {
    Rest.get('players').then(players => {
      this.setState({ playerNames: players.map(getFullPlayerName) });
      this.nameInput.focus();
    });
  }

  setValue = (e) => {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  };

  validate = () => {
    return new Promise((resolve, reject) => {
      if (!this.state.name) {
        return reject(Constants.NO_NAME_ENTERED);
      }

      let existingPlayer = this.state.playerNames.find(p => p.toLowerCase() === this.state.name.toLowerCase());
      if (existingPlayer) {
        return reject(Constants.NAME_ALREADY_EXISTS);
      }

      return resolve();
    });
  };

  submit = (e) => {
    e.preventDefault();
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      let playerName = this.state.name;
      this.setState({ error: null, disableSubmit: true }, () => {
        this.validate()
          .then(() => {
            return Rest.post('players', { name: playerName });
          })
          .then(p => {
            let { playerNames } = this.state;
            playerNames.push(playerName);
            this.setState({ playerNames, disableSubmit: false }, () => {
              this.isSubmitting = false;
              let { playerNum, returnRoute } = this.props;
              if (returnRoute && playerNum) {
                route(`/${returnRoute}/${playerNum}/${p.id}`);
              } else {
                this.setState({ submittedPlayer: playerName });
                setTimeout(() => this.setState({ submittedPlayer: null }), 5000);
              }
            });
          })
          .catch(e => {
            console.trace();
            this.setState({ error: e, disableSubmit: false }, () => this.isSubmitting = false);
          });
      });
    }
  };

  render() {
    return (
      <div class="main add-new-player">
        <h2>Add New Player</h2>
        <button class="dismiss-btn" onClick={() => this.props.dismiss()}>&times;</button>
        <form class="flex-1 flex-col full-width-small-screen pad-1rem" onSubmit={(e) => this.submit(e)}>
          <div class="form-group big">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" onChange={this.setValue} ref={(input) => {this.nameInput = input;}} />
          </div>
          <input class="btn big success" type="submit" disabled={this.state.disableSubmit} value="Add" />
          { this.state.error ?
            <p class="alert alert-error">{ this.state.error }</p>
            : null
          }
          { !!this.state.submittedPlayer && !this.state.error ?
            <p class="alert alert-info">Added { this.state.submittedPlayer } as a player.</p>
            : null
          }
        </form>
      </div>
    );
  }
}