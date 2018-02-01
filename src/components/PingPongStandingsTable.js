const PingPongStandingsTable = ({ competition, standings }) => {
  return (
    <section class="division-standings">
      <h2 class="primary-text">{ standings.division.name } Standings</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>Games Won</th>
            <th>Games Lost</th>
            <th>Points For</th>
            <th>Points Against</th>
          </tr>
        </thead>
        <tbody>
          {
            standings.teamOrPlayerStandings.map(p => {
              return (
                <tr>
                  <td>{p.standing}</td>
                  <td>{p.player.person.fname} {p.player.person.lname}</td>
                  <td>{p.wins}</td>
                  <td>{p.draws}</td>
                  <td>{p.losses}</td>
                  <td>{p.gamesWon}</td>
                  <td>{p.gamesLost}</td>
                  <td>{p.pointsWon}</td>
                  <td>{p.pointsLost}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </section>
  );
};

export default PingPongStandingsTable;