import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { reportByName } from './reportQueries'
import {
  DeparturePair,
  ExecutionRequirement,
  FilterConfig,
  InspectionType,
  PageConfig,
  Report as ReportDataType,
  ReportType,
  ReportType as ReportTypeEnum,
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

const ReportView = styled.div`
  position: relative;
  min-height: 10rem;
`

const ReportFunctionsRow = styled(FlexRow)`
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--lighter-grey);
  margin: -0.25rem -1rem 1rem;
`

const ResultsCountView = styled.div`
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--grey);
`

export type PropTypes = {
  reportName: string
  inspectionType: InspectionType
  inspectionId: string
}

export type ReportContextType = {
  filters: FilterConfig[]
  setFilters: (arg: ((filters: FilterConfig[]) => FilterConfig[]) | FilterConfig[]) => unknown
  sort: SortConfig[]
  setSort: (arg: ((sort: SortConfig[]) => SortConfig[]) | SortConfig[]) => unknown
  page: PageConfig
  setPage: (arg: ((page: PageConfig) => PageConfig) | PageConfig) => unknown
}

export const ReportContext = React.createContext<ReportContextType>({
  filters: [],
  sort: [],
  page: { page: 1, pageSize: 500 },
  setFilters: () => {},
  setSort: () => {},
  setPage: () => {},
})

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
  })

  let { data: reportData, loading: reportLoading, refetch } = useQueryData<ReportDataType>(
    reportByName,
    {
      notifyOnNetworkStatusChange: true,
      variables: { ...requestVars.current, sort, page },
    }
  )

  // Update local state with what was returned from the server.
  useEffect(() => {
    let { page, filters, sort } = reportData || {}

    if (page) {
      setPage(page)
    }

    if (filters) {
      setFilters(filters)
    }

    if (sort) {
      setSort(sort)
    }
  }, [reportData])

  let onUpdateFetchProps = useCallback(() => {
    requestVars.current.filters = filters
    refetch({ ...requestVars.current, sort, page })
  }, [refetch, requestVars.current, filters, sort, page])

  let reportDataItems = useMemo(() => reportData?.reportEntities || [], [reportData])

  let columnLabels = useMemo(
    () => (reportData?.columnLabels ? JSON.parse(reportData?.columnLabels) : undefined),
    [reportData]
  )

  let ReportTypeComponent = useMemo(() => {
    switch (reportData?.reportType) {
      case ReportTypeEnum.PairList:
        return (
          <PairListReport
            items={reportDataItems as DeparturePair[]}
            columnLabels={columnLabels}
          />
        )
      case ReportTypeEnum.ExecutionRequirement:
        return (
          <ExecutionRequirementsReport items={reportDataItems as ExecutionRequirement[]} />
        )
      case ReportTypeEnum.List:
      default:
        return <ListReport items={reportDataItems} columnLabels={columnLabels} />
    }
  }, [reportDataItems, columnLabels, reportData])

  return (
    <ReportContext.Provider
      value={{
        filters,
        setFilters,
        sort,
        setSort,
        page,
        setPage,
      }}>
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
        {reportData?.reportType !== ReportType.ExecutionRequirement && (
          <ReportTableFilters
            items={reportDataItems}
            fieldLabels={columnLabels}
            excludeFields={['id', '__typename']}
            onApply={onUpdateFetchProps}
          />
        )}
        {ReportTypeComponent}
      </ReportView>
    </ReportContext.Provider>
  )
})

export default Report
