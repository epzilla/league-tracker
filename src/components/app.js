import { h, Component } from 'preact';
import { route, Router } from 'preact-router';

import Config from '../config';
import Header from './header';
import Home from '../routes/home';
import Stats from '../routes/stats';
import StartMatch from '../routes/startMatch';
import AddNewPlayer from '../routes/addNewPlayer';
import UpdateScore from '../routes/updateScore';
import SetDevice from '../routes/setDevice';
import MatchSummary from '../routes/matchSummary';
import DebugConsole from './debugConsole';
import NotSoSecretCode from './notSoSecretCode';
import GlobalKeyboardShortcuts from './globalKeyboardShortcuts';
import KeyboardShortcutHelp from './keyboardShortcutHelp';
import FixedAlerts from './fixedAlerts';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';
import WebSocketService from '../lib/websocket-service';
import { lightenOrDarken, generateGuid } from '../lib/helpers';
import * as Constants from '../lib/constants';

export default class App extends Component {
	constructor(props) {
    super(props);
    this.ls = LocalStorageService;
    this.config = Config;
    this.state = {
      menu: false,
      kb: false,
      debugConsole: true,
      device: null,
      updatableMatchIds: null,
      alerts: []
    };
    let conf = this.ls.get('config');
    this.config = Config || conf;
    if (Config && JSON.stringify(conf) !== JSON.stringify(Config)) {
      this.ls.set('config', Config);
    }

    if (this.config.devMode) {
      this.canReset = false;
    }

    if (this.config.useGiphy) {
      Rest.getExternal(`https://api.giphy.com/v1/gifs/search?api_key=${this.config.giphyAPIkey}&q=ping pong&limit=10&offset=${Math.random() * 200}&rating=PG-13&lang=en`)
        .then(result => {
          if (result && result.data) {
            this.config.highlightImages.portrait = result.data.slice(0, 5).map(d => d.images.downsized_medium.url);
            this.config.highlightImages.landscape = result.data.slice(5, 10).map(d => d.images.downsized_medium.url);
          }
        });
    }
  }

  componentDidMount() {
    // Set CSS Custom Properties
    if (this.config && this.config.themeProperties) {
      Object.keys(this.config.themeProperties).forEach(key => {
        document.body.style.setProperty(`--${key}`, this.config.themeProperties[key]);
      });
      let pbg = this.config.themeProperties.primaryBtnBg;
      let sbg = this.config.themeProperties.secondaryBtnBg;
      document.body.style.setProperty('--primaryBtnBorder', pbg ? lightenOrDarken(pbg, -40) : '#888');
      document.body.style.setProperty('--secondaryBtnBorder', sbg ? lightenOrDarken(sbg, -40) : '#888');
    }

    let device = this.ls.get('device');
    if (device) {
      this.setState({ device });
      this.initWebSockets(device.id);
    } else {
      route('/set-device');
    }
  }

