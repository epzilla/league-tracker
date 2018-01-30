/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Coaches', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    personId: {
      field: 'person_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'persons',
        key: 'id'
      }
    },
    headCoach: {
      field: 'head_coach',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    asstCoach: {
      field: 'asst_coach',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'coaches',
    timestamps: false,
    freezeTableName: true
  });
};
