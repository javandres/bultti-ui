import React from 'react'
import styles from './App.module.scss'
import gql from 'graphql-tag'
import { useQueryData } from './utils/useQueryData'
import { uniqBy } from 'lodash'

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
  const { data } = useQueryData({ query: vehiclesQuery })
  const arrData = data && Array.isArray(data) ? data : []

  const duplicates = arrData.reduce((duplicates, vehicle, idx, arr) => {
    const isDuplicate = arr.filter((v) => v.id === vehicle.id).length > 1

    if (isDuplicate) {
      duplicates.push(vehicle)
    }

    return duplicates
  }, [])

  console.log(duplicates)

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
