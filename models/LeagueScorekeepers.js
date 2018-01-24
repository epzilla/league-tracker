/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LeagueScorekeepers', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    leagueId: {
      field: 'league_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'leagues',
        key: 'id'
      }
    },
    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'teams',
        key: 'id'
      }
    }
  }, {
    tableName: 'league_scorekeepers',
    timestamps: false,
    freezeTableName: true
  });
};
