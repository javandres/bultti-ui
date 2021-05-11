import get from 'lodash/get'
import fromPairs from 'lodash/fromPairs'
import toString from 'lodash/toString'
import { isNumeric } from './isNumeric'
import { numval } from './numval'
import { useHistory } from 'react-router-dom'
import { History } from 'history'
import { useCallback } from 'react'

type UrlStateValue = string | boolean | number
type UrlState = { [key: string]: UrlStateValue }

// Sets or changes an URL value. Use replace by default,
// as we don't need to grow the history stack. We're not
// listening to the url anyway, so going back does nothing.
export function setUrlValue(history: History, key: string, val: UrlStateValue | null) {
  const query = new URLSearchParams(history.location.search)

  if (val === null || typeof val === 'undefined') {
    query.delete(key)
  } else if (query.has(key)) {
    query.set(key, toString(val))
  } else {
    query.append(key, toString(val))
  }

  const queryStr = query.toString()
  return history.replace(`${history.location.pathname}?${queryStr}`)
}

export function getUrlState(history: History): UrlState {
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

export function getUrlValue(
  history: History,
  key: string,
  defaultValue: UrlStateValue = ''
): UrlStateValue {
  const values = getUrlState(history)
  return get(values, key, defaultValue)
}

const excludeQueryStringParams = ['scope', 'code', 'is_test']

function excludeQueryParams(queryString = window.location.search) {
  const query = new URLSearchParams(queryString)

  for (let excludeVal of excludeQueryStringParams) {
    query.delete(excludeVal)
  }

  return query
}

interface HasQueryString {
  search: string
}

// Provide a Location object with a `search` param or the full URL with the query string.
export function pathWithQuery(path = '', location?: HasQueryString | string) {
  let locationWithQueryString = typeof location === 'string' ? new URL(location) : location

  let currentQuery = excludeQueryParams(locationWithQueryString?.search)
  return `${path}?${currentQuery.toString()}`
}

function navigateTo({ replace, history }: { replace: boolean; history: History }) {
  return (to: string) => {
    let path = pathWithQuery(to, history.location)

    if (replace) {
      history.replace(path)
    } else {
      history.push(path)
    }
  }
}

export function useNavigate() {
  let history = useHistory()

  return {
    push: useCallback(navigateTo({ replace: false, history }), []),
    replace: useCallback(navigateTo({ replace: true, history }), []),
  }
}
