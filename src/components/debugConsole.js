import { Component } from 'preact';

export default class DebugConsole extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: [] };
    const oldLog = console.log;
    const oldErr = console.error;
    const oldInfo = console.info;
    const oldWarn = console.warn;
    const oldDebug = console.debug;

    console['log'] = function (message) {
        let logs = this.state.logs;
        logs.push({ type: 'log', msg: message });
        oldLog.apply(console, arguments);
        this.setState({ logs });
    }.bind(this);

    console['error'] = function (message) {
        let logs = this.state.logs;
        logs.push({ type: 'error', msg: message });
        oldErr.apply(console, arguments);
        this.setState({ logs });
    }.bind(this);

    console['info'] = function (message) {
        let logs = this.state.logs;
        logs.push({ type: 'info', msg: message });
        oldInfo.apply(console, arguments);
        this.setState({ logs });
    }.bind(this);

    console['debug'] = function (message) {
        let logs = this.state.logs;
        logs.push({ type: 'debug', msg: message });
        oldDebug.apply(console, arguments);
        this.setState({ logs });
    }.bind(this);

    console['warn'] = function (message) {
        let logs = this.state.logs;
        logs.push({ type: 'warn', msg: message });
        oldWarn.apply(console, arguments);
        this.setState({ logs });
    }.bind(this);
  }

  getIcon = (logType) => {
    switch (logType) {
      case 'info':
        return 'fa-info-circle';
      case 'warn':
        return 'fa-exclamation-triangle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'debug':
        return 'fa-bug';
      default:
        return 'fa-pencil';
    }
  };

  render() {
    if (this.props.show) {
      return (
        <section class="console">
          <div class="console-header">
            <h5>Console</h5>
            <button class="close-button" onClick={() => this.props.close()}>&times;</button>
          </div>

          <div class="console-logs">
            {
              this.state.logs.map(log => {
                return (
                  <p class={`console-log console-log-${log.type}`}>
                    <i class={`fa ${this.getIcon(log.type)}`}></i>
                    <span>{log.msg}</span>
                  </p>
                )
              })
            }
          </div>
        </section>
      );
    }
  }
}
