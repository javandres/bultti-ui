export function getTotal<T, Name extends keyof T>(collection: T[], propName: Name): number {
  return collection.reduce((total: number, item: T) => {
    let propValue = item[propName]

    if (typeof propValue !== 'number') {
      return total
    }

    total += propValue
    return total
  }, 0)
}
