/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TeamOrPlayerStanding', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      autoIncrement: true,
      primaryKey: true
    },
    divisionStandingsId: {
      field: 'division_standings_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'division_standings',
        key: 'id'
      }
    },
    teamId: {
      field: 'team_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    playerId: {
      field: 'player_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      references: {
        model: 'players',
        key: 'id'
      }
    },
    isTeam: {
      field: 'is_team',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    wins: {
      field: 'wins',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    draws: {
      field: 'draws',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    losses: {
      field: 'losses',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    otLosses: {
      field: 'ot_losses',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    winPct: {
      field: 'win_pct',
      type: DataTypes.REAL,
      allowNull: true,
      defaultValue: undefined
    },
    points: {
      field: 'points',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    divWins: {
      field: 'div_wins',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    divLosses: {
      field: 'div_losses',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    divDraws: {
      field: 'div_draws',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    divWinPct: {
      field: 'div_win_pct',
      type: DataTypes.REAL,
      allowNull: true,
      defaultValue: undefined
    },
    subdivWins: {
      field: 'subdiv_wins',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    subdivLosses: {
      field: 'subdiv_losses',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    subdivDraws: {
      field: 'subdiv_draws',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    subdivWinPct: {
      field: 'subdiv_win_pct',
      type: DataTypes.REAL,
      allowNull: true,
      defaultValue: undefined
    },
    standing: {
      field: 'standing',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    goalsFor: {
      field: 'goals_for',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    goalsAgainst: {
      field: 'goals_against',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    gamesWon: {
      field: 'games_won',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    gamesLost: {
      field: 'games_lost',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    setsWon: {
      field: 'sets_won',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    setsLost: {
      field: 'sets_lost',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    pointsWon: {
      field: 'points_won',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    pointsLost: {
      field: 'points_lost',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'team_or_player_standings',
    timestamps: false,
    freezeTableName: true
  });
};
