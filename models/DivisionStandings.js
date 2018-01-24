/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DivisionStandings', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    divisonId: {
      field: 'divison_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'divisions',
        key: 'id'
      }
    },
    competitionId: {
      field: 'competition_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'competitions',
        key: 'id'
      }
    },
    current: {
      field: 'current',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    useOverallWinPct: {
      field: 'use_overall_win_pct',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    },
    useDivWinPct: {
      field: 'use_div_win_pct',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    useSubdivWinPct: {
      field: 'use_subdiv_win_pct',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'division_standings',
    timestamps: false,
    freezeTableName: true
  });
};
