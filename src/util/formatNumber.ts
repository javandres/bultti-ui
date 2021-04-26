export const getThousandSeparatedNumber = (input: number | string): string => {
  let numberInput = typeof input === 'string' ? parseFloat(input) : input

  return numberInput.toLocaleString().replace(',', ' ')
}
