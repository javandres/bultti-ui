export type ReportComponentProps<T = any> = {
  items: T[]
  columnLabels?: { [key in keyof T]: string }
}
