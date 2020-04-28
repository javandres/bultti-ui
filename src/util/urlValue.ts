import get from 'lodash/get'
import fromPairs from 'lodash/fromPairs'
import toString from 'lodash/toString'
import { createHistory } from '@reach/router'
import { isNumeric } from './isNumeric'
import { numval } from './numval'

/**
 * Make sure that all history operations happen through the specific history object
 * created here:
 */
// @ts-ignore
export let history = createHistory(window)

type UrlStateValue = string | boolean | number
type UrlState = { [key: string]: UrlStateValue }
type HistoryListener = (urlState: UrlState) => unknown

const historyChangeListeners: HistoryListener[] = []

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
  history.navigate(`${history.location.pathname}?${queryStr}`)
}

export const navigateWithQueryString = (navigateTo, opts?: any) => {
  return history.navigate(`${navigateTo}${history.location.search}`, opts)
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

export const resetUrlState = (replace = false) => {
  history.navigate('/', { replace })
}

// Used in Router Link to= props to retain the query path when clicking the link.
export const pathWithQuery = (path = '', location = history.location) => {
  let currentQuery = location.search
  return path + currentQuery
}
