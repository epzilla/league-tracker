/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      field: 'username',
      type: DataTypes.INTEGER,
      allowNull: true,
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
    hashedPassword: {
      field: 'hashedPassword',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    provider: {
      field: 'provider',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    salt: {
      field: 'salt',
      type: DataTypes.STRING,
      allowNull: true,
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
