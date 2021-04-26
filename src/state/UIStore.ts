import { action, extendObservable, observable } from 'mobx'
import { UIActions } from '../type/state'
import { Language } from '../util/translate'
import { Operator, Season } from '../schema-types'
import { operatorIsAuthorized } from '../util/operatorIsAuthorized'
import { setUrlValue } from '../util/urlValue'
import { uniq } from 'lodash'

// Language state is separate because some parts of the app that aren't
// in the scope of the React component tree may want to use it.
export const languageState: { language: Language } = observable({
  language: 'fi',
})

export const setLanguage = action((setTo: Language = 'fi') => {
  languageState.language = setTo
})

export const defaultOperator: Operator = {
  equipment: [],
  equipmentCatalogues: [],
  executionRequirements: [],
  procurementUnits: [],
  id: 0,
  operatorId: 0,
  operatorName: 'Ei valittu',
  inspections: [],
  contracts: [],
}

export const defaultSeason: Season = {
  endDate: '',
  inspections: [],
  startDate: '',
  id: '',
  season: 'Ei valittu',
}

export const UIStore = (state): UIActions => {
  const defaultState = {
    appLoaded: false,
    globalOperator: defaultOperator,
    globalSeason: defaultSeason,
    get language() {
      // proxy separate language state through app state
      return languageState.language
    },
    errorMessages: [],
    infoMessages: [],
    unsavedFormIds: [],
  }

  extendObservable(state, defaultState)

  const setOperatorFilter = action((value: Operator = defaultOperator) => {
    if (!operatorIsAuthorized(value, state.user)) {
      return
    }

    state.globalOperator = value
    setUrlValue('operator', !value || value.id === 0 ? '' : value?.operatorId + '' || '')
  })

  const setSeasonFilter = action((value: Season | string) => {
    state.globalSeason = value
    setUrlValue('season', typeof value === 'string' ? value : value?.id || '')
  })

  type MessageFields = 'errorMessages' | 'infoMessages'

  const createMessageAdd = (stateVal: MessageFields) =>
    action((message: string) => {
      let nextMessages = [...state[stateVal]]
      nextMessages.push(message)
      state[stateVal] = uniq(nextMessages)
    })

  const createMessageRemove = (stateVal: MessageFields) =>
    action((removeIdx) => {
      if (state[stateVal][removeIdx]) {
        let nextMessages = [...state[stateVal]]
        nextMessages.splice(removeIdx, 1)
        state[stateVal] = nextMessages
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
    errorMessages: {
      add: createMessageAdd('errorMessages'),
      remove: createMessageRemove('errorMessages'),
    },
    infoMessages: {
      add: createMessageAdd('infoMessages'),
      remove: createMessageRemove('infoMessages'),
    },
    unsavedFormIds: setUnsavedFormIds,
  }
}
