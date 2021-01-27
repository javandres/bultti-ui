import { useQueryData } from './useQueryData'
import { seasonsQuery } from '../common/query/seasonsQuery'
import { startOfYear, subYears } from 'date-fns'
import { Season } from '../schema-types'
import { getDateString } from './formatDate'

const currentDate = new Date()

export function useSeasons(): Season[] {
  // Get seasons to display in the seasons select.
  const { data: seasonsData } = useQueryData(seasonsQuery, {
    variables: {
      date: getDateString(startOfYear(subYears(currentDate, 5))),
    },
  })

  return seasonsData || []
}
