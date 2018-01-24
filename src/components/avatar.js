import { Component } from 'preact';
import Rest from '../lib/rest-service';

export default class Avatar extends Component {
  constructor(props) {
    super(props);
  }

  edit = e => {
    let input = e.currentTarget.querySelector('input');
    if (input) {
      input.click();
    }
  };

  processChange = e => {
    this.uploadFile(e.target.files[0]);
  };

  uploadFile = (file) => {
    if (file.type.includes('image')) {
      let reader = new FileReader();
      let self = this;
      reader.onload = () => {
        self.setState({ newAvatar: reader.result }, () => {
          Rest.put('avatar', { avatar: self.state.newAvatar }).then(() => {
            if (self.props.avatarUpdatedCallback) {
              self.props.avatarUpdatedCallback(self.state.newAvatar);
            }
          });
        });
      };
      reader.readAsDataURL(file);
    }
  };

  handleDragenter = e => {
    e.preventDefault();
  };

  handleDragleave = e => {
    e.target.classList.remove('can-drop');
  };

  handleDragover = e => {
    if ([...e.dataTransfer.types].includes('Files')) {
      e.preventDefault();
      e.target.classList.add('can-drop');
    }
  };

  handleDrop = e => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      this.uploadFile(e.dataTransfer.files[0]);
    }
  };

  render() {
    let classes = 'avatar';
    if (this.props.big) {
      classes += ' big';
    }

    if (this.props.empty) {
      classes += ' empty';
    }

    if (this.props.editable) {
      classes += ' editable';
      let avatar = this.state.newAvatar || this.props.avatar;
      return (
        <div class={ classes }
          onClick={(e) => this.edit(e)}
          onDragenter={(e) => this.handleDragenter(e)}
          onDragover={(e) => this.handleDragover(e)}
          onDragleave={(e) => this.handleDragleave(e)}
          onDrop={(e) => this.handleDrop(e)}
          style={{
            backgroundImage: avatar ? `url(${avatar})` : `url(/assets/images/default_avatar.png)`
          }}
        >
          <input type="file" value={this.state.newAvatar} onChange={this.processChange} />
          <div class="edit-overlay">
            <span>Click to change</span>
          </div>
        </div>
      );
    } else if (this.props.fname || this.props.lname) {
      let fi = this.props.fname ? this.props.fname[0] : '';
      let li = this.props.lname ? this.props.lname[0] : '';
      return (
        <div class={ classes }>
          <span class="avatar-initials">{fi}{li}</span>
        </div>
      );
    } else if (this.props.empty) {
      return (
        <div class={ classes }>
          <span class="avatar-empty">
            <i class="fa fa-user-circle"></i>
          </span>
        </div>
      );
    }

    return (
      <div class={ classes }
        style={{
          backgroundImage: this.props.avatar ? `url(${this.props.avatar})` : `url(/assets/images/default_avatar.png)`
        }}
      ></div>
    );
  }
}