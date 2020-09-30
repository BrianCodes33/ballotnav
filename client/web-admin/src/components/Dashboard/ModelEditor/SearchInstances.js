import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import usePath from './use-path'
import api from 'services/api'
import { List, ListItem, ListItemText } from '@material-ui/core'

function SearchInstances() {
  const { pathname, model } = usePath()
  const [instances, setInstances] = useState(null)
  const history = useHistory()

  useEffect(() => {
    api.models.listInstances(model.name).then(instances => {
      setInstances(instances)
    })
  }, [model.name])

  if (!instances) return null
  return (
    <List>
      {instances.map((instance) => (
        <ListItem
          key={instance.id}
          button
          onClick={() => history.push(`${pathname}/${instance.id}`)}
        >
          <ListItemText primary={instance.name} />
        </ListItem>
      ))}
    </List>
  )
}

export default SearchInstances