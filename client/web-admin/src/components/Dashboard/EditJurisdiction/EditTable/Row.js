import React, { useState, useEffect } from 'react'
import {
  makeStyles,
  TableRow,
  TableCell,
  Box,
  // Checkbox,
  Collapse,
} from '@material-ui/core'
import AutoForm from 'components/core/AutoForm'
import LocationForm from '../LocationForm'

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      // borderBottom: 'unset',
    },
  },
  collapseRoot: {
    '& > *': {
      borderBottom: 'unset'
    },
  },
});

function Row({ model, row, isItemSelected, onClick, labelId, onSave, isLocations }) {
  const classes = useRowStyles()
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = useState(null)

  const toggle = () => setOpen(!open)

  const handleChange = (newValues) => {
    setValues({
      ...values,
      ...newValues,
    })
    onSave({
      ...values,
      ...newValues,
    })
  }

  // set values whenever row changes
  useEffect(() => setValues(row), [row])

  if (!values) return null
  return (
    <>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        className={classes.root}
      >
        {/*<TableCell>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </TableCell>*/}
        {/*<TableCell padding="checkbox">
          <Checkbox
            checked={values.isValidated}
            inputProps={{ 'aria-labelledby': labelId }}
            onChange={(event, isValidated) => handleChange({ isValidated })}
          />
        </TableCell>*/}
        {model.tableFields.map((field, idx) => (
          <TableCell
            key={field}
            style={{ cursor: 'pointer' }}
            onClick={toggle}
            align='left'>
            {values[field]}
          </TableCell>
        ))}
      </TableRow>
      <TableRow className={classes.collapseRoot}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {
                isLocations
                ? (
                  <LocationForm
                    initialValues={row}
                    submitText={`Add Location`}
                    onSubmit={(values, funcs) => {
                      handleChange(values)
                      setOpen(false)
                      funcs.setSubmitting(false)
                    }}
                  />
                ) : (
                  <AutoForm
                    model={model.editFields}
                    initialValues={row}
                    submitText='Update Location'
                    onSubmit={(values, funcs) => {
                     handleChange(values)
                     setOpen(false)
                     funcs.setSubmitting(false)
                    }}
                    style={{ maxWidth: 400 }}
                 />
                )
              }
            </Box>
           </Collapse>
         </TableCell>
       </TableRow>
    </>
  );
}

export default Row
