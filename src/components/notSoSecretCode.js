import { Component } from 'preact';

const DPadButton = ({ code, dir, index, pattern, onTouchend }) => {
  let classes = `d-pad-button ${dir}-button no-swipe`;
  let arrow;

  switch (dir) {
    case 'down':
      arrow = <span>&#x21E9;</span>;
      break;
    case 'left':
      arrow = <span>&#x21E6;</span>;
      break;
    case 'right':
      arrow = <span>&#x21E8;</span>;
      break;
    default:
      arrow = <span>&#x21E7;</span>;
  }

  if (`${pattern[index]}${pattern[index + 1]}` === code.toString()) {
    classes += ' correct-btn';
  }
  return (
    <div class={classes}
      onTouchstart={(e) => e.stopPropagation()}
      onTouchend={(e) => onTouchend(e, code)} >
      { arrow }
    </div>
  );
};

const BAButton = ({ code, btn, index, pattern, onTouchend }) => {
  let classes = `b-a-button ${btn}-button no-swipe`;

  if (`${pattern[index]}${pattern[index + 1]}` === code.toString()) {
    classes += ' correct-btn';
  }
  return (
    <div class="flex flex-center flex-col no-swipe" onTouchstart={(e) => e.stopPropagation()} onTouchend={(e) => onTouchend(e, code)} >
      <div class={ classes }></div>
      <label class="no-swipe">{ btn }</label>
    </div>
  );
};

export default class NotSoSecretCode extends Component {
  constructor(props) {
    super(props);
    this.pattern = '38384040373937396665';
    this.keys = '';
    this.index = 0;
    this.touches = 0;
    this.isShowing = false;
    this.state.isShowingTouchpad = false;
    this.listenForSwipes = false;
    this.startX;
    this.startY;
    this.currentX;
    this.currentY;
    this.yThreshold;
    this.touchpad;
    this.highlightSound;
    this.secretSound;
  }

  componentWillMount() {
    this.state = { img: '', isShowingTouchpad: false };
  }

