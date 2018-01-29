/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Leagues', {
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
    divisionName: {
      field: 'division_name',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    subdivisionName: {
      field: 'subdivision_name',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    slug: {
      field: 'slug',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'leagues',
    timestamps: false,
    freezeTableName: true
  });
};
