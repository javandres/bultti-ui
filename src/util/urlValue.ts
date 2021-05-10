import get from 'lodash/get'
import fromPairs from 'lodash/fromPairs'
import toString from 'lodash/toString'
import { isNumeric } from './isNumeric'
import { numval } from './numval'
import { createBrowserHistory, Location } from 'history'

/**
 * Make sure that all history operations happen through the specific history object
 * created here:
 */
export const history = createBrowserHistory(window)

type UrlStateValue = string | boolean | number
type UrlState = { [key: string]: UrlStateValue }
type HistoryListener = (urlState: UrlState) => unknown

const excludeQueryStringParams = ['scope', 'code', 'is_test']

const historyChangeListeners: HistoryListener[] = []

export function onHistoryChange(cb) {
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

export function navigate(navigateTo: string, useReplace: boolean = false) {
  if (useReplace) {
    history.replace(navigateTo)
  } else {
    history.push(navigateTo)
  }
}

// Sets or changes an URL value. Use replace by default,
// as we don't need to grow the history stack. We're not
// listening to the url anyway, so going back does nothing.
export function setUrlValue(key: string, val: UrlStateValue | null) {
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

export function getUrlState(): UrlState {
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

export function getUrlValue(key: string, defaultValue: UrlStateValue = ''): UrlStateValue {
  const values = getUrlState()
  return get(values, key, defaultValue)
}

export function getPathName() {
  return history.location.pathname
}

function excludeQueryParams(queryString = history.location.search) {
  const query = new URLSearchParams(queryString)

  for (let excludeVal of excludeQueryStringParams) {
    query.delete(excludeVal)
  }

  return query
}

// Provide a Location object with a `search` param or the full URL with the query string.
export function pathWithQuery(path = '', location?: Location | string) {
  let locationWithQueryString = typeof location === 'string' ? new URL(location) : location

  let currentQuery = excludeQueryParams(locationWithQueryString?.search)
  return `${path}?${currentQuery.toString()}`
}

/**
 * @param navigateTo
 * @param {Object} opts - Optional options
 * @returns {void}
 */
export function navigateWithQueryString(
  navigateTo: string,
  opts: { replace: boolean } = { replace: false }
) {
  let path = pathWithQuery(navigateTo, history.location)
  return navigate(path, opts.replace)
}
