'use strict'
const { Model, Deferrable } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class WipState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.WipState.belongsTo(models.State, {
        foreignKey: 'state_id',
        onDelete: 'restrict',
        onupdate: 'cascade',
      })
      models.WipState.hasMany(models.WipStateImportantDate, {
        foreignKey: 'wip_state_id',
        onDelete: 'restrict',
        onupdate: 'cascade',
        allownull: false,
      })
      models.WipState.hasMany(models.WipStateInfoTab, {
        foreignKey: 'wip_state_id',
        onDelete: 'restrict',
        onupdate: 'cascade',
        allownull: false,
      })
      models.WipState.hasMany(models.WipStateNews, {
        foreignKey: 'wip_state_id',
        onDelete: 'restrict',
        onupdate: 'cascade',
        allownull: false,
      })
      models.WipState.hasMany(models.WipStateNotice, {
        foreignKey: 'wip_state_id',
        onDelete: 'restrict',
        onupdate: 'cascade',
        allownull: false,
      })
      models.WipState.hasMany(models.WipStatePhone, {
        foreignKey: 'wip_state_id',
        onDelete: 'restrict',
        onupdate: 'cascade',
        allownull: false,
      })
      models.WipState.hasMany(models.WipStateUrl, {
        foreignKey: 'wip_state_id',
        onDelete: 'restrict',
        onupdate: 'cascade',
        allownull: false,
      })
    }
  }
  WipState.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        field: 'id',
        primaryKey: true,
      },
      stateId: {
        type: DataTypes.INTEGER,
        field: 'state_id',
        allownull: false,
        onDelete: 'restrict',
        onUpdate: 'cascade',
        references: {
          model: 'state',
          key: 'id',
          deferrable: Deferrable.INITIALLY_DEFERRED,
        },
      },
      name: {
        type: DataTypes.TEXT,
        field: 'name',
        allowNull: false,
      },
      abbreviation: {
        type: DataTypes.TEXT,
        field: 'abbreviation',
        allowNull: false,
      },
      authorityName: {
        type: DataTypes.TEXT,
        field: 'authority_name',
      },
      jurisdictionType: {
        type: DataTypes.ENUM(
          'County',
          'Parish',
          'County or City',
          'City or Township',
          'Municipality',
          'Town or City'
        ),
        field: 'jurisdiction_type',
        allowNull: false,
        defaultValue: 'County',
      },
      internalNotes: {
        type: DataTypes.TEXT,
        field: 'internal_notes',
      },
      isLateRegistrationPossible: {
        type: DataTypes.ENUM('Y', 'N', 'U'),
        field: 'is_late_registration_possible',
        allowNull: false,
        defaultValue: 'U',
      },
      voterRegistrationAuthority: {
        type: DataTypes.ENUM('state', 'jurisdiction'),
        field: 'voter_registration_authority',
        allowNull: false,
        defaultValue: 'jurisdiction',
      },
      fipsCode: {
        type: DataTypes.TEXT,
        field: 'fips_code',
      },
      fipsNumber: {
        type: DataTypes.INTEGER,
        field: 'fips_number',
      },
      stateType: {
        type: DataTypes.ENUM('State', 'Commonwealth', 'Federal District'),
        field: 'state_type',
        allowNull: false,
        defaultValue: 'State',
      },
      timezoneDefault: {
        type: DataTypes.TEXT,
        field: 'timezone_default',
      },
      geoJSON: {
        type: DataTypes.TEXT,
        field: 'geojson',
      },
      editBasisWipStateId: {
        type: DataTypes.INTEGER,
        field: 'edit_basis_wip_state_id',
        allowNull: true,
        comment:
          'This should be constrained to wip_jurisdiction.id (to identify the origin of this data) but sequelize does not understand cyclic dependencies',
      },
      editorUserId: {
        type: DataTypes.INTEGER,
        field: 'editor_user_id',
        allowNull: true,
        onDelete: 'restrict',
        onupdate: 'cascade',
        reference: {
          model: 'user',
          key: 'id',
          deferrable: Deferrable.INITIALLY_DEFERRED,
        },
      },
      editorComments: {
        type: DataTypes.TEXT,
        field: 'editor_comments',
        allowNull: true,
      },
      isReleased: {
        type: DataTypes.BOOLEAN,
        field: 'is_released',
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'WipState',
      tableName: 'wip_state',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      underscored: true,
      paranoid: true,
    }
  )
  return WipState
}
