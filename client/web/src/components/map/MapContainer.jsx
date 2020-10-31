import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import {
  getJurisdiction,
  getStatesWithJurisdictions,

} from 'redux/actions/data'
import { useHistory, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import ResultHeader from '../info/ResultHeader'
import Map from './Map'
import CountyInfo from '../info/CountyInfo'
import ResultDetail from '../info/ResultDetail'
import queryString from 'query-string'

const MapContainer = ({
  data,
  getJurisdiction,
  getStatesWithJurisdictions,
}) => {
  const [countyInfoOpen, setCountyInfoOpen] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const [center, setCenter] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedStateId, setSelectedStateId] = useState('')
  const [selectedJurisdictionId, setSelectedJurisdictionId] = useState('')
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      getStatesWithJurisdictions()
    }
  }, [getStatesWithJurisdictions])

  useEffect(() => {
    const query = queryString.parse(location.search)
    getJurisdiction(query.jid).then(() => {
      if (query.lon && query.lat) setCenter([query.lon, query.lat])
      else setCenter([0,0])
    })
  }, [getJurisdiction, location.search])

  useEffect(() => {
    if (data?.stateData && data?.jurisdictionData) {
      const { stateData, jurisdictionData } = data;
      if (stateData.id) setSelectedStateId(stateData.id.toString())
      if (jurisdictionData.id) setSelectedJurisdictionId(jurisdictionData.id.toString())
    }
  }, [data])
  

  const closeCountyInfo = () => {
    setCountyInfoOpen(false)
  }

  const toggleCountyInfo = () => {
    setCountyInfoOpen(!countyInfoOpen)
  }

  const [resultDetailOpen, setResultDetailOpen] = useState(false)

  const closeResultDetail = () => {
    setResultDetailOpen(false)
  }

  const onSelectLocation = (locationId) => {
    const { locations } = data.jurisdictionData
    const location = locations.find((loc) => loc.id === locationId)

    setSelectedLocation(location)
    setResultDetailOpen(true)
  }

  const onSelectState = (id) => {
    setSelectedJurisdictionId("")
    setSelectedStateId(id)
  }

  const onSelectJurisdiction = (jurisdictionId) => {
    setSelectedJurisdictionId(jurisdictionId)
    // getJurisdiction(jurisdictionId).then(({data}) => {
      // const { jurisdictionData: { id, locations } } = data
      // TODO: replace with jurisdiction central lat/long
      // if (locations.length) {
        // const { geomLatitude, geomLongitude } = locations[0]
        // const query = queryString.stringify({ jid: id, lon: geomLongitude, lat: geomLatitude })
    history.push(`/map?jid=${jurisdictionId}`)
        // setCenter([geomLongitude, geomLatitude])
      // }
    // })

  }

  if (!data || !center) return null
  return (
    <>
      <ResultHeader
        stateData={data.stateData}
        jurisdictionData={data.jurisdictionData}
        states={data.statesWithJurisdictions}
        toggleCountyInfo={toggleCountyInfo}
        selectedStateId={selectedStateId}
        selectedJurisdictionId={selectedJurisdictionId}
        onSelectState={onSelectState}
        onSelectJurisdiction={onSelectJurisdiction}
      />
      <Map
        center={center}
        toggleCountyInfo={toggleCountyInfo}
        onSelectLocation={onSelectLocation}
        history={history}
      />
      <CountyInfo open={countyInfoOpen} close={closeCountyInfo} />
      <ResultDetail
        open={resultDetailOpen}
        close={closeResultDetail}
        data={data}
        location={selectedLocation}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  data: state.data,
})

const mapDispatchToProps = (dispatch) => ({
  getJurisdiction: (jurisdictionId) =>
    dispatch(getJurisdiction(jurisdictionId)),
  getStatesWithJurisdictions: () => dispatch(getStatesWithJurisdictions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)

MapContainer.propTypes = {
  data: PropTypes.object,
}
