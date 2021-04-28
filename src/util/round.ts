import Big from 'big.js'
import { DEFAULT_DECIMALS } from '../constants'

export function round(
  number: number | string | Big,
  decimals: number = DEFAULT_DECIMALS
): string {
  // Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour.
  let bigRoundingMode = 2
  return Big(number).round(decimals, bigRoundingMode).toString()
}

export function roundNumber(
  number: number | string | Big,
  decimals: number = DEFAULT_DECIMALS
): number {
  // Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour.
  let bigRoundingMode = 2
  return Big(number).round(decimals, bigRoundingMode).toNumber()
}
