import { action, extendObservable, observable } from 'mobx'
import { UIActions } from '../types/state'
import { Language } from '../utils/translate'
import { Operator, Season } from '../schema-types'

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
    globalOperator: null,
    globalSeason: null,
    get language() {
      // proxy separate language state through app state
      return languageState.language
    },
  }

  extendObservable(state, defaultState)

  const setOperatorFilter = action((value: Operator | null) => {
    state.globalOperator = value
  })

  const setSeasonFilter = action((value: Season | null) => {
    state.globalSeason = value
  })

  const onAppLoaded = action(() => {
    state.appLoaded = true
  })

  return {
    globalOperator: setOperatorFilter,
    globalSeason: setSeasonFilter,
    appLoaded: onAppLoaded,
    language: setLanguage,
  }
}
