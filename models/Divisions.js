/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Divisions', {
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
    parentDivisionId: {
      field: 'parent_division_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    isSubdivision: {
      field: 'is_subdivision',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: undefined
    },
    divisionType: {
      field: 'division_type',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'divisions',
    timestamps: false,
    freezeTableName: true
  });
};
