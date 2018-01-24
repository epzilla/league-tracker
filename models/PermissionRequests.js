/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PermissionRequests', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    userPlayer: {
      field: 'user_player',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    userCoach: {
      field: 'user_coach',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    teamScorekeeper: {
      field: 'team_scorekeeper',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    teamAdmin: {
      field: 'team_admin',
      type: 'REAL',
      allowNull: true,
      defaultValue: '0'
    },
    leagueScorekeeper: {
      field: 'league_scorekeeper',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    leagueAdmin: {
      field: 'league_admin',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    leagueId: {
      field: 'league_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'leagues',
        key: 'id'
      }
    },
    teamId: {
      field: 'team_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    playerId: {
      field: 'player_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'players',
        key: 'id'
      }
    },
    coachId: {
      field: 'coach_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'coaches',
        key: 'id'
      }
    }
  }, {
    tableName: 'permission_requests',
    timestamps: false,
    freezeTableName: true
  });
};
