import { FilterConfig, InspectionType, PageConfig, SortConfig } from '../schema-types'

export interface BaseReport {
  name: string
  title: string
  description: string
  inspectionType: InspectionType
  columnLabels: string
  reportData: any[]
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

export type ReportStats = {
  pages: number
  totalCount: number
  filteredCount: number
  pageSize: number
  itemsOnPage: number
  currentPage: number
}
