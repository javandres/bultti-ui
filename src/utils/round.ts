export function floor(number: number): number {
  return Math.floor(number * 1000) / 1000;
}

// Round up to three decimals
export function ceil(number: number): number {
  return Math.ceil(number * 1000) / 1000;
}

// Round to three decimals
export function round(number: number): number {
  return Math.round(number * 1000) / 1000;
}
