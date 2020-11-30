import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as select from 'store/selectors'
import { selectLocation } from 'store/actions'
import Card from './Card'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  card: {
    padding: '12px 10px 10px 0',
    borderRadius: 10,
    userSelect: 'none',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.grey[200],
    }
  },
  divider: {
    margin: '8px 0',
  },
}))

const Cards = ({ locations, selectLocation }) => {
  const classes = useStyles()
  return locations.map((location, index) => (
    <Fragment key={location.id}>
      <div
        className={classes.card}
        onClick={selectLocation.bind(null, location.id)}
      >
        <Card location={location} />
      </div>
      {index !== locations.length - 1 && (
        <Divider className={classes.divider} />
      )}
    </Fragment>
  ))
}

const mapStateToProps = (state) => ({
  locations: select.sortedLocations(state),
})

const mapDispatchToProps = (dispatch) => ({
  selectLocation: (locationId) => dispatch(selectLocation(locationId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Cards)

Cards.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({})),
  selectLocation: PropTypes.func.isRequired,
}

Cards.defaultProps = {
  locations: [],
}
