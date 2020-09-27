import React from 'react'
import { useFormik } from 'formik'
import { TextField, MenuItem, Button } from '@material-ui/core'

function AutoForm({ model, initialValues, onSubmit, submitText, style }) {
  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues:
      initialValues ||
      (() => {
        return Object.keys(model).reduce((vals, field) => {
          vals[field] = model[field].defaultValue || ''
          return vals
        }, {})
      })(),
    validate: (values) => {
      const errors = {}
      Object.keys(model).forEach((field) => {
        if (model[field].allowNull === false && typeof values[field] === 'undefined')
          errors[field] = 'This field is required.'
      })
      return errors
    },
    onSubmit,
  })

  return (
    <form onSubmit={handleSubmit} style={style}>
      {Object.keys(model).map((field) => {
        const { type } = model[field]

        if (
          !type ||
          field === 'createdAt' ||
          field === 'updatedAt' ||
          (model[field].field || '') === 'id' ||
          (model[field].field || '').endsWith('_id')
        )
          return null

        if (type === 'text')
          return (
            <TextField
              key={field}
              type="text"
              id={field}
              label={field}
              name={field}
              variant="outlined"
              margin="dense"
              fullWidth
              value={values[field] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors[field] || ''}
              error={Boolean(errors[field])}
            />
          )

        if (typeof type === 'object' && type.type === 'select')
          return (
            <TextField
              select
              key={field}
              id={field}
              label={field}
              name={field}
              variant="outlined"
              margin="dense"
              fullWidth
              value={values[field]}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors[field] || ''}
              error={Boolean(errors[field])}
            >
              {type.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.toString()}
                </MenuItem>
              ))}
            </TextField>
          )

        return null
      })}
      <Button
        style={{ marginTop: 20, marginBottom: 20 }}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        margin="normal"
        disabled={isSubmitting}
      >
        { submitText || 'Submit' }
      </Button>
    </form>
  )
}

export default AutoForm
