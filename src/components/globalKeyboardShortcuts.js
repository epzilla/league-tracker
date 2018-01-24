import { Component } from 'preact';
import { route, getCurrentUrl } from 'preact-router';

export default class GlobalKeyboardShortcuts extends Component {
  constructor(props) {
    super(props);
    this.goto = false;
  }

  componentDidMount() {
    document.removeEventListener('keyup', this.onKeyUp);
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyUp = (e) => {
    if (e.target.nodeName !== 'INPUT') {
      switch (e.key) {
        case 'k':
          this.props.toggleKeyboardShortcuts();
          break;
        case 'Escape':
          this.props.escape();
          break;
        case 'g':
          this.goto = true;
          break;
        case 'h':
          if (this.goto) {
            this.goto = false;
            route('/');
          }
          break;
        case 's':
          if (this.goto) {
            this.goto = false;
            route('/stats');
          }
          break;
        case 'y':
          if (this.goto) {
            this.goto = false;
            route('/yearly');
          }
          break;
        case 'd':
          if (this.goto) {
            this.goto = false;
            route('/depth');
          }
          break;
        case 'r':
          if (this.goto) {
            this.goto = false;
            route('/recruiting');
          }
          break;
        case 'p':
          if (this.goto) {
            this.goto = false;
            route('/profile');
          }
        case 'a':
          if (this.goto) {
            this.goto = false;
            route('/admin');
          }
        default:
          this.goto = false;
      }
    }
  };

  render() {
    return null;
  }
}