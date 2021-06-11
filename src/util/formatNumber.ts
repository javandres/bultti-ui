import Big from 'big.js'

export function getThousandSeparatedNumber(input: Big | number | string): string {
  return Big(input).toNumber().toLocaleString('fi-FI')
}
