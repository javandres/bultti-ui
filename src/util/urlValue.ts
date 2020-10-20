import get from 'lodash/get'
import fromPairs from 'lodash/fromPairs'
import toString from 'lodash/toString'
import { createHistory } from '@reach/router'
import { isNumeric } from './isNumeric'
import { numval } from './numval'
import { UIStore } from '../state/UIStore'
import { APP_PATH } from '../constants'
import { useStateValue } from '../state/useAppState'

/**
 * Make sure that all history operations happen through the specific history object
 * created here:
 */
// @ts-ignore
export let history = createHistory(window)

type UrlStateValue = string | boolean | number
type UrlState = { [key: string]: UrlStateValue }
type HistoryListener = (urlState: UrlState) => unknown

const excludeQueryStringParams = ['scope', 'code', 'is_test']

const historyChangeListeners: HistoryListener[] = []

// We want to init a beforeunload listener
window.addEventListener('beforeunload', (event) => {
  event.preventDefault()
  event.returnValue = ''

  console.log('at beforeunload ', event)
  // UIStore.navigationBlockedMessage;
  let [navigationBlockedMessage] = useStateValue('navigationBlockedMessage')
  if (navigationBlockedMessage?.length > 0) {
    console.log('msg was > 0')
    if (window.confirm(navigationBlockedMessage)) {
      // TODO: execute the event that was blocked (user answered yes)
      console.log('should close tab')
    } else {
      // Do nothing
      console.log('do nothing')
    }
  }
})

export const onHistoryChange = (cb) => {
  if (!historyChangeListeners.includes(cb)) {
    historyChangeListeners.push(cb)
  }

  return () => {
    const cbIndex = historyChangeListeners.indexOf(cb)

    if (cbIndex !== -1) {
      historyChangeListeners.splice(cbIndex, 1)
    }
  }
}

history.listen((location) => {
  if (get(location, 'state.allowReactions', false)) {
    const urlState = getUrlState()
    historyChangeListeners.forEach((cb) => cb(urlState))
  }
})

// Only for testing
export const __setHistoryForTesting = (historyObj) => {
  history = historyObj
}

export const navigate = (navigateTo: string, opts?: any) => {
  history.navigate(navigateTo, opts)
}

// Sets or changes an URL value. Use replace by default,
// as we don't need to grow the history stack. We're not
// listening to the url anyway, so going back does nothing.
export const setUrlValue = (key: string, val: UrlStateValue | null) => {
  const query = new URLSearchParams(history.location.search)

  if (val === null || typeof val === 'undefined') {
    query.delete(key)
  } else if (query.has(key)) {
    query.set(key, toString(val))
  } else {
    query.append(key, toString(val))
  }

  const queryStr = query.toString()
  return navigate(`${history.location.pathname}?${queryStr}`)
}

export const getUrlState = (): UrlState => {
  const query = new URLSearchParams(history.location.search)
  return fromPairs(
    Array.from(query.entries()).map(([key, value]) => {
      let nextVal: UrlStateValue = value

      if (value === 'true') {
        nextVal = true
      }

      if (value === 'false') {
        nextVal = false
      }

      if (value === '' || typeof value === 'undefined') {
        nextVal = ''
      }

      if (isNumeric(value)) {
        nextVal = numval(value, value.includes('.'))
      }

      return [key, nextVal]
    })
  )
}

export const getUrlValue = (key: string, defaultValue: UrlStateValue = ''): UrlStateValue => {
  const values = getUrlState()
  return get(values, key, defaultValue)
}

export const getPathName = () => {
  return history.location.pathname
}

export const getAppRoot = () => {
  return `${history.location.origin}${APP_PATH}${APP_PATH !== '/' ? '/' : ''}`
}

export const resetUrlState = (replace = false) => {
  return navigate('/', { replace })
}

function excludeQueryParams(queryString = history.location.search) {
  const query = new URLSearchParams(queryString)

  for (let excludeVal of excludeQueryStringParams) {
    query.delete(excludeVal)
  }

  return query
}

export const pathWithQuery = (path = '', location?: Location | string) => {
  let locationWithQueryString = typeof location === 'string' ? new URL(location) : location

  let currentQuery = excludeQueryParams(locationWithQueryString?.search)
  return `${path}?${currentQuery.toString()}`
}

export const navigateWithQueryString = (navigateTo, opts?: any) => {
  let path = pathWithQuery(navigateTo, history.location)
  return navigate(path, opts)
}
