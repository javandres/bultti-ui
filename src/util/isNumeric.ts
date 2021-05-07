export const isNumeric = (value: unknown) => {
  if (typeof value === 'number') {
    return true
  }

  if (typeof value === 'string') {
    return !isNaN(parseInt(value, 10)) || !isNaN(parseFloat(value))
  }

  return false
}
