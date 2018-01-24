/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Sports', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'sports',
    timestamps: false,
    freezeTableName: true
  });
};
