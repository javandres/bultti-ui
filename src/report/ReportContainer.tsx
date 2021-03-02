import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { createReportQueryByName } from './reportQueries'
import { InspectionType } from '../schema-types'
import { createResponseId, useTableState } from '../common/table/useTableState'
import DownloadReport from './DownloadReport'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { Text } from '../util/translate'
import { FlexRow } from '../common/components/common'
import { BaseReport } from '../type/report'
import { ReportTypeByName } from './reportTypes'
import { LoadingDisplay } from '../common/components/Loading'
import ExecutionRequirementsReport from './ExecutionRequirementsReport'
import ObservedExecutionRequirementsReport from './ObservedExecutionRequirementsReport'
import FilteredResponseTable from '../common/table/FilteredResponseTable'
import { hasReportTransform, transformReport } from './transformReports'

const ReportViewWrapper = styled.div`
  position: relative;
  min-height: 10rem;
`

const ReportFunctionsRow = styled(FlexRow)`
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--lighter-grey);
  margin: -0.25rem -1rem 0;
`

export type PropTypes = {
  reportName: keyof ReportTypeByName
  inspectionType: InspectionType
  inspectionId: string
}

let reportKeyFromItem = (item: any) =>
  item?.id || item?._id || item?.departureId || item?.registryNr || ''

const ReportContainer = observer(({ reportName, inspectionId, inspectionType }: PropTypes) => {
  let tableState = useTableState()
  let { filters = [], sort = [] } = tableState

  type ReportDataType = ReportTypeByName[typeof reportName]

  let { data: report, loading: reportLoading, refetch } = useQueryData<
    BaseReport<ReportDataType>
  >(createReportQueryByName(reportName), {
    notifyOnNetworkStatusChange: true,
    variables: {
      // Add a string variable that changes when the table state changes.
      // Without this it wouldn't refetch if eg. filters change.
      responseId: createResponseId({ filters, sort }),
      reportName,
      inspectionId,
      inspectionType,
      filters,
      sort,
    },
  })

  let transformedReport = useMemo(() => {
    if (!report) {
      return report
    }

    let transformedRows = transformReport(reportName, report.rows)
    return { ...report, rows: transformedRows }
  }, [report, reportName])

  let columnLabels = useMemo(() => {
    let columnLabels = transformedReport?.columnLabels
      ? JSON.parse(transformedReport?.columnLabels)
      : undefined

    let rowModel = transformedReport?.rows[0]

    // Skip if rows were not transformed.
    if (!rowModel || !hasReportTransform(reportName)) {
      return columnLabels
    }

    for (let colName of Object.keys(rowModel)) {
      // Skip id col
      if (colName === 'id') {
        continue
      }

      if (!columnLabels[colName]) {
        columnLabels[colName] = colName
      }
    }

    return columnLabels
  }, [transformedReport, reportName])

  let reportDataItems = useMemo(() => transformedReport?.rows || [], [transformedReport])

  let isExecutionRequirementReport = reportDataItems.some((dataItem) =>
    ['ObservedExecutionRequirementsReportData', 'ExecutionRequirementsReportData'].includes(
      dataItem.__typename
    )
  )

  let reportType = isExecutionRequirementReport
    ? inspectionType === InspectionType.Post
      ? 'observedExecutionRequirement'
      : 'executionRequirement'
    : 'list'

  return (
    <ReportViewWrapper>
      <ReportFunctionsRow>
        {inspectionType && inspectionId && (
          <DownloadReport
            reportName={reportName}
            inspectionId={inspectionId}
            inspectionType={inspectionType}
          />
        )}
        <Button
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={() => refetch()}>
          <Text>update</Text>
        </Button>
      </ReportFunctionsRow>
      <LoadingDisplay loading={reportLoading} />
      {reportType === 'executionRequirement' ? (
        <ExecutionRequirementsReport items={reportDataItems} />
      ) : reportType === 'observedExecutionRequirement' ? (
        <ObservedExecutionRequirementsReport items={reportDataItems} />
      ) : (
        <FilteredResponseTable
          data={transformedReport}
          tableState={tableState}
          columnLabels={columnLabels}
          keyFromItem={reportKeyFromItem}
        />
      )}
    </ReportViewWrapper>
  )
})

export default ReportContainer
