import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useAuth } from 'components/use-auth'

import Header from './Header'
import UserJurisdictions from './UserJurisdictions'
import EditJurisdiction from './EditJurisdiction'
import EditLocation from './EditLocation'
import AddLocation from  './AddLocation'
import EditState from './EditState'
import ReviewWIP from './ReviewWIP'
import SearchJurisdictions from './SearchJurisdictions'
import SearchStates from './SearchStates'

function Dashboard() {
  const { user } = useAuth()
  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>
        <Switch>
          <Route exact path='/jurisdictions' component={UserJurisdictions} />
          <Route exact path="/jurisdictions/:jid" component={EditJurisdiction} />
          <Route exact path="/jurisdictions/:jid/locations/:lid" component={EditLocation} />
          <Route exact path="/jurisdictions/:jid/locations/new" component={AddLocation} />
          {user.role === 'admin' && (
            <>
              <Route exact path="/states" component={SearchStates} />
              <Route exact path='/states/:id' component={EditState} />
              <Route exact path='/jurisdictions/search' component={SearchJurisdictions} />
              <Route exact path='/review' component={ReviewWIP} />
              <Redirect to='/jurisdictions' />
            </>
          )}
          <Redirect to='/jurisdictions' />
        </Switch>
      </div>
    </>
  )
}

export default Dashboard
