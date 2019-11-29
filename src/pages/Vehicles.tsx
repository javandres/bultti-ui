import React from 'react'
import { observer } from 'mobx-react-lite'
import gql from 'graphql-tag'
import { useQueryData } from '../utils/useQueryData'
import TestComponent from '../TestComponent'
import { useStateValue } from '../state/useAppState'
import { uniqBy } from 'lodash'
import { Link, RouteComponentProps } from '@reach/router'
import { Page } from '../components/common'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

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

const Vehicles: React.FC<PropTypes> = observer((props) => {
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
    <Page>
      <TestComponent />
      {filteredVehicles.map((vehicle) => (
        <div key={vehicle.id}>
          <h4>{vehicle.vehicleId}</h4>
        </div>
      ))}
    </Page>
  )
})

export default Vehicles
