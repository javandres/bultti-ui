import { action, extendObservable } from 'mobx'
import { UIActions } from '../type/state'
import { translate } from '../util/translate'
import { Operator, Season } from '../schema-types'
import { operatorIsAuthorized } from '../util/operatorIsAuthorized'
import { setUrlValue } from '../util/urlValue'
import { uniq } from 'lodash'
import { languageState, setLanguage } from './languageState'

export const unselectedOperator: Operator = {
  equipment: [],
  equipmentCatalogues: [],
  executionRequirements: [],
  procurementUnits: [],
  id: 0,
  operatorId: 0,
  operatorName: translate('unselected', languageState.language),
  inspections: [],
  contracts: [],
}

export const unselectedSeason: Season = {
  endDate: '',
  inspections: [],
  startDate: '',
  id: translate('unselected', languageState.language),
  season: '',
}

export const UIStore = (state): UIActions => {
  const defaultState = {
    appLoaded: false,
    globalOperator: unselectedOperator,
    globalSeason: unselectedSeason,
    get language() {
      // proxy separate language state through app state
      return languageState.language
    },
    errorMessages: [],
    infoMessages: [],
    unsavedFormIds: [],
  }

  extendObservable(state, defaultState)

  const setOperatorFilter = action((value: Operator | null = unselectedOperator) => {
    if (!operatorIsAuthorized(value, state.user)) {
      return
    }

    let setValue = value || unselectedOperator
    state.globalOperator = setValue

    setUrlValue(
      'operator',
      !setValue || setValue.id === 0 ? '' : setValue?.operatorId + '' || ''
    )
  })

  const setSeasonFilter = action((value: Season | null = unselectedSeason) => {
    let setValue = value || unselectedSeason
    state.globalSeason = setValue
    setUrlValue('season', setValue?.id || '')
  })

  type MessageFields = 'errorMessages' | 'infoMessages'

  const createMessageAdd = (stateVal: MessageFields) =>
    action((message: string) => {
      let nextMessages = [...state[stateVal]]
      nextMessages.push(message)
      state[stateVal] = uniq(nextMessages)
    })

  const createMessageRemove = (stateVal: MessageFields) =>
    action((message: string | number) => {
      let removeIdx = typeof message === 'number' ? message : state[stateVal].indexOf(message)

      if (removeIdx !== -1 && state[stateVal][removeIdx]) {
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
