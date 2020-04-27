import { toString } from 'lodash'
import { format, isValid } from 'date-fns'
import { DATE_FORMAT } from '../constants'

export const strval = (val: any): string => {
  if ((val !== 0 && !val) || (typeof val === 'number' && isNaN(val))) {
    return ''
  }

  if (val instanceof Date && isValid(val)) {
    return format(val, DATE_FORMAT)
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
