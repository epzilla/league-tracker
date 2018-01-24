/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Rosters', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    teamId: {
      field: 'team_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined
    },
    competitionId: {
      field: 'competition_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined
    },
    current: {
      field: 'current',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    },
    firstStringPlayerIds: {
      field: 'first_string_player_ids',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    secondStringPlayerIds: {
      field: 'second_string_player_ids',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    otherPlayerIds: {
      field: 'other_player_ids',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    captainIds: {
      field: 'captain_ids',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    assistantCaptainIds: {
      field: 'assistant_captain_ids',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    headCoachId: {
      field: 'head_coach_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    asstCoachIds: {
      field: 'asst_coach_ids',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'rosters',
    timestamps: false,
    freezeTableName: true
  });
};
