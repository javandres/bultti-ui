import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStateValue } from './state/useAppState'

const TestComponent = observer((props) => {
  const [vehicleFilter, setVehicleFilter] = useStateValue('vehicleFilter')

  return (
    <div>
      <input
        type="text"
        value={vehicleFilter || ''}
        onChange={(e) => setVehicleFilter(e.target.value)}
      />
    </div>
  )
})

export default TestComponent
