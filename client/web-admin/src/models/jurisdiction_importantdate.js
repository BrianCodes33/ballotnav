import { DataTypes, Deferrable } from './_helpers'

const fields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    field: 'id',
    primaryKey: true,
  },
  // wipJurisdictionId: {
  //   type: DataTypes.INTEGER,
  //   field: 'wip_jurisdiction_id',
  //   allownull: false,
  //   onDelete: 'restrict',
  //   onUpdate: 'cascade',
  //   references: {
  //     model: 'wip_jurisdiction',
  //     key: 'id',
  //     deferrable: Deferrable.INITIALLY_DEFERRED,
  //   },
  //   unique: 'wip_jurisdiction_id-importantdatetype_id',
  // },
  importantDateTypeId: {
    type: DataTypes.INTEGER,
    field: 'importantdatetype_id',
    allownull: false,
    onDelete: 'restrict',
    onUpdate: 'cascade',
    references: {
      model: 'importantdatetype',
      key: 'id',
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
    unique: 'wip_jurisdiction_id-importantdatetype_id',
  },
  beginDate: {
    type: 'date',
    field: 'begin_date',
    allownull: true,
  },
  beginTime: {
    type: 'time',
    field: 'begin_time',
    allownull: true,
  },
  endDate: {
    type: 'date',
    field: 'end_date',
    allownull: false,
  },
  endTime: {
    type: 'time',
    field: 'end_time',
    allownull: false,
  },
  note: {
    type: 'textarea',
    field: 'note',
    allownull: true,
  },
  // createdAt: {
  //   type: DataTypes.DATE,
  //   field: 'created_at',
  //   allowNull: true,
  // },
  // updatedAt: {
  //   type: DataTypes.DATE,
  //   field: 'updated_at',
  //   allowNull: true,
  // },
  // deletedAt: {
  //   type: DataTypes.DATE,
  //   field: 'deleted_at',
  //   allowNull: true,
  // },
}

export default fields