  componentDidMount() {
    document.removeEventListener('keyup', this.listener);
    document.removeEventListener('touchstart', this.onDocTouchstart);
    document.removeEventListener('touchend', this.onTouchend);
    document.addEventListener('keyup', this.listener);
    document.addEventListener('touchstart', this.onDocTouchstart);
    document.addEventListener('touchend', this.onTouchend);
    this.highlightSound = document.getElementById('highlight-sound');
    if (this.props.config.highlightSound) {
      this.highlightSound.src = this.props.config.highlightSound;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.listener);
    document.removeEventListener('touchstart', this.onDocTouchstart);
    document.removeEventListener('touchend', this.onTouchend);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.menu) {
      this.setState(this.state);
    }
  }

  getRandomImg = () => {
    if (this.props.useGiphy) {
      let allPics = this.props.config.highlightImages.portrait.concat(this.props.config.highlightImages.landscape);
      return allPics[Math.floor(Math.random() * allPics.length)];
    }

    let portrait = window.matchMedia('(orientation: portrait)').matches;
    let allPics = this.props.config.highlightImages;
    let chosenPics = portrait ? allPics.portrait : allPics.landscape;
    return chosenPics[Math.floor(Math.random() * chosenPics.length)];
  };

  listener = e => {
    if (e.which === 27) {
      //ESC
      this.dismiss();
    } else {
      let keys = this.keys + `${e.which}`;
      if (this.pattern.indexOf(keys.toString()) === -1) {
        this.keys = `${e.which}`;
        this.index = 2;
      } else {
        this.keys = keys;
        this.index = keys.length;
        if (!this.isShowing) {
          this.setState({ img: this.getRandomImg() });
        }
      }
    }
  };

  dismiss = () => {
    this.keys = '';
    this.isShowing = false;
    this.setState({ img: '' });
  };

  toggleTouchpad = () => {
    this.setState({ touchpad: !this.state.touchpad });
  };

  onTouchstart = e => {
    e.preventDefault();
    let t = e && e.touches && e.touches.length > 0 ? e.touches[0] : null;
    if (t && !t.target.classList.contains('no-swipe')) {
      let h = window.innerHeight;
      this.startX = t.clientX;
      this.startY = t.clientY;
      this.currentY = t.clientY;
      this.yThreshold = h / 4;
      this.touchpad = document.getElementById('touchpad');
      this.listenForSwipes = true;
      this.highlightSound = document.getElementById('highlight-sound');
      this.highlightSound && this.highlightSound.load();
    }
  };

  onDocTouchstart = (e) => {
    this.touches = e.touches.length;
    this.secretSound = document.getElementById('secret-sound');
    this.secretSound && this.secretSound.load();
  };

  onTouchmove = e => {
    if (this.listenForSwipes) {
      let t = e && e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : null;
      if (t) {
        let movedY = t.clientY - this.currentY;

        if (this.state.isShowingTouchpad && movedY > 10 && t.clientY >= this.yThreshold) {
          // We have swiped down
          this.listenForSwipes = false;
          this.didSwipeDown();
          return;
        }

        if (movedY > 0) {
          this.currentY = t.clientY;
          this.touchpad.style.transform = `translateY(${this.currentY}px)`;
          this.touchpad.classList.remove('show');
        }
      }
    }
  };

  onTouchend = e => {
    if (this.props.menu && !this.state.isShowingTouchpad && this.touches > 1) {
      e.preventDefault();
      e.stopPropagation();
      this.secretSound.play();
      this.anchorTop();
    }
  };

  didSwipeDown = () => {
    this.touches = 0;
    this.touchpad.style.transform = `translateY(100vh)`;
    this.setState({ isShowingTouchpad: false }, () => setTimeout(() => this.listenForSwipes = true, 500));
  };

  anchorTop = () => {
    this.touchpad = document.getElementById('touchpad');
    this.touchpad.style.transform = ``;
    this.touchpad.classList.add('show');
    this.setState({ isShowingTouchpad: true }, () => setTimeout(() => this.listenForSwipes = true, 500));
  }

  onButtonTouchend = (e, which) => {
    e.preventDefault();
    let keys = this.keys + `${which}`;
    if (this.pattern.indexOf(keys.toString()) === -1) {
      this.keys = `${which}`;
      this.index = 2;
      this.setState(this.state);
    } else {
      this.keys = keys;
      this.index = keys.length;
      if (!this.isShowing) {
        this.setState(this.state);
      }
    }
  };

  render() {
    if (this.keys.toString() === this.pattern || this.keys.toString().indexOf(this.pattern) !== -1) {
      let bgImgStyle = `background-image: url('${this.getRandomImg()}');`;
      if (!this.isShowing) {
        this.isShowing = true;

        if (this.props.customAction) {
          this.props.customAction();
        }

        if (this.touchpad) {
          this.touchpad.style.transform = 'translateY(100vh)';
        }

        this.highlightSound && this.highlightSound.play();
      }

      if (this.props.customAction) {
        return;
      } else {
        return (
          <div class={`secret-modal modal flex-center ${this.props.useGiphy ? 'gif' : ''}`} style={ bgImgStyle }>
            <button class="dismiss-btn" onClick={() => this.dismiss()}>&times;</button>
            { !this.props.useGiphy ? <h1>Touchdown { this.props.config.team }!</h1> : null }
          </div>
        );
      }
    }
    else if (this.props.menu) {
      let emoji = <span>🤔</span>;
      let keys = this.keys.toString();
      if (keys.length > 0) {
        let rightTrack = this.pattern.startsWith(keys);
        let progress = this.keys.length;
        let length = this.pattern.length;
        let ok = Math.floor(length / 4);
        let good = Math.floor(length / 2);
        let great = Math.floor(3 * length / 4);
        if (!rightTrack) {
          emoji = <span>😕</span>;
        }
        else if (progress <= ok) {
          emoji = <span>😯</span>;
        }
        else if (progress <= good) {
          emoji = <span>🙂</span>;
        }
        else if (progress <= great) {
          emoji = <span>😃</span>;
        }
        else {
          emoji = <span>😍</span>;
        }
      }

      return (
        <div id="touchpad"
          class={this.state.isShowingTouchpad ? 'touchpad show' : 'touchpad'}
          onTouchstart={(e) => this.onTouchstart(e)}
          onTouchmove={(e) => this.onTouchmove(e)}
        >
          <div class={this.state.isShowingTouchpad ? 'touch-hint flip' : 'touch-hint'}></div>
          <div class="emoji-hint">
            <h1>{ emoji }</h1>
          </div>
          <div class="touch-controller flex-space-between">
            <div class="d-pad flex no-swipe">
              <div class="flex flex-center no-swipe">
                <DPadButton
                  code={38}
                  index={this.index}
                  dir={'up'}
                  pattern={this.pattern}
                  onTouchend={(e) => this.onButtonTouchend(e, 38)}
                />
              </div>
              <div class="flex flex-center no-swipe">
                <DPadButton
                  code={37}
                  index={this.index}
                  dir={'left'}
                  pattern={this.pattern}
                  onTouchend={(e) => this.onButtonTouchend(e, 37)}
                />
                <div class="d-pad-button center-button no-swipe"></div>
                <DPadButton
                  code={39}
                  index={this.index}
                  dir={'right'}
                  pattern={this.pattern}
                  onTouchend={(e) => this.onButtonTouchend(e, 39)}
                />
              </div>
              <div class="flex flex-center no-swipe">
                <DPadButton
                  code={40}
                  index={this.index}
                  dir={'down'}
                  pattern={this.pattern}
                  onTouchend={(e) => this.onButtonTouchend(e, 40)}
                />
              </div>
            </div>
            <div class="b-a-buttons flex no-swipe">
              <BAButton
                code={66}
                index={this.index}
                btn="B"
                pattern={this.pattern}
                onTouchend={(e) => this.onButtonTouchend(e, 66)}
              />
              <BAButton
                code={65}
                index={this.index}
                btn="A"
                pattern={this.pattern}
                onTouchend={(e) => this.onButtonTouchend(e, 65)}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}