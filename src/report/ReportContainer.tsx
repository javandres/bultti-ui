import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { createReportQueryByName } from './reportQueries'
import { InspectionStatus, InspectionType } from '../schema-types'
import { createResponseId, useTableState } from '../common/table/useTableState'
import DownloadReport from './DownloadReport'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import { Text } from '../util/translate'
import { FlexRow } from '../common/components/common'
import { ReportTypeByName } from './reportTypes'
import { LoadingDisplay } from '../common/components/Loading'
import ExecutionRequirementsReport from './ExecutionRequirementsReport'
import ObservedExecutionRequirementsReport from './ObservedExecutionRequirementsReport'
import { transformReport } from './transformReports'
import { BaseReport } from '../type/report'
import TableReport from './TableReport'

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
  inspectionStatus: InspectionStatus
}

const ReportContainer = observer((props: PropTypes) => {
  let { reportName, inspectionId, inspectionType, inspectionStatus } = props
  let tableState = useTableState()
  let { filters = [], sort = [] } = tableState

  type ReportDataType = ReportTypeByName[typeof reportName]

  let {
    data: report,
    loading: reportLoading,
    refetch,
  } = useQueryData<BaseReport<ReportDataType>>(createReportQueryByName(reportName), {
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

  let reportDataItems = useMemo(
    () => transformReport(reportName, report?.rows || []),
    [reportName, report]
  )

  // Determine if the report is about some form of execution requirement.
  // These have their own report components.
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
        {inspectionStatus === InspectionStatus.InProduction &&
          inspectionType &&
          inspectionId && (
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
        report?.rows && (
          <TableReport<ReportDataType>
            report={report}
            reportName={reportName}
            tableState={tableState}
          />
        )
      )}
    </ReportViewWrapper>
  )
})

export default ReportContainer
