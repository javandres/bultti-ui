import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { createReportQueryByName } from './reportQueries'
import { InspectionType } from '../schema-types'
import { defaultPageConfig, useTableState } from '../common/table/useTableState'
import ReportView from './ReportView'
import DownloadReport from './DownloadReport'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { Text } from '../util/translate'
import { FlexRow } from '../common/components/common'
import { BaseReport } from '../type/report'
import { createPageState, PageMeta } from '../common/table/tableUtils'
import { ReportTypeByName } from './reportTypes'

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

const ReportContainer = observer(({ reportName, inspectionId, inspectionType }: PropTypes) => {
  let tableState = useTableState()
  let { filters = [], sort = [], page = defaultPageConfig } = tableState

  type ReportDataType = ReportTypeByName[typeof reportName]

  let { data: report, loading: reportLoading, refetch } = useQueryData<
    BaseReport<ReportDataType>
  >(createReportQueryByName(reportName), {
    notifyOnNetworkStatusChange: true,
    variables: {
      reportName,
      inspectionId,
      inspectionType,
      filters,
      sort,
      page,
    },
  })

  let reportDataItems = useMemo(() => report?.rows || [], [report])

  let isExecutionRequirementReport = reportDataItems.some((dataItem) =>
    ['ObservedExecutionRequirementsReportData', 'ExecutionRequirementsReportData'].includes(
      dataItem.__typename
    )
  )

  let columnLabels = useMemo(() => {
    return report?.columnLabels ? JSON.parse(report?.columnLabels) : undefined
  }, [report])

  let reportPageState: PageMeta = useMemo(
    () => createPageState<BaseReport<ReportDataType>>(report),
    [report]
  )

  return (
    <>
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
      <ReportView
        reportType={
          isExecutionRequirementReport
            ? inspectionType === InspectionType.Post
              ? 'observedExecutionRequirement'
              : 'executionRequirement'
            : 'list'
        }
        loading={reportLoading}
        items={reportDataItems}
        tableState={tableState}
        pageState={reportPageState}
        columnLabels={columnLabels}
      />
    </>
  )
})

export default ReportContainer
