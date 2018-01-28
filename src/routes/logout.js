import { Component } from 'preact';
import { route } from 'preact-router';
import Rest from '../lib/rest-service';

const deleteCookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export default class Logout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Rest.del('session').then(() => {
      deleteCookie('user');
      route('/login');
    }).catch(() => {
      deleteCookie('user');
      route('/login');
    });
  }

  render() {
  }
}
