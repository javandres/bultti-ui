import React from 'react'
import styles from './App.module.scss'
import gql from 'graphql-tag'
import { useQueryData } from './utils/useQueryData'
import { uniqBy } from 'lodash'
import { useAuth } from './utils/useAuth'

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

const App: React.FC = () => {
  useAuth()

  const { data } = useQueryData({ query: vehiclesQuery })
  const arrData = data && Array.isArray(data) ? data : []

  return (
    <div className={styles.App}>
      {uniqBy(arrData, 'id').map((vehicle) => (
        <div key={vehicle.id}>
          <h4>{vehicle.vehicleId}</h4>
        </div>
      ))}
    </div>
  )
}

export default App
