import Big from 'big.js'

export function getTotal<T, Name extends keyof T>(collection: T[], propName: Name): string {
  let reduced: Big = collection.reduce((total: Big, item: T) => {
    let propValue = item[propName]

    if (typeof propValue !== 'number') {
      return total
    }

    return total.plus(propValue)
  }, Big('0'))

  return reduced.toString()
}
