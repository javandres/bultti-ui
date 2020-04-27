export type ReportComponentProps<T> = {
  items: T[]
  columnLabels?: { [key in keyof T]: string }
}
