/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    username: {
      field: 'username',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined
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
      allowNull: true,
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
    playerIds: {
      field: 'player_ids',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    leagueIds: {
      field: 'league_ids',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    sportIds: {
      field: 'sport_ids',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    teamIds: {
      field: 'team_ids',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    password: {
      field: 'password',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: undefined
    },
    phone: {
      field: 'phone',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    email: {
      field: 'email',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    altPhone: {
      field: 'alt_phone',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'users',
    timestamps: false,
    freezeTableName: true
  });
};
