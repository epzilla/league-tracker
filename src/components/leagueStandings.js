import { Component } from 'preact';
import EmptyStandingsTable from './EmptyStandingsTable';

export default class LeagueStandings extends Component {
  constructor(props) {
    super(props);
    this.state = { divisionStandings: [] };
  }

  componentWillReceiveProps({ standings }) {
    if (standings) {
      const competitions = standings.competitions;
      if (competitions && competitions.length > 0) {
        const current = competitions.find(c => !!c.current);
        if (current && current.divisionStandings && current.divisionStandings.length > 0) {
          this.setState({ divisionStandings: current.divisionStandings });
        }
      }
    }
  }

  render() {
    const { divisionStandings } = this.state;

    if (divisionStandings.length > 0) {
      return (
        <div class="league-standings">
          {
            divisionStandings.map(standing => {
              <section class="division-standings">
                <h2 class="primary-text">{ standing.division.name } Standings</h2>
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
                      standing.teamOrPlayerStandings.map(t => {
                        return (
                          <tr>
                            <td>{t.standing}</td>
                            <td>{t.team.title}</td>
                            <td>{t.wins}</td>
                            <td>{t.draws}</td>
                            <td>{t.losses}</td>
                            <td>{t.points}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </section>
            })
          }
        </div>
      );
    }

    return <EmptyStandingsTable league={this.props.standings} />
  }
}
