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
        <button class="btn menu-btn" onClick={() => this.toggleMenu()}>Menu</button>
        <Link class="center" href="/" tabindex="1"><h1>{ this.props.config.siteName }</h1></Link>
        <nav class={this.state.menu ? 'show' : 'hide'}>
          <div class="nav-links flex-pull-right">
            <Link activeClassName="active" href="/" tabindex="1">Home</Link>
            <Link activeClassName="active" href="/stats" tabindex="2">Stats</Link>
          </div>
        </nav>
        <div class={backdropClass} onClick={() => this.toggleMenu()}></div>
      </header>
    );
  }
}
