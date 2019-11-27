import { action, extendObservable } from 'mobx'
import { UIActions } from '../types/state'

export const UIStore = (state): UIActions => {
  const defaultState = {
    vehicleFilter: '',
  }

  extendObservable(state, defaultState)

  const setVehicleFilter = action((value) => {
    state.vehicleFilter = value
  })

  return {
    vehicleFilter: setVehicleFilter,
  }
}
