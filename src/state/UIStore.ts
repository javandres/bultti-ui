import { action, extendObservable, observable } from 'mobx'
import { UIActions } from '../types/state'
import { Language } from '../utils/translate'

// Language state is separate because some parts of the app that aren't
// in the scope of the React component tree may want to use it.
export const languageState: { language: Language } = observable({
  language: 'fi',
})

export const setLanguage = action((setTo: Language = 'fi') => {
  languageState.language = setTo
})

export const UIStore = (state): UIActions => {
  const defaultState = {
    appLoaded: false,
    vehicleFilter: '',
    get language() {
      // proxy separate language state through app state
      return languageState.language
    },
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
    language: setLanguage,
  }
}
