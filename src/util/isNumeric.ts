export const isNumeric = (value: string | number) => {
  return value != null && value !== '' && !isNaN(Number(value.toString()))
}
