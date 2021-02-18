import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { FilterConfig, PageConfig, SortConfig } from '../../schema-types'

export type SetCurrentPagePropTypes = {
  setToPage?: number
  offset?: number
  maxPages: number
}

export type TableStateType = {
  filters: FilterConfig[]
  setFilters: Dispatch<SetStateAction<FilterConfig[]>>
  page: PageConfig
  setPage: Dispatch<SetStateAction<PageConfig>>
  setPageSize: (pageSize: number) => void
  setCurrentPage: (props: SetCurrentPagePropTypes) => void
  sort: SortConfig[]
  setSort: Dispatch<SetStateAction<SortConfig[]>>
}

export const pageSizeOptions = [10, 20, 30, 50, 100]

export const defaultPageConfig = {
  page: 1,
  pageSize: pageSizeOptions[0],
}

export let defaultTableStateValue = {
  filters: [],
  setFilters: () => {},
  page: defaultPageConfig,
  setPage: () => {},
  sort: [],
  setSort: () => {},
}

export function useTableState() {
  let [filters, setFilters] = useState<FilterConfig[]>([])
  let [sort, setSort] = useState<SortConfig[]>([])
  let [page, setPage] = useState<PageConfig>(defaultPageConfig)

  let setPageSize = useCallback((pageSizeIdx: number) => {
    let nextPageSize = pageSizeOptions[pageSizeIdx] || pageSizeOptions[0]

    setPage((currentPageVal) => ({
      ...currentPageVal,
      pageSize: nextPageSize,
    }))
  }, [])

  let setCurrentPage = useCallback(
    ({ setToPage, offset, maxPages = 1 }: SetCurrentPagePropTypes) => {
      setPage((currentPageVal) => {
        let nextPageValue = currentPageVal.page
        let attemptPageValue = currentPageVal.page
        let useMaxPages = Math.max(maxPages, 1) // No sense for it to be under 0

        if (typeof setToPage !== 'undefined') {
          attemptPageValue = Math.max(setToPage, 1)
          nextPageValue = Math.min(attemptPageValue, useMaxPages)

          // Not logical to set both
          if (typeof offset !== 'undefined') {
            console.warn('setToPage and offset is defined, offset will be ignored.')
          }
        } else if (typeof offset !== 'undefined') {
          attemptPageValue = Math.max(currentPageVal.page + offset, 1)
          nextPageValue = Math.min(attemptPageValue, useMaxPages)
        }

        // Warn if attempted to set a larger page number than there are pages.
        if (attemptPageValue > useMaxPages) {
          console.warn(
            `Attempted to set page ${attemptPageValue} on a table with only ${useMaxPages} pages.`
          )
        }

        return {
          ...currentPageVal,
          page: nextPageValue,
        }
      })
    },
    []
  )

  let stateValue: TableStateType = {
    filters,
    setFilters,
    page,
    setPage,
    setPageSize,
    setCurrentPage,
    sort,
    setSort,
  }

  return stateValue
}
