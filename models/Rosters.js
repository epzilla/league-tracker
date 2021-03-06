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
    }
  }, {
    tableName: 'rosters',
    timestamps: false,
    freezeTableName: true
  });
};
