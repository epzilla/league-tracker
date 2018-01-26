module.exports = function (models) {
  models['Leagues'].belongsTo(models['Sports'], { as: 'sport', foreignKey: 'sport_id'});
  models['Leagues'].hasMany(models['Competitions'], { as: 'competitions', foreignKey: 'league_id', sourceKey: 'id'});
  models['Players'].belongsTo(models['Persons'], { foreignKey: 'person_id'});
  models['Teams'].belongsTo(models['Leagues'], { foreignKey: 'league_id'});
  models['Competitions'].belongsTo(models['Leagues'], { as: 'league', foreignKey: 'league_id'});
  models['Divisions'].belongsTo(models['Leagues'], { as: 'league', foreignKey: 'league_id'});
  models['DivisionStandings'].belongsTo(models['Divisions'], { foreignKey: 'division_id'});
  models['LeagueAdmins'].belongsTo(models['Users'], { foreignKey: 'user_id'});
  models['LeagueAdmins'].belongsTo(models['Leagues'], { foreignKey: 'league_id'});
  models['LeagueScorekeepers'].belongsTo(models['Users'], { foreignKey: 'user_id'});
  models['LeagueScorekeepers'].belongsTo(models['Leagues'], { foreignKey: 'league_id'});
  models['Users'].belongsToMany(models['Leagues'], {through: 'user_leagues', as: 'leagues', foreignKey: 'user_id'});
  models['Leagues'].belongsToMany(models['Users'], {through: 'user_leagues', as: 'users', foreignKey: 'league_id'});

  // Matches/Sets/Games
  models['PingPongMatches'].belongsToMany(models['PingPongGames'], {through: 'ping_pong_match_games', as: 'games', foreignKey: 'match_id'});
  models['PingPongGames'].belongsToMany(models['PingPongMatches'], {through: 'ping_pong_match_games', as: 'match', foreignKey: 'game_id'});
};