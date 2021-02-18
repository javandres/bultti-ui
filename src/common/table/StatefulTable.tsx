import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { LoadingDisplay } from '../components/Loading'
import TableFiltersControl from './TableFiltersControl'
import TablePagingControl from './TablePagingControl'
import { defaultPageConfig, TableStateType } from './useTableState'
import { PageMeta, useRenderCellValue } from './tableUtils'
import { pick } from 'lodash'
import Table, { CellValType, TablePropTypes } from './Table'
import { EmptyView } from '../components/Messages'

const TableViewWrapper = styled.div`
  position: relative;
`

const TableEmptyView = styled(EmptyView)`
  margin: 1rem !important;
`

export type PropTypes<ItemType extends {}, EditValueType = CellValType> = {
  pageMeta: PageMeta
  tableState: TableStateType
  loading?: boolean
  onUpdate?: () => unknown
} & TablePropTypes<ItemType, EditValueType>

const StatefulTable = observer(
  <ItemType extends {}, EditValueType = CellValType>({
    items,
    columnLabels,
    loading = false,
    onUpdate = () => {},
    pageMeta,
    tableState,
    ...tableProps
  }: PropTypes<ItemType, EditValueType>) => {
    let {
      filters = [],
      sort = [],
      page = defaultPageConfig,
      setFilters = () => {},
      setSort = () => {},
    } = tableState

    const renderCellValue = useRenderCellValue()

    // Return columnLabels only for props that exist.
    let existingPropLabels = useMemo(() => {
      let existingProps = Object.keys((items || [])[0] || {})

      if (existingProps.length !== 0) {
        return pick(columnLabels, existingProps)
      }

      return columnLabels
    }, [columnLabels, items])

    return (
      <TableViewWrapper>
        <LoadingDisplay loading={loading} style={{ top: '-1rem' }} />
        {pageMeta && (
          <TableFiltersControl
            filters={filters}
            setFilters={setFilters}
            fieldLabels={columnLabels}
            excludeFields={['id', '__typename']}
            onApply={onUpdate}
          />
        )}
        <Table<ItemType, EditValueType>
          {...tableProps}
          setPage={tableState.setCurrentPage}
          setPageSize={tableState.setPageSize}
          pageState={page}
          pageMeta={pageMeta}
          items={items}
          hideKeys={tableProps.hideKeys || (!columnLabels ? ['id'] : undefined)}
          renderValue={tableProps.renderValue || renderCellValue}
          sort={sort}
          setSort={setSort}
          columnLabels={existingPropLabels}>
          <TableEmptyView>tableEmpty</TableEmptyView>
        </Table>
      </TableViewWrapper>
    )
  }
)

export default StatefulTable
