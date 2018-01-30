/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SoccerMatches', {
    id: {
      field: 'id',
      type: '',
      allowNull: true,
      defaultValue: undefined
    },
    team1Id: {
      field: 'team1_id',
      type: '',
      allowNull: true,
      defaultValue: undefined
    },
    team2Id: {
      field: 'team2_id',
      type: '',
      allowNull: true,
      defaultValue: undefined
    },
    playAt: {
      field: 'play_at',
      type: '',
      allowNull: true,
      defaultValue: undefined
    },
    score1: {
      field: 'score1',
      type: '',
      allowNull: true,
      defaultValue: undefined
    },
    score2: {
      field: 'score2',
      type: '',
      allowNull: true,
      defaultValue: undefined
    },
    winner: {
      field: 'winner',
      type: '',
      allowNull: true,
      defaultValue: undefined
    },
    createdAt: {
      field: 'created_at',
      type: '',
      allowNull: true,
      defaultValue: undefined
    },
    updatedAt: {
      field: 'updated_at',
      type: '',
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'soccer_matches',
    timestamps: false,
    freezeTableName: true
  });
};
