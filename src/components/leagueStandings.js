import { Component } from 'preact';
import EmptyStandingsTable from './EmptyStandingsTable';
import PingPongStandingsTable from './PingPongStandingsTable';
import SoccerStandingsTable from './SoccerStandingsTable';

export default class LeagueStandings extends Component {
  constructor(props) {
    super(props);
    this.state = { competition: null, standings: [] };
  }

  componentWillReceiveProps({ standings }) {
    if (standings) {
      const competitions = standings.competitions;
      if (competitions && competitions.length > 0) {
        const current = competitions.find(c => !!c.current);
        if (current && current.divisionStandings && current.divisionStandings.length > 0) {
          current.divisionStandings = current.divisionStandings.map(s => {
            s.teamOrPlayerStandings.sort((a, b) => a.standing - b.standing);
            return s;
          });
          this.setState({ competition: current, standings: current.divisionStandings });
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
    const { competition, standings } = this.state;

    if (competition && competition.divisionStandings && competition.divisionStandings.length > 0) {
      return (
        <div class="league-standings">
          {
            this.props.sport ?
            standings.map(s => {
              switch (this.props.sport.name) {
                case 'Soccer':
                  return <SoccerStandingsTable competition={competition} standings={s} />;
                default:
                  return <PingPongStandingsTable competition={competition} standings={s} />;
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
