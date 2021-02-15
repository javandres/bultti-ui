import { FilterConfig, PageConfig, SortConfig } from '../../schema-types'
import { useCallback } from 'react'
import { round } from '../../util/round'
import { format, isValid, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../../constants'
import { toString } from 'lodash'

export interface FilteredPagedSortedResponse<DataType> {
  rows: DataType[]
  filteredCount: number
  totalCount: number
  pages: number
  page?: PageConfig
  filters?: FilterConfig[]
  sort?: SortConfig[]
}

export type PageState = {
  pages: number
  totalCount: number
  filteredCount: number
  pageSize: number
  itemsOnPage: number
  currentPage: number
}

// It really doesn't matter for this component what the datatype is.
export function createPageState<DataType = unknown>(
  pagedResponse: FilteredPagedSortedResponse<DataType>
) {
  return {
    totalCount: pagedResponse.totalCount || 0,
    pages: pagedResponse.pages || 0,
    filteredCount: pagedResponse.filteredCount || pagedResponse.totalCount || 0,
    currentPage: pagedResponse.page?.page || 0,
    pageSize: pagedResponse.page?.pageSize || 0,
    itemsOnPage: pagedResponse.rows?.length,
  }
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
