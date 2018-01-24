import { Component } from 'preact';

const StepperBtn = ({ btnPos, onClick }) => {
  let dir = btnPos === 'top' ? 'up' : 'down';
  let btnClasses = `btn btn-invert stepper-btn ${ btnPos  === 'top' ? 'top-btn' : 'bottom-btn'}`;
  let iClass = `fa fa-angle-${ btnPos === 'top' ? 'up' : 'down'}`;

  return (
    <button class={btnClasses} data-direction={dir} onClick={(e) => onClick(e)}>
      <i class={iClass}></i>
    </button>
  );
};

export default class Stepper extends Component {

  constructor(props) {
    super(props);
    this.state = { val: 0, fraction: 0 };
  }

  componentDidMount() {
    if (this.props.full) {
      let val = this.props.initialValue ? this.props.initialValue : 0;
      if (this.props.padSingleDigits && val < 10) {
        val = '0' + val;
      }
      this.setState({
        val: val,
        fraction: 0
      });
    } else if (this.props.initialValue === 0.25) {
        this.setState({
          val: '¼',
          fraction: 1
        });
    } else if (this.props.initialValue === 0.5) {
      this.setState({
        val: '½',
        fraction: 3
      });
    } else if (this.props.initialValue === 0.75) {
      this.setState({
        val: '¾',
        fraction: 5
      });
    } else if (this.props.initialValue > 0.5) {
      this.setState({
        val: '⅔',
        fraction: 4
      });
    } else if (this.props.initialValue > 0.25) {
      this.setState({
        val: '⅓',
        fraction: 2
      });
    } else {
      this.setState({
        val: '--',
        fraction: 0
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue) {
      this.setState({ val: nextProps.initialValue });
    }
  }

  stepDown = (e) => {
    e.preventDefault();
    return this.props.full ? this.stepDownFull() : this.stepDownFractional();
  };

  stepUp = (e) => {
    e.preventDefault();
    return this.props.full ? this.stepUpFull() : this.stepUpFractional();
  };

  stepUpFull = () => {
    let curVal = parseInt(this.state.val);
    let { min, max, wrap, padSingleDigits, onChange } = this.props;
    if (typeof max !== 'undefined' && curVal === max) {
      if (wrap) {
        curVal = min;
      } else {
        return;
      }
    } else {
      curVal++;
    }

    if (padSingleDigits && curVal < 10) {
      curVal = '0' + curVal;
    }

    this.setState({
      val: curVal
    });

    onChange({
      full: true,
      amount: curVal
    });
  };

  stepUpFractional = () => {
    let fracPointer = this.state.fraction;

    if (fracPointer !== 5) {
      fracPointer++;
    } else {
      fracPointer = 0;
    }

    this.setState({
      fraction: fracPointer,
      val: fractions[fracPointer].displayValue
    });
    this.props.onChange({
      full: false,
      amount: fractions[fracPointer]
    });
  };

  stepDownFull = () => {
    let curVal = parseInt(this.state.val);
    let { min, max, wrap, padSingleDigits, onChange } = this.props;
    if (typeof min !== 'undefined' && curVal === min) {
      if (wrap) {
        curVal = max;
      } else {
        return;
      }
    } else {
      curVal--;
    }

    if (padSingleDigits && curVal < 10) {
      curVal = '0' + curVal;
    }

    this.setState({
      val: curVal
    });
    onChange({
      full: true,
      amount: curVal
    });
  };

  stepDownFractional = () => {
    let fracPointer = this.state.fraction;

    if (fracPointer !== 0) {
      fracPointer--;
    } else {
      fracPointer = 5;
    }

    this.setState({
      fraction: fracPointer,
      val: fractions[fracPointer].displayValue
    });
    this.props.onChange({
      full: false,
      amount: fractions[fracPointer]
    });
  };

  render() {
    let { full } = this.props;
    let classes = `stepper stepper-${ full ? 'full' : 'fractional' }`;

    return (
      <div class={classes}>
        <StepperBtn btnPos='top' onClick={this.stepUp}/>
        <div class="stepper-val">
          <span>{this.state.val}</span>
        </div>
        <StepperBtn btnPos='bottom' onClick={this.stepDown}/>
      </div>
    );
  }

}