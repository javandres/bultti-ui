import parseISO from 'date-fns/parseISO'
import isWithinInterval from 'date-fns/isWithinInterval'

export function findValidItems(
  items,
  startProp = 'startDate',
  endProp = 'endDate',
  compareDate = new Date()
) {
  return items.filter((item) => {
    const startDate = parseISO(item[startProp])
    const endDate = parseISO(item[endProp])

    return isWithinInterval(compareDate, { start: startDate, end: endDate })
  })
}
