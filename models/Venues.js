/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Venues', {
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
    shortName: {
      field: 'short_name',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    nickname: {
      field: 'nickname',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    city: {
      field: 'city',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    state: {
      field: 'state',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    country: {
      field: 'country',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    surface: {
      field: 'surface',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    roof: {
      field: 'roof',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    indoor: {
      field: 'indoor',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    capacity: {
      field: 'capacity',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    address: {
      field: 'address',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'venues',
    timestamps: false,
    freezeTableName: true
  });
};
