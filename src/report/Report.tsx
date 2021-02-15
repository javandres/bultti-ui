import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { createReportQueryByName } from './reportQueries'
import { FilterConfig, InspectionType, PageConfig, SortConfig } from '../schema-types'
import ListReport from './ListReport'
import { LoadingDisplay } from '../common/components/Loading'
import ExecutionRequirementsReport from './ExecutionRequirementsReport'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { FlexRow } from '../common/components/common'
import DownloadReport from './DownloadReport'
import { useQueryData } from '../util/useQueryData'
import ReportTableFilters from './ReportTableFilters'
import ReportPaging from './ReportPaging'
import ObservedExecutionRequirementsReport from './ObservedExecutionRequirementsReport'
import { Text } from '../util/translate'

const ReportView = styled.div`
  position: relative;
  min-height: 10rem;
`

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

const Report = observer(({ reportName, inspectionId, inspectionType }: PropTypes) => {
  let [filters, setFilters] = useState<FilterConfig[]>([])
  let [sort, setSort] = useState<SortConfig[]>([])
  let [page, setPage] = useState<PageConfig>({
    page: 1,
    pageSize: 20,
  })

  let requestVars = useRef({
    reportName,
    inspectionId,
    inspectionType,
    filters,
    sort,
    page,
  })

  let { data: report, loading: reportLoading, refetch } = useQueryData(
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

  return (
    <ReportView>
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
      <LoadingDisplay loading={reportLoading} style={{ top: '-1rem' }} />
      {report && !isExecutionRequirementReport && (
        <>
          <ReportTableFilters
            filters={filters}
            setFilters={setFilters}
            fieldLabels={columnLabels}
            excludeFields={['id', '__typename']}
            onApply={onUpdateFetchProps}
          />
          <ReportPaging
            selectedPageSize={page.pageSize}
            onSetPage={(targetPageNumber: number) =>
              setPage({
                page: targetPageNumber,
                pageSize: page.pageSize,
              })
            }
            onNextPage={() =>
              setPage({
                page: page.page + 1,
                pageSize: page.pageSize,
              })
            }
            onPrevPage={() =>
              setPage({
                page: page.page - 1,
                pageSize: page.pageSize,
              })
            }
            onSetPageSize={(targetPageSize: number) =>
              setPage({
                page: page.page,
                pageSize: targetPageSize,
              })
            }
            reportData={report}
          />
        </>
      )}
      {isExecutionRequirementReport ? (
        inspectionType === InspectionType.Pre ? (
          <ExecutionRequirementsReport items={reportDataItems} />
        ) : (
          <ObservedExecutionRequirementsReport items={reportDataItems} />
        )
      ) : (
        <ListReport
          sort={sort}
          setSort={setSort}
          items={reportDataItems}
          columnLabels={columnLabels}
        />
      )}
    </ReportView>
  )
})

export default Report
