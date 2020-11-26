import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { reportByName } from './reportQueries'
import {
  DeparturePair,
  ExecutionRequirement,
  FilterConfig,
  InspectionType,
  ObservedExecutionRequirement,
  PageConfig,
  Report as ReportDataType,
  ReportType,
  SortConfig,
} from '../schema-types'
import ListReport from './ListReport'
import { LoadingDisplay } from '../common/components/Loading'
import ExecutionRequirementsReport from './ExecutionRequirementsReport'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { FlexRow } from '../common/components/common'
import DownloadReport from './DownloadReport'
import PairListReport from './PairListReport'
import { useQueryData } from '../util/useQueryData'
import ReportTableFilters from './ReportTableFilters'
import ReportPaging from './ReportPaging'
import ObservedExecutionRequirementsReport from './ObservedExecutionRequirementsReport'

const ReportView = styled.div`
  position: relative;
  min-height: 10rem;
`

const ReportFunctionsRow = styled(FlexRow)`
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--lighter-grey);
  margin: -0.25rem -1rem 1rem;
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
    pageSize: 500,
  })

  let requestVars = useRef({
    reportName,
    inspectionId,
    inspectionType,
    filters,
    sort,
    page,
  })

  let { data: reportData, loading: reportLoading, refetch } = useQueryData<ReportDataType>(
    reportByName,
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

  let reportDataItems = useMemo(() => reportData?.reportEntities || [], [reportData])

  let columnLabels = useMemo(
    () => (reportData?.columnLabels ? JSON.parse(reportData?.columnLabels) : undefined),
    [reportData]
  )

  let onPageNav = useCallback(
    (offset) => {
      return () => {
        setPage((currentPage) => {
          let nextPageIdx = Math.min(
            Math.max(currentPage.page + offset, 1),
            reportData?.pages || 1
          )

          return {
            ...currentPage,
            page: nextPageIdx,
          }
        })
      }
    },
    [reportData?.pages]
  )

  let onSetPage = useCallback(
    (setPageTo) => {
      setPage((currentPage) => {
        let nextPageIdx = Math.min(Math.max(setPageTo, 1), reportData?.pages || 1)

        return {
          ...currentPage,
          page: nextPageIdx,
        }
      })
    },
    [reportData?.pages]
  )

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
          Päivitä
        </Button>
      </ReportFunctionsRow>
      <LoadingDisplay loading={reportLoading} style={{ top: '-1rem' }} />
      {reportData && reportData?.reportType !== ReportType.ExecutionRequirement && (
        <>
          {reportDataItems.length >= 5 && (
            <ReportTableFilters
              filters={filters}
              setFilters={setFilters}
              fieldLabels={columnLabels}
              excludeFields={['id', '__typename']}
              onApply={onUpdateFetchProps}
            />
          )}
          {reportDataItems.length >= 50 && (
            <ReportPaging
              onSetPage={onSetPage}
              onNextPage={onPageNav(1)}
              onPrevPage={onPageNav(-1)}
              reportData={reportData}
            />
          )}
        </>
      )}
      {reportData?.reportType === ReportType.List ? (
        <ListReport
          sort={sort}
          setSort={setSort}
          items={reportDataItems}
          columnLabels={columnLabels}
        />
      ) : reportData?.reportType === ReportType.PairList ? (
        <PairListReport
          sort={sort}
          setSort={setSort}
          items={reportDataItems as DeparturePair[]}
          columnLabels={columnLabels}
        />
      ) : reportData?.reportType === ReportType.ExecutionRequirement ? (
        inspectionType === InspectionType.Pre ? (
          <ExecutionRequirementsReport items={reportDataItems as ExecutionRequirement[]} />
        ) : (
          <ObservedExecutionRequirementsReport
            items={reportDataItems as ObservedExecutionRequirement[]}
          />
        )
      ) : null}
    </ReportView>
  )
})

export default Report
