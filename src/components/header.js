import { Component } from 'preact';
import { Link } from 'preact-router/match';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { menu: false, kb: false };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.menu !== 'undefined') {
      this.setState({ menu: nextProps.menu });
    }
  }

  toggleMenu() {
    this.setState({ menu: !this.state.menu }, () => {
      this.props.menuToggledCallback(this.state.menu);
    });
  }

  render() {
    let backdropClass = 'nav-modal-backdrop';
    if (this.state.menu) {
      backdropClass += ' show';
    }

    return (
      <header class="header">
        { this.props.user ? <button class="btn menu-btn" onClick={() => this.toggleMenu()}>Menu</button> : null }
        <h1 class="center" tabindex="1">{ this.props.title ? this.props.title : this.props.config.siteName }</h1>
        <nav class={this.state.menu ? 'show' : 'hide'}>
          { this.props.user ?
            <div class="nav-links flex-pull-right">
              { this.props.league ? <span class="separator">Home</span> : null }
              <Link activeClassName="active" href="/" tabindex="1">My Leagues</Link>
              { this.props.league ? <span class="separator">{ this.props.league.name }</span> : null }
              { this.props.currentUrl && this.props.currentUrl !== '/' ? <Link activeClassName="active" href={location.pathname + "/schedule"} tabindex="2">Schedule</Link> : null }
              { this.props.currentUrl && this.props.currentUrl !== '/' ? <Link activeClassName="active" href={location.pathname + "/stats"} tabindex="3">Stats</Link> : null }
              <Link href="/logout" tabindex="4">Log Out</Link>
            </div>
            :
            <div class="nav-links flex-pull-right">
              <Link href="/login" tabindex="4">Log In</Link>
            </div>
          }
        </nav>
        <div class={backdropClass} onClick={() => this.toggleMenu()}></div>
      </header>
    );
  }
}
