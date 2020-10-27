import { action, extendObservable, observable } from 'mobx'
import { UIActions } from '../type/state'
import { Language } from '../util/translate'
import { Operator, Season } from '../schema-types'
import { operatorIsAuthorized } from '../util/operatorIsAuthorized'
import { setUrlValue } from '../util/urlValue'

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
    errorMessage: '',
    unsavedFormIds: [],
  }

  extendObservable(state, defaultState)

  const setOperatorFilter = action((value: Operator | null) => {
    if (!operatorIsAuthorized(value, state.user)) {
      return
    }

    state.globalOperator = value
    setUrlValue('operator', !value || value.id === 0 ? null : value?.operatorId + '' || '')
  })

  const setSeasonFilter = action((value: Season | string | null) => {
    state.globalSeason = value
    setUrlValue('season', typeof value === 'string' ? value : value?.id || '')
  })

  let prevDismissedMessage = ''

  const setErrorMessage = action((message: string) => {
    // To prevent a loop of messages as the hooks rerender, keep track of the
    // previously dismissed message so that it can't be immediately re-assigned.
    if (!message && state.errorMessage) {
      prevDismissedMessage = state.errorMessage
    }

    if (!(message && prevDismissedMessage && message === prevDismissedMessage)) {
      state.errorMessage = message
      // We just need to break the loop, not prevent all future error messages
      prevDismissedMessage = ''
    }
  })

  const onAppLoaded = action(() => {
    state.appLoaded = true
  })

  const setUnsavedFormIds = action((unsavedFormIds: string[]) => {
    state.unsavedFormIds = unsavedFormIds
  })

  return {
    globalOperator: setOperatorFilter,
    globalSeason: setSeasonFilter,
    appLoaded: onAppLoaded,
    language: setLanguage,
    errorMessage: setErrorMessage,
    unsavedFormIds: setUnsavedFormIds,
  }
}
