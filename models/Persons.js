/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Persons', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    fname: {
      field: 'fname',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    lname: {
      field: 'lname',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: undefined
    },
    mi: {
      field: 'mi',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    avatar: {
      field: 'avatar',
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
    }
  }, {
    tableName: 'persons',
    timestamps: false,
    freezeTableName: true
  });
};
