import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from 'services/api'
import jurisdictionModel from 'models/jurisdiction'
import locationModel from 'models/location'
import importantDateModel from 'models/jurisdiction_importantdate'
import infoTabModel from 'models/jurisdiction_infotab'
import newsModel from 'models/jurisdiction_news'
import noticeModel from 'models/jurisdiction_notice'
import phoneModel from 'models/jurisdiction_phone'
import urlModel from 'models/jurisdiction_url'
import AutoForm from './AutoForm'
import {
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Paper,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useHeader } from './Layout'
import TabPanel from './TabPanel'
import EditTable from './EditTable'

const SUBMODELS = [{
  id: 'locations',
  tabLabel: 'Locations',
  displayName: 'Location',
  model: locationModel,
  listKey: 'name',
},{
  id: 'importantDates',
  tabLabel: 'Important Dates',
  displayName: 'Important Date',
  model: importantDateModel,
  listKey: 'note',
},{
  id: 'infoTabs',
  tabLabel: 'Info Tabs',
  displayName: 'Info Tab',
  model: infoTabModel,
  listKey: 'caption',
},{
  id: 'news',
  tabLabel: 'News',
  displayName: 'News',
  model: newsModel,
  listKey: 'caption',
},{
  id: 'notices',
  tabLabel: 'Notices',
  displayName: 'Notice',
  model: noticeModel,
  listKey: 'message',
},{
  id: 'phones',
  tabLabel: 'Phones',
  displayName: 'Phone',
  model: phoneModel,
  listKey: 'phoneNumber',
},{
  id: 'urls',
  tabLabel: 'Urls',
  displayName: 'Url',
  model: urlModel,
  listKey: 'name',
}]

function EditJurisdiction() {
  const { id } = useParams()
  const [jurisdiction, setJurisdiction] = useState(null)
  const [tabNum, setTabNum] = useState(0)
  const { setTitle } = useHeader()

  useEffect(() => {
    api.jurisdictions.getById(id).then((jurisdiction) => {
      setTitle(`Jurisdiction: ${jurisdiction.name}, ${jurisdiction.state.name}`)
      setJurisdiction(jurisdiction)
    })
  }, [id, setTitle])

  const saveProgress = () => {
    console.log('saving:', jurisdiction)
  }

  const submitForReview = () => {
    console.log('submitting:', jurisdiction)
  }

  const updateJurisdictionDetails = (newDetails) => {
    setJurisdiction({
      ...jurisdiction,
      ...newDetails,
    })
  }

  const updateSubmodel = (id, data) => {
    setJurisdiction({
      ...jurisdiction,
      [id]: data,
    })
  }

  useEffect(() => {
    console.log('changed:', jurisdiction)
  }, [jurisdiction])

  if (!jurisdiction) return null
  return (
    <>
      <Tabs value={tabNum} onChange={(event, newValue) => setTabNum(newValue)}>
        <Tab label="Jurisdiction Details" />
        {SUBMODELS.map(subModel => (
          <Tab key={subModel.tabLabel} label={subModel.tabLabel} />
        ))}
      </Tabs>
      <TabPanel value={tabNum} index={0}>
        <AutoForm
          model={jurisdictionModel}
          initialValues={jurisdiction}
          submitText="Update Jurisdiction"
          onSubmit={(values, funcs) => {
            updateJurisdictionDetails(values)
            funcs.setSubmitting(false)
          }}
          style={{ maxWidth: 400 }}
        />
      </TabPanel>
      {SUBMODELS.map((subModel, idx) => (
        <TabPanel key={subModel.id} value={tabNum} index={idx + 1}>
          <EditTab
            model={subModel.model}
            instances={jurisdiction[subModel.id]}
            displayName={subModel.displayName}
            listKey={subModel.listKey}
            tabLabel={subModel.tabLabel}
            onChange={data => updateSubmodel(subModel.id, data)}
          />
        </TabPanel>
      ))}
      <Paper style={{ padding: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          style={{ margin: 10 }}
          onClick={saveProgress}
          variant="contained"
          color="primary">
          Save Progress
        </Button>
        <Button
          style={{ margin: 10 }}
          onClick={submitForReview}
          variant="contained"
          color="primary">
          Submit for Review
        </Button>
      </Paper>
    </>
  )
}

function EditTab({ model, instances, displayName, tabLabel, listKey, onChange }) {

  const addInstance = (newInstance) => {
    onChange([
      newInstance,
      ...instances,
    ])
  }

  const updateInstance = (newInstance) => {
    const newInstances = instances.map(instance => {
      return instance.id === newInstance.id
        ? newInstance
        : instance
    })
    onChange(newInstances)
  }

  return (
    <>
      <Accordion style={{ marginBottom: 15 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id={`accordion-add-new-${displayName}`}
        >
          Add New {displayName}
        </AccordionSummary>
        <AccordionDetails>
          <AutoForm
            model={model}
            initialValues={null}
            submitText={`Add ${displayName}`}
            onSubmit={(values, funcs) => {
              // console.log(values)
              addInstance(values)
              funcs.setSubmitting(false)
            }}
            style={{ maxWidth: 400 }}
          />
        </AccordionDetails>
      </Accordion>
      <EditTable
        model={model}
        instances={instances}
        tabLabel={tabLabel}
        onChangeInstance={updateInstance}
        onChange={console.log}
      />
    </>
  )
}

export default EditJurisdiction
