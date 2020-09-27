import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from 'services/api'
import jurisdictionModel from 'models/jurisdiction'
import locationModel from 'models/location'
import AutoForm from './AutoForm'
import { Tabs, Tab, Box, Accordion, AccordionSummary, AccordionDetails, Divider } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          { children }
        </Box>
      )}
    </div>
  );
}

function EditJurisdiction() {
  const { jid } = useParams()
  const [jurisdiction, setJurisdiction] = useState(null)
  const [tabNum, setTabNum] = useState(0)

  useEffect(() => {
    api.jurisdictions.getById(jid).then(setJurisdiction)
  }, [jid])

  if (!jurisdiction) return null
  return (
    <>
      <Tabs value={tabNum} onChange={(event, newValue) => setTabNum(newValue)}>
        <Tab label='Jurisdiction' />
        <Tab label='Locations' />
        <Tab label='Important Dates' />
      </Tabs>
      <TabPanel value={tabNum} index={0}>
        <AutoForm
          model={jurisdictionModel}
          initialValues={null}
          submitText='Update Jurisdiction'
          onSubmit={(values, funcs) => {
            console.log(values)
            funcs.setSubmitting(false)
          }}
          style={{ maxWidth: 400 }}
        />
      </TabPanel>
      <TabPanel value={tabNum} index={1}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`accordion-add-new-location`}
          >
            Add New Location
          </AccordionSummary>
          <AccordionDetails>
            <AutoForm
              model={locationModel}
              initialValues={null}
              submitText='Add Location'
              onSubmit={(values, funcs) => {
                console.log(values)
                funcs.setSubmitting(false)
              }}
              style={{ maxWidth: 400 }}
            />
          </AccordionDetails>
        </Accordion>
        {jurisdiction.locations.map((loc) => (
          <Accordion key={loc.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={`accordion-${loc.id}`}
            >
              Edit { loc.name }
            </AccordionSummary>
            <AccordionDetails>
              <AutoForm
                model={locationModel}
                initialValues={null}
                submitText='Update Location'
                onSubmit={(values, funcs) => {
                  console.log(values)
                  funcs.setSubmitting(false)
                }}
                style={{ maxWidth: 400 }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </TabPanel>
      <TabPanel value={tabNum} index={2}>
        Important dates
      </TabPanel>
    </>
  )
}

export default EditJurisdiction