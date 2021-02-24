import objectHash from 'object-hash'
import { Dispatch, SetStateAction, useState } from 'react'
import { FilterConfig, SortConfig } from '../../schema-types'

export type TableStateValuesType = {
  filters: FilterConfig[]
  sort: SortConfig[]
}

export type TableStateType = {
  setFilters: Dispatch<SetStateAction<FilterConfig[]>>
  setSort: Dispatch<SetStateAction<SortConfig[]>>
} & TableStateValuesType

export let defaultTableStateValue = {
  filters: [],
  setFilters: () => {},
  sort: [],
  setSort: () => {},
}

export type InitialTableState = {
  sort?: SortConfig[]
  filter?: FilterConfig[]
}

export function useTableState(): TableStateType {
  let [filters, setFilters] = useState<FilterConfig[]>([])
  let [sort, setSort] = useState<SortConfig[]>([])

  return {
    filters,
    setFilters,
    sort,
    setSort,
  }
}

export function createResponseId(tableState: TableStateValuesType): string {
  return objectHash(tableState, {
    unorderedObjects: true,
    unorderedArrays: true,
  })
}
