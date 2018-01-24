/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TeamAdmins', {
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
    teamId: {
      field: 'team_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'teams',
        key: 'id'
      }
    }
  }, {
    tableName: 'team_admins',
    timestamps: false,
    freezeTableName: true
  });
};
