import { action, extendObservable } from 'mobx'

export const UIStore = (state) => {
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
