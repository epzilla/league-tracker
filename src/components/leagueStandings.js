import { Component } from 'preact';
import EmptyStandingsTable from './EmptyStandingsTable';
import PingPongStandingsTable from './PingPongStandingsTable';
import SoccerStandingsTable from './SoccerStandingsTable';

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
          let standings = current.divisionStandings.map(s => {
            s.teamOrPlayerStandings.sort((a, b) => a.standing - b.standing);
            return s;
          });
          this.setState({ divisionStandings: standings });
        }
      }
    }
  }

  getName = (standing, teamOrPlayer) => {
    if (teamOrPlayer.isTeam) {
      return teamOrPlayer.team.title;
    }

    return `${teamOrPlayer.player.person.fname} ${teamOrPlayer.player.person.lname}`;
  };

  render() {
    const { divisionStandings } = this.state;

    if (divisionStandings.length > 0) {
      return (
        <div class="league-standings">
          {
            this.props.sport ?
            divisionStandings.map(standing => {
              switch (this.props.sport.name) {
                case 'Soccer':
                  return <SoccerStandingsTable standings={standing} />;
                default:
                  return <PingPongStandingsTable standings={standing} />;
              }
            })
            : null
          }
        </div>
      );
    }

    return <EmptyStandingsTable league={this.props.standings} />
  }
}
