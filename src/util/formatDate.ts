import { format, fromUnixTime, isSameYear, parseISO } from 'date-fns'
import { DATE_FORMAT, READABLE_DATE_FORMAT } from '../constants'

type AcceptedDateFormat = Date | string | number

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

export function getReadableDateRange({
  start,
  end,
}: {
  start: AcceptedDateFormat
  end: AcceptedDateFormat
}): string {
  let startDateObj = getDateObject(start)
  let endDateObj = getDateObject(end)

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
