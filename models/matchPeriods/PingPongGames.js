/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PingPongGames', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: true,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true
    },
    score1: {
      field: 'score1',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    score2: {
      field: 'score2',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    finished: {
      field: 'finished',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    matchId: {
      field: 'match_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'ping_pong_matches',
        key: 'id'
      }
    }
  }, {
    tableName: 'ping_pong_games',
    timestamps: false,
    freezeTableName: true
  });
};
