const EmptyStandingsTable = ({ league }) => {
  console.log(league);
  return (<h2>Heyoooo</h2>);
  // if (!league.divisions || league.divisions.length === 0) {
  //   return (
  //     <div class="league-standings">
  //       <section class="division-standings">
  //         <h2 class="primary-text">{ s.division.name } Standings</h2>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th></th>
  //               <th>Team</th>
  //               <th>W</th>
  //               <th>D</th>
  //               <th>L</th>
  //               <th>P</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {
  //               s.teamOrPlayerStandings.map(t => {
  //                 return (
  //                   <tr>
  //                     <td>{t.standing}</td>
  //                     <td>{t.team.title}</td>
  //                     <td>{t.wins}</td>
  //                     <td>{t.draws}</td>
  //                     <td>{t.losses}</td>
  //                     <td>{t.points}</td>
  //                   </tr>
  //                 )
  //               })
  //             }
  //           </tbody>
  //         </table>
  //       </section>
  //     </div>
  //   );
  // }

  // return (
  //   <div class="league-standings">
  //     <section class="division-standings">
  //       <h2 class="primary-text">{ s.division.name } Standings</h2>
  //       <table>
  //         <thead>
  //           <tr>
  //             <th></th>
  //             <th>Team</th>
  //             <th>W</th>
  //             <th>D</th>
  //             <th>L</th>
  //             <th>P</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {
  //             s.teamStandings.map(t => {
  //               return (
  //                 <tr>
  //                   <td>{t.standing}</td>
  //                   <td>{t.team.title}</td>
  //                   <td>{t.wins}</td>
  //                   <td>{t.draws}</td>
  //                   <td>{t.losses}</td>
  //                   <td>{t.points}</td>
  //                 </tr>
  //               )
  //             })
  //           }
  //         </tbody>
  //       </table>
  //     </section>
  //   </div>
  // );
};

export default EmptyStandingsTable;
