import { toString } from 'lodash'
import { isValid } from 'date-fns'
import { getDateString } from './formatDate'

export const strval = (val: unknown): string => {
  if ((val !== 0 && !val) || (typeof val === 'number' && isNaN(val))) {
    return ''
  }

  if (val instanceof Date && isValid(val)) {
    return getDateString(val)
  }

  if (Array.isArray(val)) {
    return val.join(',')
  }

  if (typeof val === 'object') {
    return JSON.stringify(val)
  }

  if (typeof val === 'function') {
    return strval(val())
  }

  return toString(val)
}
