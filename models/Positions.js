/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Positions', {
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
      allowNull: false,
      defaultValue: undefined
    },
    abbrev: {
      field: 'abbrev',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    sportId: {
      field: 'sport_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'sports',
        key: 'id'
      }
    },
    isSubPosition: {
      field: 'is_sub_position',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    parentPositionId: {
      field: 'parent_position_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'positions',
    timestamps: false,
    freezeTableName: true
  });
};
