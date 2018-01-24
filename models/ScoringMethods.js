/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ScoringMethods', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    sportId: {
      field: 'sport_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: undefined
    },
    numPoints: {
      field: 'num_points',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined
    },
    abbrev: {
      field: 'abbrev',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: undefined
    }
  }, {
    tableName: 'scoring_methods',
    timestamps: false,
    freezeTableName: true
  });
};
