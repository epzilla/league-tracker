/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Teams', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: undefined,
      primaryKey: true
    },
    title: {
      field: 'title',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    code: {
      field: 'code',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    nickname: {
      field: 'nickname',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    short_name: {
      field: 'short_name',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    shorter_name: {
      field: 'shorter_name',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    slangNames: {
      field: 'slang_names',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    primaryColor: {
      field: 'primary_color',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    secondaryColor: {
      field: 'secondary_color',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    tertiaryColor: {
      field: 'tertiary_color',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    primaryLogo: {
      field: 'primary_logo',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    secondaryLogo: {
      field: 'secondary_logo',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: undefined
    },
    leagueId: {
      field: 'league_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'leagues',
        key: 'id'
      }
    },
    divisionId: {
      field: 'division_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined,
      references: {
        model: 'divisions',
        key: 'id'
      }
    },
    primaryVenueId: {
      field: 'primary_venue_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    },
    secondaryVenueId: {
      field: 'secondary_venue_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: undefined
    }
  }, {
    tableName: 'teams',
    timestamps: false,
    freezeTableName: true
  });
};
