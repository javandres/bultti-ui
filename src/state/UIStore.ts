import { action, extendObservable } from 'mobx'
import { UIActions, UINotification } from '../type/state'
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
  operatorId: 0,
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

export const UIStore = (state): UIActions => {
  const defaultState = {
    appLoaded: false,
    globalOperator: unselectedOperator,
    globalSeason: unselectedSeason,
    get language() {
      // proxy separate language state through app state
      return languageState.language
    },
    notifications: [],
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
    state.globalSeason = value || unselectedSeason
    setUrlValue('season', value?.id === unselectedSeason.id ? '' : value?.id || '')
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
    notifications: {
      add: addNotification,
      remove: removeNotification,
    },
    unsavedFormIds: setUnsavedFormIds,
  }
}
