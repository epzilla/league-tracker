/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LeagueAdmins', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'users',
        key: 'id'
      }
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
    }
  }, {
    tableName: 'league_admins',
    timestamps: false,
    freezeTableName: true
  });
};