	/**
	 *  Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
    this.currentUrl = e.url;
    this.menuToggledCallback(false);
  };

  onDeviceSet = device => {
    let { alerts } = this.state;
    alerts.push({ type: 'success', msg: `Registered ${device.name}!`});
    this.setState({ device, alerts }, () => {
      route('/');
      this.initWebSockets(device.id);
      setTimeout(() => this.setState({ alerts: [] }), 5000);
    })
  };

	menuToggledCallback = (menu) => {
    this.setState({ menu });
  };

  showKeyboardShortcuts = () => {
    this.setState({ kb: true });
  };

  hideKeyboardShortcuts = () => {
    this.setState({ kb: false });
  };

  toggleKeyboardShortcuts = () => {
    this.setState({ kb: !this.state.kb });
  };

  escapeKeyCallback = () => {
    if (this.state.kb) {
      this.hideKeyboardShortcuts();
    }
  };

  hideDebugConsole = () => {
    this.setState({ debugConsole: false });
  };

  showDebugConsole = () => {
    this.setState({ debugConsole: true });
  };

  // Passed as a prop to children to let them post alerts
  postAlert = (alert, duration) => {
    let { alerts } = this.state;
    alert.id = generateGuid();
    alerts.push(alert);
    this.setState({ alerts }, () => {
      setTimeout(() => {
        alerts = this.state.alerts;
        alerts.splice(alerts.indexOf(alert), 1);
        this.setState({ alerts });
      }, duration || 5000);
    });
  };

  onMatchStart = (match) => {
    if (this.currentUrl !== '/' && this.currentUrl.indexOf('new-match') === -1) {
      this.postAlert({ type: Constants.MATCH_STARTED, msg: match }, 10000);
    }
  };

  onAddedDevicesToMatch = ({ match, deviceIds }) => {
    if (this.state.device) {
      let i = deviceIds.indexOf(this.state.device.id);
      if (i !== -1) {
        let matchIds = LocalStorageService.get('match-ids');
        if (!matchIds || matchIds.length === 0) {
          matchIds = [match.id];
        } else {
          matchIds.push(match.id);
        }
        LocalStorageService.set('match-ids', matchIds);
        this.setState({ updatableMatchIds: matchIds });
      }
    }
  };

  initWebSockets = (deviceId) => {
    WebSocketService.init(deviceId, this.config.devMode).then(() => {
      WebSocketService.subscribe(Constants.ADDED_DEVICES_TO_MATCH, this.onAddedDevicesToMatch);
      WebSocketService.subscribe(Constants.MATCH_STARTED, this.onMatchStart);
    });
  };

  resetApp = () => {
    this.canReset = true;
  };

  resetAppAfterCode = () => {
    if (this.canReset) {
      LocalStorageService.deleteAll();
      Rest.del('reset-all').then(() => {
        window.location.assign('/');
      });
    }
  };

  dismissAlert = (i) => {
    let { alerts } = this.state;
    alerts.splice(i, 1);
    this.setState({ alerts });
  };

  testAlerts = () => {
    this.postAlert({ type: 'success', msg: `This is a very long alert. You know, it's always a good idea to test things using absurdly long strings. Why, one time, my cousing who is a Software Developer failed to do so, and then he got fired when something looked like crap. So yeah, totally do that, bruh.`}, 999999999);
    this.postAlert({ type: 'info', msg: 'Short one'}, 999999999);
    this.postAlert({ type: 'warning', msg: `Hey! cut that out. I'm watchin' you...`}, 999999999);
    this.postAlert({ type: 'error', msg: `Oh boy, now you've done it! What did I tell you, man???`}, 999999999);
  };

	render() {
		return (
			<div id="app">
				<Header
					config={this.config}
          menu={this.state.menu}
					menuToggledCallback={(e) => this.menuToggledCallback(e)}
					showKeyboardShortcuts={() => this.showKeyboardShortcuts()}
				/>
				<Router onChange={this.handleRoute}>
					<Home path="/" config={this.config} device={this.state.device} postAlert={this.postAlert} updatableMatchIds={this.state.updatableMatchIds} />
          <Stats path="/stats" config={this.config} />
          <StartMatch path="/new-match/:num?/:addedPlayer?" config={this.config} device={this.state.device} />
          <UpdateScore path="/update-score" config={this.config} device={this.state.device} postAlert={this.postAlert} updatableMatchIds={this.state.updatableMatchIds} />
          <AddNewPlayer path="/add-new-player/:returnRoute?/:playerNum?" config={this.config} />
          <SetDevice path="/set-device" config={this.config} callback={this.onDeviceSet} />
          <MatchSummary path="/match-summary/:id" config={this.config} />
				</Router>
        {/*
          (this.config.devMode && !this.state.debugConsole) ?
          <div class="debug-mode-btn-container" onClick={() => this.showDebugConsole()}>
              <i class="fa fa-bug"></i>
          </div>
          : null
        */}
        {
          this.config.devMode ?
          <div class="debug-btns-container">
            <i class="debug-btn fa fa-bomb" onClick={() => this.resetApp()}></i>
            <i class="debug-btn fa fa-exclamation-triangle" onClick={() => this.testAlerts()}></i>
          </div>
          : null
        }
        { /*this.config.devMode ? <DebugConsole show={this.state.debugConsole} close={this.hideDebugConsole} /> : null */}
				{ this.config.devMode ?
          <NotSoSecretCode config={this.config} menu={this.state.menu} customAction={this.resetAppAfterCode} /> :
          <NotSoSecretCode config={this.config} menu={this.state.menu} useGiphy={true} />
        }
        <GlobalKeyboardShortcuts
          toggleKeyboardShortcuts={this.toggleKeyboardShortcuts}
          escape={this.escapeKeyCallback}
        />
        <KeyboardShortcutHelp config={this.config} show={this.state.kb} dismiss={() => this.hideKeyboardShortcuts()} />
        <audio preload id="secret-sound" src="/assets/sounds/secret.wav" />
        <audio preload id="highlight-sound" src="/assets/sounds/secret.wav" />
        <FixedAlerts alerts={this.state.alerts} device={this.state.device} dismiss={this.dismissAlert} />
			</div>
		);
	}
}
