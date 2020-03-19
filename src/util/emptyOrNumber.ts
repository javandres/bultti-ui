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
