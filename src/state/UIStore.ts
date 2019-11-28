import { action, extendObservable } from 'mobx'
import { UIActions } from '../types/state'

export const UIStore = (state): UIActions => {
  const defaultState = {
    appLoaded: false,
    vehicleFilter: '',
  }

  extendObservable(state, defaultState)

  const setVehicleFilter = action((value) => {
    state.vehicleFilter = value
  })

  const onAppLoaded = action(() => {
    state.appLoaded = true
  })

  return {
    vehicleFilter: setVehicleFilter,
    appLoaded: onAppLoaded,
  }
}
