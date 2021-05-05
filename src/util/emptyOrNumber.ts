import { numval } from './numval'

export const emptyOrNumber = (val: string | number): string | number => {
  if (typeof val === 'string' && val !== '') {
    let numberValue = numval(val)
    return !isNaN(numberValue) ? numberValue : ''
  }

  if ((val !== 0 && !val) || isNaN(val)) {
    return ''
  }

  return val
}

export const undefinedOrNumber = (val: unknown): number | undefined => {
  if (typeof val === 'string' && val !== '') {
    let numberValue = numval(val, val.includes('.'))
    return !isNaN(numberValue) ? numberValue : undefined
  }

  if (typeof val !== 'number' || (val !== 0 && !val) || isNaN(val)) {
    return undefined
  }

  return val
}
