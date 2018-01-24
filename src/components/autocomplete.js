import { Component } from 'preact';

const debounce = function (func, wait, immediate) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

export default class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      matches: [],
      currentValue: '',
      value: '',
    };
  }

  componentWillReceiveProps({ value }) {
    if (value) {
      this.setState({ currentValue: value });
    }
  }

  select = (item) => {
    this.setState({ currentValue: item.val, value: item.val, matches: [] });
    if (this.props.onSelect) {
      this.props.onSelect(item);
    }
  };

  onClick = (e) => {
    let item = e.target.dataset.val;
    this.select(item);
  };

  onKeyUp = debounce((e) => {
    if (e.key === 'ArrowDown') {
      let matches = this.state.matches;
      let i = matches.findIndex(m => m.highlighted);
      if (i !== -1) {
        matches[i].highlighted = false;
        if (matches.length > i + 1) {
          matches[i + 1].highlighted = true;
        }
        else if (matches.length > 1) {
          matches[0].highlighted = true;
        }
        e.preventDefault();
        this.setState({ matches });
      }
    }
    else if (e.key === 'ArrowUp') {
      let matches = this.state.matches;
      let i = matches.findIndex(m => m.highlighted);
      if (i !== -1) {
        matches[i].highlighted = false;
        if (matches.length > 1 && i === 0) {
          matches[matches.length - 1].highlighted = true;
        }
        else if (matches.length > 1) {
          matches[i - 1].highlighted = true;
        }
        e.preventDefault();
        this.setState({ matches });
      }
    }
    else if (e.key === 'Enter' || e.key === 'Tab') {
      let h = this.state.matches.find(m => m.highlighted);
      if (h) {
        this.select(h);
      }
    }
    else if (e.key === 'Escape') {
      this.setState({ matches: [] });
    }
    else {
      this.setState({ currentValue: e.target.value }, () => {
        let matches = this.state.currentValue.length > 1 ? this.props.options.filter(o => o.toLowerCase().indexOf(this.state.currentValue.toLowerCase()) !== -1) : [];
        matches = matches.map((m, i) => {
          return {
            val: m,
            highlighted: i === 0
          };
        });
        this.setState({ matches });
      });
    }
  }, 10);

  onFocus = (e) => {
    e.target.select();
  };

  onBlur = (e) => {
    let value = e.target.value;
    this.setState({ matches: [] });
    if (this.props.onSelect && value !== this.state.value) {
      this.props.onSelect({ val: value, fromBlur: true });
    }
  };

  render() {
    return (
      <div class="autocomplete">
        <input
          type="text"
          value={this.state.currentValue}
          onKeyUp={(e) => this.onKeyUp(e)}
          onFocus={(e) => this.onFocus(e)}
          onBlur={(e) => this.onBlur(e)}
        />
        {
          this.state.matches && this.state.matches.length > 0 ?
          (
            <ul class="options-dropdown">
              { this.props.renderItems(this.state.matches) }
            </ul>
          )
          : null
        }
      </div>
    );
  }
}