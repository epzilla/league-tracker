/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TournamentRounds', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    nickname: {
      field: 'nickname',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    numParticipants: {
      field: 'num_participants',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '8'
    },
    tournamentId: {
      field: 'tournament_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'tournaments',
        key: 'id'
      }
    },
    twoLegged: {
      field: 'two_legged',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    isChampionship: {
      field: 'is_championship',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    isThirdPlace: {
      field: 'is_third_place',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    dates: {
      field: 'dates',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    isSeries: {
      field: 'is_series',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    seriesBestOf: {
      field: 'series_best_of',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'tournament_rounds',
    timestamps: false,
    freezeTableName: true
  });
};
