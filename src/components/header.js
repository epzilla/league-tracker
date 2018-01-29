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
              <Link activeClassName="active" href="/" tabindex="1">Home</Link>
              <Link activeClassName="active" href="/stats" tabindex="2">Stats</Link>
              <Link href="/logout" tabindex="3">Log Out</Link>
            </div>
            : null
          }
        </nav>
        <div class={backdropClass} onClick={() => this.toggleMenu()}></div>
      </header>
    );
  }
}
