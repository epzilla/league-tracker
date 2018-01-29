import { Component } from 'preact';

export default class ScheduleList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div class="league-standings">
        <div class="match-list">
          <h3 class="align-center">Schedule</h3>
          <ul class="recent-match-list"></ul>
        </div>
      </div>
    );
  }
}
