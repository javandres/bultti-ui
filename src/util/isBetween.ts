import { formatISO, isAfter as dateIsAfter, isBefore as dateIsBefore, parseISO } from 'date-fns'

type ValueType = Date | string | number

export function compareVal(val: ValueType = 0) {
  let strVal = ''

  if (val instanceof Date) {
    strVal = formatISO(val)
  } else {
    strVal = val + ''
  }

  return !strVal ? 0 : parseInt(strVal.replace(/\D/g, ''), 10)
}

export function isBefore(value: ValueType, otherValue: ValueType): boolean {
  if (value instanceof Date && (otherValue instanceof Date || typeof otherValue === 'string')) {
    const otherDate = otherValue instanceof Date ? otherValue : parseISO(otherValue)
    return dateIsBefore(value, otherDate)
  }

  const checkVal = compareVal(value)
  const otherVal = compareVal(otherValue)
  return checkVal <= otherVal
}

export function isAfter(value: ValueType, otherValue: ValueType): boolean {
  if (value instanceof Date && (otherValue instanceof Date || typeof otherValue === 'string')) {
    const otherDate = otherValue instanceof Date ? otherValue : parseISO(otherValue)
    return dateIsAfter(value, otherDate)
  }

  const checkVal = compareVal(value)
  const otherVal = compareVal(otherValue)
  return checkVal >= otherVal
}

export const isBetween = (value: ValueType, start: ValueType, end: ValueType) => {
  return isAfter(value, start) && isBefore(value, end)
}
