export type ReportComponentProps<T = {}> = {
  items: T[]
  columnLabels?: { [key: string]: string }
}

export type ReportType = 'list' | 'executionRequirement' | 'observedExecutionRequirement'

export const reportTypes: { [key: string]: ReportType } = {
  ObservedExecutionRequirementsReportData: 'executionRequirement',
  ExecutionRequirementsReportData: 'executionRequirement',
}
