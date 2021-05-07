export function orderByNumber(
  val: string | number | [string, unknown] | [number, unknown]
): number {
  let useVal: string | number

  if (Array.isArray(val)) {
    useVal = val[0]
  } else {
    useVal = val
  }

  return typeof useVal === 'number' ? useVal : parseInt(useVal, 10)
}
