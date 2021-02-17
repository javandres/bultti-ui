import { Dispatch, SetStateAction, useState } from 'react'
import { FilterConfig, PageConfig, SortConfig } from '../../schema-types'

export type TableStateType = {
  filters: FilterConfig[]
  setFilters: Dispatch<SetStateAction<FilterConfig[]>>
  page: PageConfig
  setPage: Dispatch<SetStateAction<PageConfig>>
  sort: SortConfig[]
  setSort: Dispatch<SetStateAction<SortConfig[]>>
}

export const defaultPageConfig = {
  page: 1,
  pageSize: 500,
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

  let stateValue: TableStateType = {
    filters,
    setFilters,
    page,
    setPage,
    sort,
    setSort,
  }

  return stateValue
}
