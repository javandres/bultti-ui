import { toString } from 'lodash'
import { formatISO, isValid } from 'date-fns'

export const strval = (val: any): string => {
  if ((val !== 0 && !val) || isNaN(val)) {
    return ''
  }

  if (val instanceof Date && isValid(val)) {
    return formatISO(val)
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
