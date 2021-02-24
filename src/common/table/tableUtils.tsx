import { FilterConfig, SortConfig } from '../../schema-types'
import { useCallback } from 'react'
import { round } from '../../util/round'
import { format, isValid, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../../constants'
import { toString } from 'lodash'

export type FilteredResponseMeta = {
  filteredCount?: number
  totalCount?: number
}

export interface IFilteredSortedResponse<DataType> {
  rows: DataType[]
  filteredCount: number
  totalCount: number
  filters?: FilterConfig[] | null
  sort?: SortConfig[] | null
}

// Sensible default rendering function for nice looking data.
export function useRenderCellValue() {
  return useCallback((key, val) => {
    if (typeof val === 'boolean' || typeof val === 'undefined' || val === null) {
      return (
        <span
          style={{
            fontSize: '1.2rem',
            marginTop: '-3px',
            display: 'block',
          }}>
          {val ? '✓' : '⨯'}
        </span>
      )
    }

    if (typeof val === 'number') {
      return round(val)
    }

    if (val.length >= 20) {
      let date: Date | undefined

      try {
        let parsedDate = parseISO(val)

        if (isValid(parsedDate)) {
          date = parsedDate
        }
      } catch (err) {
        date = undefined
      }

      if (date) {
        return format(date, READABLE_TIME_FORMAT + ':ss')
      }
    }

    return toString(val)
  }, [])
}
