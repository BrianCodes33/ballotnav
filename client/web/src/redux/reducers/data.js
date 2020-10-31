export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_JURISDICTION_SUCCESS':
      return {
        ...state,
        ...action.data,
      }
    case 'GET_STATES_AND_JURISDICTIONS_SUCCESS':
      return {
        ...state,
        statesWithJurisdictions: action.payload,
      }
    default:
      return state
  }
}
