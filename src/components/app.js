import { h, Component } from 'preact';
import { route, Router } from 'preact-router';

import Config from '../config';

import Home from '../routes/Home';
import LeagueHome from '../routes/LeagueHome';
import LeagueSchedule from '../routes/LeagueSchedule';
import LeagueStats from '../routes/LeagueStats';
import Login from '../routes/Login';
import Logout from '../routes/Logout';
import Signup from '../routes/SignUp';
import TeamSchedule from '../routes/TeamSchedule';
import TeamStats from '../routes/TeamStats';

import DebugConsole from './DebugConsole';
import FixedAlerts from './FixedAlerts';
import GlobalKeyboardShortcuts from './GlobalKeyboardShortcuts';
import Header from './Header';
import KeyboardShortcutHelp from './KeyboardShortcutHelp';
import NotSoSecretCode from './NotSoSecretCode';

import * as Constants from '../lib/constants';
import LocalStorageService from '../lib/local-storage-service';
import Rest from '../lib/rest-service';
import WebSocketService from '../lib/websocket-service';
import { lightenOrDarken, generateGuid } from '../lib/helpers';

export default class App extends Component {
	constructor(props) {
    super(props);
    this.ls = LocalStorageService;
    this.config = Config;
    this.siteName = this.config.siteName
    this.state = {
      menu: false,
      kb: false,
      user: null,
      currentUrl: null,
      debugConsole: true,
      league: null,
      navTitle: this.siteName,
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

    Rest.get('users/me').then(user => this.setState({ user }))
      .catch(err => {
        if (this.currentUrl === '/') {
          route('/login');
        }
      });

    if (this.config && this.config.useGiphy) {
      Rest.getExternal(`https://api.giphy.com/v1/gifs/search?api_key=${this.config.giphyAPIkey}&q=ping pong&limit=10&offset=${Math.random() * 200}&rating=PG-13&lang=en`)
        .then(result => {
          if (result && result.data) {
            this.config.highlightImages.portrait = result.data.slice(0, 5).map(d => d.images.downsized_medium.url);
            this.config.highlightImages.landscape = result.data.slice(5, 10).map(d => d.images.downsized_medium.url);
          }
        });
    }
  }

	/**
	 *  Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
    this.currentUrl = e.url;
    this.setState({ currentUrl: e.url });
    this.menuToggledCallback(false);
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

  initWebSockets = () => {
    WebSocketService.init(this.config.devMode).then(() => {
      WebSocketService.subscribe(Constants.MATCH_STARTED, this.onMatchStart);
    });
  };

  resetApp = () => {
    this.canReset = true;
  };

  setLeague = (league) => {
    this.setState({ league, navTitle: league ? league.name : this.siteName });
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
    this.postAlert({ type: 'success', msg: `This is a very long alert. You know, it's always a good idea to test things using absurdly long strings. Why, one time, my cousing who is a Software eloper failed to do so, and then he got fired when something looked like crap. So yeah, totally do that, bruh.`}, 999999999);
    this.postAlert({ type: 'info', msg: 'Short one'}, 999999999);
    this.postAlert({ type: 'warning', msg: `Hey! cut that out. I'm watchin' you...`}, 999999999);
    this.postAlert({ type: 'error', msg: `Oh boy, now you've done it! What did I tell you, man???`}, 999999999);
  };

  onLogout = () => {
    document.cookie = 'user=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.setState({ user: null });
    route('/login');
  }

	render() {
		return (
			<div id="app">
				<Header
					config={this.config}
          menu={this.state.menu}
          title={this.state.navTitle}
          user={this.state.user}
          league={this.state.league}
          currentUrl={this.state.currentUrl}
					menuToggledCallback={(e) => this.menuToggledCallback(e)}
					showKeyboardShortcuts={() => this.showKeyboardShortcuts()}
				/>
				<Router onChange={this.handleRoute}>
					<Login path="/login" config={this.config} />
          <Logout path="/logout" config={this.config} callback={() => this.onLogout()} />
          <Signup path="/sign-up" config={this.config} />
          <LeagueHome path="/leagues/:leagueSlug" config={this.config} postAlert={this.postAlert} setLeague={this.setLeague} />
          <LeagueStats path="leagues/:leagueSlug/stats" config={this.config} />
          <LeagueSchedule path="leagues/:leagueSlug/schedule" config={this.config} />
          <TeamStats path="teams/:teamId/stats" config={this.config} />
          <TeamSchedule path="teams/:teamId/schedule" config={this.config} />
          <Home path="/" config={this.config} postAlert={this.postAlert} user={this.state.user} />
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
        <FixedAlerts alerts={this.state.alerts} dismiss={this.dismissAlert} />
			</div>
		);
	}
}
