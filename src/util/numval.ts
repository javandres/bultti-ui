export const numval = (val: string | number, float: boolean = false): number => {
  if (!val) {
    return 0
  }

  if (typeof val === 'string') {
    return float ? parseFloat(val) : parseInt(val, 10)
  }

  return val
}
