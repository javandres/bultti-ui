export type ReportComponentProps<T> = {
  items: T[]
  columnLabels?: { [key in keyof T]: string }
}

export type ReportType = 'list' | 'pair' | 'executionRequirement'

export const reportTypes: { [key: string]: ReportType } = {
  ObservedExecutionRequirementsReportData: 'executionRequirement',
  ExecutionRequirementsReportData: 'executionRequirement',
}
