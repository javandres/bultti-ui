import get from 'lodash/get'
import invoke from 'lodash/invoke'
import fromPairs from 'lodash/fromPairs'
import toString from 'lodash/toString'
import { globalHistory } from '@reach/router'

/**
 * Make sure that all history operations happen through the specific history object
 * created here:
 */
let history = globalHistory

type UrlStateValue = string | boolean | null
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
export const setUrlValue = (key: string, val: UrlStateValue) => {
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

export const getUrlState = (): UrlState => {
  const query = new URLSearchParams(history.location.search)
  return fromPairs(
    Array.from(query.entries()).map(([key, value]) => {
      let nextVal: string | boolean | number = value

      if (value === 'true') {
        nextVal = true
      }

      if (value === 'false') {
        nextVal = false
      }

      if (value === '' || typeof value === 'undefined') {
        nextVal = ''
      }

      return [key, nextVal]
    })
  )
}

export const getUrlValue = (key: string, defaultValue: UrlStateValue = ''): UrlStateValue => {
  const values = getUrlState()
  return get(values, key, defaultValue)
}

export const setPathName = (pathName, historyAction = 'replace') => {
  invoke(history, historyAction, {
    pathname: pathName,
    search: history.location.search,
  })
}

export const getPathName = () => {
  return history.location.pathname
}

export const resetUrlState = (replace = false) => {
  history.navigate('/', { replace })
}
