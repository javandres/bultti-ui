import {
  formatISO,
  isAfter as dateIsAfter,
  isBefore as dateIsBefore,
  isEqual,
  parseISO,
} from 'date-fns'

type ValueType = Date | string | number | undefined | null

export function compareVal(val: ValueType = 0): number {
  if (val === null) {
    return 0
  }

  let strVal = ''

  if (val instanceof Date) {
    strVal = formatISO(val)
  } else {
    strVal = val + ''
  }

  return !strVal ? 0 : parseInt(strVal.replace(/\D/g, ''), 10)
}

export function isBefore(
  value: ValueType,
  otherValue: ValueType,
  inclusive: boolean = false
): boolean {
  if (
    value instanceof Date &&
    (otherValue instanceof Date || typeof otherValue === 'string')
  ) {
    const otherDate = otherValue instanceof Date ? otherValue : parseISO(otherValue)
    return (inclusive && isEqual(value, otherDate)) || dateIsBefore(value, otherDate)
  }

  const checkVal = compareVal(value)
  const otherVal = compareVal(otherValue)

  if (inclusive) {
    return checkVal <= otherVal
  }

  return checkVal < otherVal
}

export function isAfter(
  value: ValueType,
  otherValue: ValueType,
  inclusive: boolean = false
): boolean {
  if (
    value instanceof Date &&
    (otherValue instanceof Date || typeof otherValue === 'string')
  ) {
    const otherDate = otherValue instanceof Date ? otherValue : parseISO(otherValue)
    return (inclusive && isEqual(value, otherDate)) || dateIsAfter(value, otherDate)
  }

  const checkVal = compareVal(value)
  const otherVal = compareVal(otherValue)

  if (inclusive) {
    return checkVal >= otherVal
  }

  return checkVal > otherVal
}

export function isBetween(value: ValueType, start: ValueType, end: ValueType): boolean {
  return isAfter(value, start, true) && isBefore(value, end, true)
}
