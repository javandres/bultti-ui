import React, { useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FilterConfig, PageConfig, SortConfig } from '../schema-types'

const ReportStateContextView = styled.div``

export type ReportStateContextType = {
  filters: FilterConfig[]
  setFilters: (arg: ((filters: FilterConfig[]) => FilterConfig[]) | FilterConfig[]) => unknown
  page: PageConfig
  setPage: (arg: ((page: PageConfig) => PageConfig) | PageConfig) => unknown
  sort: SortConfig[]
  setSort: (arg: ((sort: SortConfig[]) => SortConfig[]) | SortConfig[]) => unknown
}

export const defaultPageConfig = {
  page: 1,
  pageSize: 500,
}

let defaultStateValue = {
  filters: [],
  setFilters: () => {},
  page: defaultPageConfig,
  setPage: () => {},
  sort: [],
  setSort: () => {},
}

export let ReportStateCtx = React.createContext<ReportStateContextType>(defaultStateValue)

export type PropTypes = {
  children?: React.ReactNode
}

const ReportStateContext = observer(({ children }: PropTypes) => {
  let [filters, setFilters] = useState<FilterConfig[]>([])
  let [sort, setSort] = useState<SortConfig[]>([])
  let [page, setPage] = useState<PageConfig>(defaultPageConfig)

  let stateValue: ReportStateContextType = {
    filters,
    setFilters,
    page,
    setPage,
    sort,
    setSort,
  }

  return <ReportStateCtx.Provider value={stateValue}>{children}</ReportStateCtx.Provider>
})

export default ReportStateContext
