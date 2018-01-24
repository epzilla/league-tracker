/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TournamentFormats', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    doubleElim: {
      field: 'double_elim',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    hasGroupStage: {
      field: 'has_group_stage',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    numGroups: {
      field: 'num_groups',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    groupSingleRoundRobin: {
      field: 'group_single_round_robin',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    groupDoubleRoundRobin: {
      field: 'group_double_round_robin',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    playThirdPlace: {
      field: 'play_third_place',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'tournament_formats',
    timestamps: false,
    freezeTableName: true
  });
};
