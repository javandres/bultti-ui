import { get, merge } from 'lodash'

const envObj = merge({}, process.env, get(window, '_ENV', {}))

export const SERVER_URL = envObj.REACT_APP_SERVER_URL || 'http://localhost:4100'
export const GRAPHQL_PATH = envObj.REACT_APP_GRAPHQL_PATH || '/graphql'
export const CLIENT_ID = envObj.REACT_APP_CLIENT_ID
export const REDIRECT_URI = envObj.REACT_APP_REDIRECT_URI
export const AUTH_SCOPE = envObj.REACT_APP_AUTH_SCOPE
export const AUTH_URI = envObj.REACT_APP_AUTH_URI
export const ALLOW_DEV_LOGIN = envObj.REACT_APP_ALLOW_DEV_LOGIN === 'true'
export const DATE_FORMAT = 'yyyy-MM-dd'
export const READABLE_TIME_FORMAT = 'dd MMM yyyy, HH:mm'
export const READABLE_DATE_FORMAT = 'dd MMM yyyy'
export const ENV = envObj.NODE_ENV || 'production'
export const APP_PATH = '/'
export const DEBUG = envObj.REACT_APP_DEBUG === 'true' || false

export const normalDayTypes = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']

function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div')

  if (!outer) {
    return 0
  }

  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // forcing scrollbar to appear
  document.body.appendChild(outer)

  // Creating inner element and placing it in the container
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  if (outer.parentNode) {
    // Removing temporary elements from the DOM
    outer.parentNode?.removeChild(outer)
  }

  return scrollbarWidth
}

export const SCROLLBAR_WIDTH = getScrollbarWidth() + 1
export const DEFAULT_DECIMALS = 1
export const DEFAULT_PERCENTAGE_DECIMALS = 2
