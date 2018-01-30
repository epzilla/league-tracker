module.exports = function (models) {
  const Coaches = models.Coaches;
  const Competitions = models.Competitions;
  const Divisions = models.Divisions;
  const DivisionStandings = models.DivisionStandings;
  const LeagueAdmins = models.LeagueAdmins;
  const Leagues = models.Leagues;
  const LeagueScorekeepers = models.LeagueScorekeepers;
  const Persons = models.Persons;
  const Players = models.Players;
  const Rosters = models.Rosters;
  const Sports = models.Sports;
  const Teams = models.Teams;
  const TeamOrPlayerStandings = models.TeamOrPlayerStandings;
  const Users = models.Users;

  // Sport-specific
  const PingPongGames = models.PingPongGames;
  const PingPongMatches = models.PingPongMatches;
  const SoccerMatches = models.SoccerMatches;

  Leagues.belongsTo(Sports, { as: 'sport', foreignKey: 'sport_id'});
  Leagues.hasMany(Competitions, { as: 'competitions', foreignKey: 'league_id', sourceKey: 'id'});
  Leagues.hasMany(Divisions, { as: 'divisions', foreignKey: 'league_id', sourceKey: 'id'});
  Leagues.hasMany(Teams, { as: 'teams', foreignKey: 'league_id', sourceKey: 'id'});

  Divisions.belongsTo(Leagues, { as: 'league', foreignKey: 'league_id'});
  Divisions.hasMany(Teams, { as: 'teams', foreignKey: 'division_id', sourceKey: 'id'});

  Teams.belongsTo(Leagues, { as: 'league', foreignKey: 'league_id'});

  Competitions.belongsTo(Leagues, { as: 'league', foreignKey: 'league_id'});
  Competitions.hasMany(DivisionStandings, { as: 'divisionStandings', foreignKey: 'competition_id', sourceKey: 'id'});
  DivisionStandings.belongsTo(Divisions, { as: 'division', foreignKey: 'division_id'});
  DivisionStandings.hasMany(TeamOrPlayerStandings, { as: 'teamOrPlayerStandings', foreignKey: 'division_standings_id', sourceKey: 'id'});
  TeamOrPlayerStandings.belongsTo(Teams, { as: 'team', foreignKey: 'team_id'});
  TeamOrPlayerStandings.belongsTo(Players, { as: 'player', foreignKey: 'player_id'});

  Teams.hasMany(Rosters, { as: 'roster', foreignKey: 'team_id', sourceKey: 'id'});
  Rosters.belongsTo(Teams, { as: 'team', foreignKey: 'team_id'});
  Players.belongsToMany(Rosters, {through: 'roster_players', as: 'rosters', foreignKey: 'player_id'});
  Rosters.belongsToMany(Players, {through: 'roster_players', as: 'players', foreignKey: 'roster_id'});
  Coaches.belongsToMany(Rosters, {through: 'roster_coaches', as: 'rosters', foreignKey: 'coach_id'});
  Rosters.belongsToMany(Coaches, {through: 'roster_coaches', as: 'coaches', foreignKey: 'roster_id'});
  Players.belongsTo(Persons, { as: 'person', foreignKey: 'person_id'});
  Coaches.belongsTo(Persons, { as: 'person', foreignKey: 'person_id'});

  // Admins/Users
  LeagueAdmins.belongsTo(Users, { foreignKey: 'user_id', as: 'user'});
  LeagueAdmins.belongsTo(Leagues, { foreignKey: 'league_id', as: 'league'});
  LeagueScorekeepers.belongsTo(Users, { foreignKey: 'user_id', as: 'user'});
  LeagueScorekeepers.belongsTo(Leagues, { foreignKey: 'league_id', as: 'league'});
  Users.belongsToMany(Leagues, {through: 'user_leagues', as: 'leagues', foreignKey: 'user_id'});
  Leagues.belongsToMany(Users, {through: 'user_leagues', as: 'users', foreignKey: 'league_id'});

  // Matches/Players
  Players.belongsToMany(PingPongMatches, {through: 'ping_pong_match_players', as: 'matches', foreignKey: 'player_id'});
  PingPongMatches.belongsToMany(Players, {through: 'ping_pong_match_players', as: 'players', foreignKey: 'match_id'});

  // Matches/Sets/Games
  PingPongMatches.belongsToMany(PingPongGames, {through: 'ping_pong_match_games', as: 'games', foreignKey: 'match_id'});
  PingPongGames.belongsToMany(PingPongMatches, {through: 'ping_pong_match_games', as: 'match', foreignKey: 'game_id'});

  SoccerMatches.belongsTo(Teams, { as: 'team1', sourceKey: 'id', foreignKey: 'team1_id'});
  SoccerMatches.belongsTo(Teams, { as: 'team2', sourceKey: 'id', foreignKey: 'team2_id'});
};