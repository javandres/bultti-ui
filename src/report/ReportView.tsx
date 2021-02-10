import React, { useCallback, useContext } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import ListReport from './ListReport'
import { LoadingDisplay } from '../common/components/Loading'
import ExecutionRequirementsReport from './ExecutionRequirementsReport'
import ReportTableFilters from './ReportTableFilters'
import ReportPaging from './ReportPaging'
import ObservedExecutionRequirementsReport from './ObservedExecutionRequirementsReport'
import { defaultPageConfig, ReportStateCtx } from './ReportStateContext'
import { ReportStats } from '../type/report'
import { ReportType } from './reportUtil'

const ReportViewWrapper = styled.div`
  position: relative;
  min-height: 10rem;
`

export type PropTypes = {
  items: any[]
  columnLabels: { [key: string]: string }
  loading?: boolean
  onUpdate?: () => unknown
  reportStats?: ReportStats
  reportType?: ReportType
}

const ReportView = observer(
  ({
    items,
    columnLabels,
    loading,
    onUpdate = () => {},
    reportStats,
    reportType = 'list',
  }: PropTypes) => {
    let {
      filters = [],
      sort = [],
      page = defaultPageConfig,
      setPage = () => {},
      setFilters = () => {},
      setSort = () => {},
    } = useContext(ReportStateCtx)

    let onPageNav = useCallback(
      (offset) => {
        return () => {
          setPage((currentPage) => {
            let nextPageIdx = Math.min(
              Math.max(currentPage.page + offset, 1),
              reportStats?.pages || 1
            )

            return {
              ...currentPage,
              page: nextPageIdx,
            }
          })
        }
      },
      [reportStats?.pages]
    )

    let onSetPage = useCallback(
      (setPageTo) => {
        setPage((currentPage) => {
          let nextPageIdx = Math.min(Math.max(setPageTo, 1), reportStats?.pages || 1)

          return {
            ...currentPage,
            page: nextPageIdx,
          }
        })
      },
      [reportStats?.pages]
    )

    return (
      <ReportViewWrapper>
        <LoadingDisplay loading={loading} style={{ top: '-1rem' }} />
        {reportStats && reportType !== 'executionRequirement' && (
          <>
            <ReportTableFilters
              filters={filters}
              setFilters={setFilters}
              fieldLabels={columnLabels}
              excludeFields={['id', '__typename']}
              onApply={onUpdate}
            />
            <ReportPaging
              onSetPage={onSetPage}
              onNextPage={onPageNav(1)}
              onPrevPage={onPageNav(-1)}
              reportStats={reportStats}
            />
          </>
        )}
        {reportType === 'executionRequirement' ? (
          <ExecutionRequirementsReport items={items} />
        ) : reportType === 'observedExecutionRequirement' ? (
          <ObservedExecutionRequirementsReport items={items} />
        ) : (
          <ListReport
            sort={sort}
            setSort={setSort}
            items={items}
            columnLabels={columnLabels}
          />
        )}
      </ReportViewWrapper>
    )
  }
)

export default ReportView
