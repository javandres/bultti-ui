import { useQueryData } from './useQueryData'
import { seasonsQuery } from '../common/query/seasonsQuery'
import { format, startOfYear, subYears } from 'date-fns'
import { DATE_FORMAT } from '../constants'
import { Season } from '../schema-types'

const currentDate = new Date()

export function useSeasons(): Season[] {
  // Get seasons to display in the seasons select.
  const { data: seasonsData } = useQueryData(seasonsQuery, {
    variables: {
      date: format(startOfYear(subYears(currentDate, 5)), DATE_FORMAT),
    },
  })

  return seasonsData || []
}
