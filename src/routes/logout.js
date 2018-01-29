import { Component } from 'preact';
import Rest from '../lib/rest-service';

export default class Logout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Rest.del('session');
    this.props.callback();
  }

  render() {
  }
}
