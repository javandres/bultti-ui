import React from 'react'
import styles from './App.module.scss'
import gql from 'graphql-tag'
import { useQueryData } from './utils/useQueryData'
import { uniqBy } from 'lodash'
import { useAuth } from './utils/useAuth'
import { useStateValue } from './state/useAppState'
import TestComponent from './TestComponent'
import { observer } from 'mobx-react-lite'

const vehiclesQuery = gql`
  query listVehicles {
    vehicles {
      id
      age
      emissionClass
      emissionDesc
      exteriorColor
      operator {
        operatorId
        operatorName
      }
      registryNr
      routes {
        area
        contract {
          id
        }
      }
      type
      vehicleId
    }
  }
`

const App: React.FC = observer(() => {
  useAuth()
  const [vehicleFilter] = useStateValue('vehicleFilter')

  const { data } = useQueryData({ query: vehiclesQuery })
  const arrData = data && Array.isArray(data) ? data : []

  let filteredVehicles = uniqBy(arrData, 'id')

  if (vehicleFilter) {
    filteredVehicles = filteredVehicles.filter((vehicle) =>
      vehicle.vehicleId.includes(vehicleFilter)
    )
  }

  return (
    <div className={styles.App}>
      <TestComponent />
      {filteredVehicles.map((vehicle) => (
        <div key={vehicle.id}>
          <h4>{vehicle.vehicleId}</h4>
        </div>
      ))}
    </div>
  )
})

export default App
