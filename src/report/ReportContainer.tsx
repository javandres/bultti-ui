import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { createReportQueryByName } from './reportQueries'
import { InspectionType } from '../schema-types'
import { defaultPageConfig, ReportStateCtx } from './ReportStateContext'
import ReportView from './ReportView'
import DownloadReport from './DownloadReport'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { Text } from '../util/translate'
import { FlexRow } from '../common/components/common'
import { BaseReport, ReportStats } from '../type/report'

const ReportFunctionsRow = styled(FlexRow)`
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--lighter-grey);
  margin: -0.25rem -1rem 0;
`

export type PropTypes = {
  reportName: string
  inspectionType: InspectionType
  inspectionId: string
}

const ReportContainer = observer(({ reportName, inspectionId, inspectionType }: PropTypes) => {
  let { filters = [], sort = [], page = defaultPageConfig } = useContext(ReportStateCtx)

  let requestVars = useRef({
    reportName,
    inspectionId,
    inspectionType,
    filters,
    sort,
    page,
  })

  let { data: report, loading: reportLoading, refetch } = useQueryData<BaseReport>(
    createReportQueryByName(reportName),
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: { ...requestVars.current },
    }
  )

  let onUpdateFetchProps = useCallback(() => {
    requestVars.current.filters = filters
    refetch({ ...requestVars.current, sort, page })
  }, [refetch, requestVars.current, filters, sort, page])

  // Trigger the refetch when sort or page state changes. Does NOT react to
  // filter state, which is triggered separately with a button.
  useEffect(() => {
    onUpdateFetchProps()
  }, [sort, page])

  let reportDataItems = useMemo(() => report?.reportData || [], [report])

  let isExecutionRequirementReport = reportDataItems.some((dataItem) =>
    ['ObservedExecutionRequirementsReportData', 'ExecutionRequirementsReportData'].includes(
      dataItem.__typename
    )
  )

  let columnLabels = useMemo(() => {
    return report?.columnLabels ? JSON.parse(report?.columnLabels) : undefined
  }, [report])

  let reportStats: ReportStats = useMemo(
    () => ({
      totalCount: report?.totalCount || 0,
      pages: report?.pages || 0,
      filteredCount: report?.filteredCount || report?.totalCount || 0,
      currentPage: report?.page?.page || 0,
      pageSize: report?.page?.pageSize || 0,
      itemsOnPage: report?.reportData?.length,
    }),
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
          onClick={onUpdateFetchProps}>
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
        reportStats={reportStats}
        onUpdate={onUpdateFetchProps}
        columnLabels={columnLabels}
      />
    </>
  )
})

export default ReportContainer
