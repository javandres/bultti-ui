import Big from 'big.js'

export function getTotalBig<T, Name extends keyof T>(collection: T[], propName: Name): Big {
  return collection.reduce((total: Big, item: T) => {
    let propValue = item[propName]

    if (typeof propValue !== 'number' && typeof propValue !== 'string') {
      return total
    }

    return total.plus(propValue)
  }, Big('0'))
}

export function getTotal<T, Name extends keyof T>(collection: T[], propName: Name): string {
  return getTotalBig(collection, propName).toString()
}

export function getTotalNumbers(numbers: Array<number | string>) {
  return numbers.reduce((total: number, num) => {
    let numVal

    if (typeof num === 'number') {
      numVal = num
    } else {
      numVal = parseInt(num, 10)

      if (isNaN(numVal)) {
        numVal = 0
      }
    }

    return total + numVal
  }, 0)
}
