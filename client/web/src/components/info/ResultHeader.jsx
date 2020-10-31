import React from 'react'
import Dropdown from './Dropdown';
import infoIcon from 'assets/info-icon.svg'

const ResultHeader = ({
  toggleCountyInfo,
  stateData,
  jurisdictionData,
  states,
  selectedStateId,
  selectedJurisdictionId,
  onSelectState,
  onSelectJurisdiction,
}) => (
  <div className="result-header">
    <div>
      <Dropdown
        placeholder="Choose your state"
        onChange={e => onSelectState(e.target.value)}
        selected={selectedStateId || ''}
      >
        {
          states && states.map(state => (
            <option
              className="select-option"
              key={state.name}
              value={state.id}
            >
              {state.name}
            </option>
          ))
        }
      </Dropdown>
      <Dropdown
        placeholder="Choose your jurisdiction"
        onChange={e => onSelectJurisdiction(e.target.value)}
        selected={selectedJurisdictionId}
      >
        {
          (selectedStateId && states) && 
          states
            .find(s => s.id === parseInt(selectedStateId))
            .jurisdictions
            .map(jdx => {
              const { name, id } = jdx;

              return (
                <option
                  className="select-option"
                  key={jdx.name}
                  value={jdx.id}
                >
                  {jdx.name}
                </option>
              )
            })
        }
      </Dropdown>
    {/* </p> */}
    </div>
    <img className="info-icon" src={infoIcon} alt="Information icon" />
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a onClick={toggleCountyInfo}>Important election information</a>
  </div>
)

export default ResultHeader
