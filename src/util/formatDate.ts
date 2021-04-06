import { format, fromUnixTime, Interval, isSameYear, parseISO } from 'date-fns'
import { DATE_FORMAT, READABLE_DATE_FORMAT } from '../constants'

type AcceptedDateFormat = Date | string | number // string has to in format of DATE_FORMAT

export function getDateObject(date: AcceptedDateFormat): Date {
  if (date instanceof Date) {
    return date
  }

  if (typeof date === 'number') {
    return fromUnixTime(date)
  }

  return parseISO(date)
}

export function getReadableDate(date: AcceptedDateFormat): string {
  let dateObj = getDateObject(date)
  return format(dateObj, READABLE_DATE_FORMAT)
}

export function getReadableDateRange(dateRange: Interval): string {
  let startDateObj = getDateObject(dateRange.start)
  let endDateObj = getDateObject(dateRange.end)

  // Unnecessary to show the year in the first date if both dates are from the same year
  let showYear = !isSameYear(startDateObj, endDateObj)
  let startDateFormat = showYear ? READABLE_DATE_FORMAT : 'dd MMM'

  return `${format(startDateObj, startDateFormat)} - ${format(
    endDateObj,
    READABLE_DATE_FORMAT
  )}`
}

export function getDateString(date: AcceptedDateFormat): string {
  return format(getDateObject(date), DATE_FORMAT)
}
