import { lightFormat } from 'date-fns'

export const toISODate = (date: Date) => {
  return lightFormat(date, 'yyyy-MM-dd')
}
