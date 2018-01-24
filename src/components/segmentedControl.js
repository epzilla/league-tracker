import { Component } from 'preact';

export default class SegmentedControl extends Component {
  constructor(props) {
    super(props);
    this.state = { value: null };
  }

  componentWillReceiveProps({ value }) {
    this.setState({ value });
  }

  onKeyup = (e) => {
    if (e.target.nodeName === 'BUTTON' && (e.key === 'Enter' || e.key === 'Space')) {
      e.preventDefault();
      e.stopPropagation();
      this.onClick(e.target.dataset('value'));
    }
  };

  onClick = (value) => {
    this.setState({ value })
    this.props.onChange(value);
  };

  render() {
    let opts = this.props.options.map(opt => {
      let classes = 'btn';

      if (opt.value === this.state.value) {
        classes += ' selected';
      }

      return (
        <button class={classes} onClick={(e) => this.onClick(opt.value)}>{opt.label}</button>
      );
    });

    return (
      <div class="segmented-control" onKeyup={this.onKeyup}>
        { opts }
      </div>
    );
  }
}