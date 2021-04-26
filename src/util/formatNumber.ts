import Big from 'big.js'

export const getThousandSeparatedNumber = (input: number | string): string => {
  let numberInput = typeof input === 'string' ? parseFloat(input) : input

  return numberInput.toLocaleString().replace(',', ' ')
}

export const getThousandSeparatedNumberBig = (input: Big): string => {
  return getThousandSeparatedNumber(input.toFixed())
}
