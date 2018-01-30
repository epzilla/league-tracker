/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SoccerMatches', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true
    },
    competitionId: {
      field: 'competition_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'competitions',
        key: 'id'
      }
    },
    team1Id: {
      field: 'team1_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    team2Id: {
      field: 'team2_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    startTime: {
      field: 'start_time',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: undefined
    },
    started: {
      field: 'started',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    finished: {
      field: 'finished',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    score1: {
      field: 'score1',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    score2: {
      field: 'score2',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    winner: {
      field: 'winner',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: undefined
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'soccer_matches',
    timestamps: false,
    freezeTableName: true
  });
};
