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
      defaultValue: 0
    },
    draws: {
      field: 'draws',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    losses: {
      field: 'losses',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    otLosses: {
      field: 'ot_losses',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    winPct: {
      field: 'win_pct',
      type: DataTypes.REAL,
      allowNull: true,
      defaultValue: 0
    },
    points: {
      field: 'points',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    divWins: {
      field: 'div_wins',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    divLosses: {
      field: 'div_losses',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    divDraws: {
      field: 'div_draws',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    divWinPct: {
      field: 'div_win_pct',
      type: DataTypes.REAL,
      allowNull: true,
      defaultValue: 0
    },
    subdivWins: {
      field: 'subdiv_wins',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    subdivLosses: {
      field: 'subdiv_losses',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    subdivDraws: {
      field: 'subdiv_draws',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    subdivWinPct: {
      field: 'subdiv_win_pct',
      type: DataTypes.REAL,
      allowNull: true,
      defaultValue: 0
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
      defaultValue: 0
    },
    goalsAgainst: {
      field: 'goals_against',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    gamesWon: {
      field: 'games_won',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    gamesLost: {
      field: 'games_lost',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    setsWon: {
      field: 'sets_won',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    setsLost: {
      field: 'sets_lost',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    pointsWon: {
      field: 'points_won',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    pointsLost: {
      field: 'points_lost',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'team_or_player_standings',
    timestamps: false,
    freezeTableName: true
  });
};
