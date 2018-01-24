/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Competitions', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    leagueId: {
      field: 'league_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'leagues',
        key: 'id'
      }
    },
    formatId: {
      field: 'format_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    current: {
      field: 'current',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    season: {
      field: 'season',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    hasPostseasonTournament: {
      field: 'has_postseason_tournament',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    postseasonTournamentId: {
      field: 'postseason_tournament_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'competitions',
    timestamps: false,
    freezeTableName: true
  });
};
