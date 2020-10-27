import { format, fromUnixTime, isSameYear, parseISO } from 'date-fns'
import { READABLE_DATE_FORMAT } from '../constants'

type AcceptedDateFormat = Date | string | number

function getDateObject(date: AcceptedDateFormat) {
  if (date instanceof Date) {
    return date
  }

  if (typeof date === 'number') {
    return fromUnixTime(date)
  }

  return parseISO(date)
}

export function readableDate(date: AcceptedDateFormat) {
  let dateObj = getDateObject(date)
  return format(dateObj, READABLE_DATE_FORMAT)
}

export function readableDateRange(startDate: AcceptedDateFormat, endDate: AcceptedDateFormat) {
  let startDateObj = getDateObject(startDate)
  let endDateObj = getDateObject(endDate)

  // Unnecessary to show the year in the first date if both dates are from the same year
  let showYear = !isSameYear(startDateObj, endDateObj)
  let startDateFormat = showYear ? READABLE_DATE_FORMAT : 'dd MMM'

  return `${format(startDateObj, startDateFormat)} - ${format(
    endDateObj,
    READABLE_DATE_FORMAT
  )}`
}
