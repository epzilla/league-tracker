/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PingPongMatches', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true
    },
    leagueId: {
      field: 'league_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    updateEveryPoint: {
      field: 'update_every_point',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    playTo: {
      field: 'play_to',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 21
    },
    winByTwo: {
      field: 'win_by_two',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    bestOf: {
      field: 'best_of',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 4
    },
    playAllGames: {
      field: 'play_all_games',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    doubles: {
      field: 'doubles',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    player1Id: {
      field: 'player1_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'players',
        key: 'id'
      }
    },
    player2Id: {
      field: 'player2_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'players',
        key: 'id'
      }
    },
    partner1Id: {
      field: 'partner1_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'players',
        key: 'id'
      }
    },
    partner2Id: {
      field: 'partner2_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'players',
        key: 'id'
      }
    },
    finished: {
      field: 'finished',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    startTime: {
      field: 'start_time',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    finishTime: {
      field: 'finish_time',
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'ping_pong_matches',
    timestamps: false,
    freezeTableName: true
  });
};
