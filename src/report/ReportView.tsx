import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { LoadingDisplay } from '../common/components/Loading'
import ExecutionRequirementsReport from './ExecutionRequirementsReport'
import ObservedExecutionRequirementsReport from './ObservedExecutionRequirementsReport'
import { defaultTableStateValue, TableStateType } from '../common/table/useTableState'
import { ReportType } from './reportUtil'
import { PageState } from '../common/table/tableUtils'
import StatefulTable from '../common/table/StatefulTable'

const ReportViewWrapper = styled.div`
  position: relative;
  min-height: 10rem;
`

export type PropTypes = {
  items: any[]
  columnLabels: { [key: string]: string }
  pageState: PageState
  loading?: boolean
  onUpdate?: () => unknown
  tableState?: TableStateType
  reportType?: ReportType
}

let reportKeyFromItem = (item: any) =>
  item?.id || item?._id || item?.departureId || item?.registryNr || ''

const ReportView = observer(
  ({
    items,
    columnLabels,
    loading = false,
    onUpdate = () => {},
    pageState,
    tableState = defaultTableStateValue,
    reportType = 'list',
  }: PropTypes) => {
    return (
      <ReportViewWrapper>
        <LoadingDisplay loading={loading} style={{ top: '-1rem' }} />
        {reportType === 'executionRequirement' ? (
          <ExecutionRequirementsReport items={items} />
        ) : reportType === 'observedExecutionRequirement' ? (
          <ObservedExecutionRequirementsReport items={items} />
        ) : (
          <StatefulTable
            items={items}
            pageState={pageState}
            tableState={tableState}
            onUpdate={onUpdate}
            columnLabels={columnLabels}
            keyFromItem={reportKeyFromItem}
          />
        )}
      </ReportViewWrapper>
    )
  }
)

export default ReportView
