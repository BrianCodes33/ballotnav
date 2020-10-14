import { DataTypes, Deferrable } from './_helpers'

const fields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    field: 'id',
    primaryKey: true,
  },
  wipStateId: {
    type: DataTypes.INTEGER,
    field: 'wip_state_id',
    allowNull: false,
    onDelete: 'restrict',
    onUpdate: 'cascade',
    references: {
      model: 'wip_state',
      key: 'id',
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  phoneNumberTypeId: {
    type: DataTypes.INTEGER,
    field: 'phonenumbertype_id',
    allowNull: false,
    onDelete: 'restrict',
    onUpdate: 'cascade',
    references: {
      model: 'phonenumbertype',
      key: 'id',
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  phoneNumber: {
    type: DataTypes.TEXT,
    field: 'phone_number',
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    field: 'description',
    allowNull: true,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    field: 'sort_order',
    allowNull: false,
    defaultValue: 1,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: true,
  },
}

export default fields
