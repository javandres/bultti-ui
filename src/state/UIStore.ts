import { action, extendObservable } from 'mobx'
import { Initializer, UIActions, UINotification } from '../type/state'
import { translate } from '../util/translate'
import { Operator, Season } from '../schema-types'
import { operatorIsAuthorized } from '../util/operatorIsAuthorized'
import { setUrlValue } from '../util/urlValue'
import { uniqBy } from 'lodash'
import { languageState, setLanguage } from './languageState'

export const unselectedOperator: Operator = {
  equipment: [],
  equipmentCatalogues: [],
  procurementUnits: [],
  id: 0,
  operatorIds: [0],
  operatorName: translate('unselected', languageState.language),
  preInspections: [],
  postInspections: [],
  contracts: [],
}

export const unselectedSeason: Season = {
  endDate: '',
  preInspections: [],
  postInspections: [],
  startDate: '',
  id: translate('unselected', languageState.language),
  season: '',
}

export const UIStore: Initializer = (state, initialState, history): UIActions => {
  const defaultState = {
    globalOperator: unselectedOperator,
    globalSeason: unselectedSeason,
    get language() {
      // proxy separate language state through app state
      return languageState.language
    },
    notifications: [],
  }

  extendObservable(state, defaultState)

  const setOperatorFilter = action((value: Operator | null = unselectedOperator) => {
    if (!operatorIsAuthorized(value, state.user)) {
      return
    }

    let setValue = value || unselectedOperator
    state.globalOperator = setValue

    setUrlValue(
      history,
      'operator',
      !setValue || setValue.id === 0 ? '' : setValue?.id + '' || ''
    )
  })

  const setSeasonFilter = action((value: Season | null = unselectedSeason) => {
    state.globalSeason = value || unselectedSeason
    setUrlValue(history, 'season', value?.id === unselectedSeason.id ? '' : value?.id || '')
  })

  const addNotification = action((message: UINotification) => {
    let nextMessages = [...state.notifications]
    nextMessages.push(message)
    state.notifications = uniqBy(nextMessages, (notif) => `${notif.message} ${notif.type}`)
  })

  const removeNotification = action((message: UINotification | number) => {
    let removeIdx =
      typeof message === 'number' ? message : state.notifications.indexOf(message)

    if (removeIdx !== -1 && state.notifications[removeIdx]) {
      let nextMessages = [...state.notifications]
      nextMessages.splice(removeIdx, 1)
      state.notifications = nextMessages
    }
  })

  return {
    globalOperator: setOperatorFilter,
    globalSeason: setSeasonFilter,
    language: setLanguage,
    notifications: {
      add: addNotification,
      remove: removeNotification,
    },
  }
}
