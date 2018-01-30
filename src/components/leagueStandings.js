import { Component } from 'preact';

export default class LeagueStandings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="league-standings">
        <h2 class="primary-text">{ this.props.league ? this.props.league.name : '' } Standings</h2>
        {
          this.props.standings ?
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Team</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>P</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.standings.map(s => {
                  return (
                    <tr>
                      <td>{s.standing}</td>
                      <td>{s.team.title}</td>
                      <td>{s.wins}</td>
                      <td>{s.draws}</td>
                      <td>{s.losses}</td>
                      <td>{s.points}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          : null
        }
      </div>
    );
  }
}
