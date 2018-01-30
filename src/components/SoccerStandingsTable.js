import { getGoalDifferential } from '../lib/soccerHelpers';

const SoccerStandingsTable = ({ standings }) => {
  return (
    <section class="division-standings">
      <h2 class="primary-text">{ standings.division.name } Standings</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Team</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>GF</th>
            <th>GA</th>
          </tr>
        </thead>
        <tbody>
          {
            standings.teamOrPlayerStandings.map(t => {
              const gd = getGoalDifferential(t.goalsFor, t.goalsAgainst)
              return (
                <tr>
                  <td>{t.standing}</td>
                  <td>{t.team.title}</td>
                  <td>{t.wins}</td>
                  <td>{t.draws}</td>
                  <td>{t.losses}</td>
                  <td class={gd > 0 ? 'gd-plus' : (gd < 0 ? 'gd-minus' : '')}>{getGoalDifferential(t.goalsFor, t.goalsAgainst)}</td>
                  <td>{t.goalsFor}</td>
                  <td>{t.goalsAgainst}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </section>
  );
};

export default SoccerStandingsTable;