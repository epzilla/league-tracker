/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tournaments', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
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
      allowNull: false,
      defaultValue: '0'
    },
    formatId: {
      field: 'format_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'tournament_formats',
        key: 'id'
      }
    },
    numParticipants: {
      field: 'num_participants',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined
    },
    numKnockoutRounds: {
      field: 'num_knockout_rounds',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined
    }
  }, {
    tableName: 'tournaments',
    timestamps: false,
    freezeTableName: true
  });
};
