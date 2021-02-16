import { FilterConfig, InspectionType, PageConfig, SortConfig } from '../schema-types'
import { FilteredPagedSortedResponse } from '../common/table/tableUtils'

export interface BaseReport<DataType extends {}>
  extends FilteredPagedSortedResponse<DataType> {
  name: string
  title: string
  description: string
  inspectionType: InspectionType
  columnLabels: string
  rows: any[]
  filteredCount: number
  totalCount: number
  pages: number
  seasonId: string
  operatorId: number
  inspectionId: string
  page?: PageConfig
  filters?: FilterConfig[]
  sort?: SortConfig[]
  showSanctioned?: boolean
  showUnsanctioned?: boolean
}
