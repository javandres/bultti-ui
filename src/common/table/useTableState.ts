import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { FilterConfig, PageConfig, SortConfig } from '../../schema-types'

export type SetCurrentPagePropTypes = {
  setToPage?: number
  offset?: number
  maxPages?: number
}

export type TablePagingStateType = {
  page: PageConfig
  setPage: Dispatch<SetStateAction<PageConfig>>
  setPageSize: (pageSize: number) => void
  setCurrentPage: (props: SetCurrentPagePropTypes) => void
}

export type TableStateType = {
  filters: FilterConfig[]
  setFilters: Dispatch<SetStateAction<FilterConfig[]>>
  sort: SortConfig[]
  setSort: Dispatch<SetStateAction<SortConfig[]>>
} & TablePagingStateType

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
  setPageSize: () => {},
  setCurrentPage: () => {},
  sort: [],
  setSort: () => {},
}

export function usePagingState(): TablePagingStateType {
  let [page, setPage] = useState<PageConfig>(defaultPageConfig)

  let setPageSize = useCallback((pageSizeIdx: number) => {
    let nextPageSize = pageSizeOptions[pageSizeIdx] || pageSizeOptions[0]

    setPage((currentPageVal) => ({
      ...currentPageVal,
      pageSize: nextPageSize,
    }))
  }, [])

  let setCurrentPage = useCallback(
    ({ setToPage, offset, maxPages }: SetCurrentPagePropTypes) => {
      setPage((currentPageVal) => {
        let nextPageValue = currentPageVal.page
        let attemptPageValue = currentPageVal.page
        let useMaxPages = !maxPages ? false : Math.max(maxPages, 1) // No sense for it to be under 0 if enabled

        if (typeof setToPage !== 'undefined') {
          attemptPageValue = Math.max(setToPage, 1)
          nextPageValue = useMaxPages
            ? Math.min(attemptPageValue, useMaxPages)
            : attemptPageValue

          // Not logical to set both
          if (typeof offset !== 'undefined') {
            console.warn('setToPage and offset is defined, offset will be ignored.')
          }
        } else if (typeof offset !== 'undefined') {
          attemptPageValue = Math.max(currentPageVal.page + offset, 1)
          nextPageValue = useMaxPages
            ? Math.min(attemptPageValue, useMaxPages)
            : attemptPageValue
        }

        // Warn if attempted to set a larger page number than there are pages.
        if (useMaxPages && attemptPageValue > useMaxPages) {
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

  return {
    page,
    setPage,
    setPageSize,
    setCurrentPage,
  }
}

export function useTableState(): TableStateType {
  let [filters, setFilters] = useState<FilterConfig[]>([])
  let [sort, _setSort] = useState<SortConfig[]>([])
  let pagingState = usePagingState()

  let setSort = (val) => {
    console.log(val)
    return _setSort(val)
  }

  return {
    filters,
    setFilters,
    sort,
    setSort,
    ...pagingState,
  }
}
