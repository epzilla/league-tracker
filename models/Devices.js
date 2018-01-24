/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Devices', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      field: 'type',
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'devices',
    timestamps: false,
    freezeTableName: true
  });
};
