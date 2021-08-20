import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { text } from '../util/translate'
import FilteredResponseTable from '../common/table/FilteredResponseTable'
import { createColumnTotalCallback } from './reportTotals'
import { reportCellHighlightColorMap } from './reportCellHighlightColor'
import { hasReportTransform, transformReport } from './transformReports'
import { BaseReport } from '../type/report'
import { TableStateType } from '../common/table/useTableState'

export type PropTypes<ReportType extends Record<string, unknown>> = {
  report: BaseReport<ReportType>
  reportName: string
  tableState: TableStateType
  testId?: string
}

interface ReportItemKeyInterface {
  id?: string
  _id?: string
  departureId?: string
  registryNr?: string
}

let reportKeyFromItem = (item: ReportItemKeyInterface): string =>
  item?.id || item?._id || item?.departureId || item?.registryNr || ''

const TableReport = observer(
  <ReportType extends Record<string, unknown>>({
    report,
    reportName,
    tableState,
    testId,
  }: PropTypes<ReportType>) => {
    // Prepare report data by transforming report rows (if necessary) and parsing the column labels.
    let preparedReport = useMemo(() => {
      if (!report) {
        return undefined
      }

      // Transform data. Will be passed through untouched if no transform is implemented.
      let transformedRows = transformReport(reportName, report?.rows)
      let columnLabels = report?.columnLabels ? JSON.parse(report?.columnLabels) : undefined

      let rowModel = transformedRows[0]

      // Column labels from the response are already OK if rows were not transformed.
      if (!rowModel || !columnLabels || !hasReportTransform(reportName)) {
        return { ...report, columnLabels, rows: transformedRows }
      }

      let totalRowsCount = transformedRows.length

      // Add the transformed row keys to the column labels in order to actually show them.
      for (let colName of Object.keys(rowModel)) {
        // Skip id col
        if (colName === 'id') {
          continue
        }

        if (!columnLabels[colName]) {
          columnLabels[colName] = colName
        }
      }

      // Return amended report object with transformed rows and column labels.
      return {
        ...report,
        totalCount: totalRowsCount,
        filteredCount: totalRowsCount,
        rows: transformedRows,
        columnLabels,
      }
    }, [report, reportName])

    let columnLabels = preparedReport?.columnLabels

    let calculateReportTotals = useMemo(
      () => createColumnTotalCallback(reportName, preparedReport?.rows || []),
      [reportName, preparedReport]
    )

    let getCellHighlightColor = reportCellHighlightColorMap[reportName]

    return (
      <FilteredResponseTable
        testId={testId}
        data={preparedReport}
        tableState={tableState}
        columnLabels={columnLabels}
        keyFromItem={reportKeyFromItem}
        getColumnTotal={calculateReportTotals}
        getCellHighlightColor={getCellHighlightColor}
        groupBy={
          report?.groupRowsBy
            ? (item) =>
                report?.groupRowsBy
                  ? text(`report_group_by_${item[report.groupRowsBy] as string}`)
                  : 'default'
            : undefined
        }
      />
    )
  }
)

export default TableReport
