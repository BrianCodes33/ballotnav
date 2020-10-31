import api from 'services/api'

export function getJurisdiction(jurisdictionId) {
  return (dispatch) => {
    return api.getJurisdiction(jurisdictionId).then((data) =>
      dispatch({
        type: 'GET_JURISDICTION_SUCCESS',
        data,
      })
    )
  }
}

export function getStatesWithJurisdictions() {
  return (dispatch) => {
    return api.getStatesWithJurisdictions().then(payload => {
      dispatch({
        type: 'GET_STATES_AND_JURISDICTIONS_SUCCESS',
        payload,
      })
    })
  }
};
