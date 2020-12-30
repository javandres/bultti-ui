import Big from 'big.js'

// Round to three decimals
export function round(number: number | string | Big, decimals: number = 3): string {
  return Big(number).round(decimals, 2).toString()
}
