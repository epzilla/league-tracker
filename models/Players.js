/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Players', {
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
    positionId: {
      field: 'position_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'positions',
        key: 'id'
      }
    },
    subPositionId: {
      field: 'sub_position_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'positions',
        key: 'id'
      }
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
    number: {
      field: 'number',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'players',
    timestamps: false,
    freezeTableName: true
  });
};
