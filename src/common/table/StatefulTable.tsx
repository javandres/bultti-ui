import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { LoadingDisplay } from '../components/Loading'
import TableFiltersControl from './TableFiltersControl'
import TablePagingControl from './TablePagingControl'
import { TableStateType } from './useTableState'
import { PageState, useRenderCellValue } from './tableUtils'
import { pick } from 'lodash'
import Table, { RenderInputType, TableEditProps } from './Table'
import { EmptyView } from '../components/Messages'

const TableViewWrapper = styled.div`
  position: relative;
`

const TableEmptyView = styled(EmptyView)`
  margin: 1rem !important;
`

export type PropTypes<ItemType extends {}> = {
  items: ItemType[]
  columnLabels: { [key in keyof ItemType]?: string }
  pageState: PageState
  tableState: TableStateType
  loading?: boolean
  onUpdate?: () => unknown
  keyFromItem?: (item: ItemType) => string
  renderCell?: (key: string, val: any, item?: ItemType) => React.ReactNode
  renderInput?: RenderInputType<ItemType>
} & TableEditProps<ItemType>

const StatefulTable = observer(
  <ItemType extends {}>({
    items,
    columnLabels,
    loading = false,
    onUpdate = () => {},
    pageState,
    tableState,
    keyFromItem,
    onEditValue,
    onCancelEdit,
    onSaveEdit,
    pendingValues = [],
    editableValues = [],
    renderCell,
    renderInput,
  }: PropTypes<ItemType>) => {
    let {
      filters = [],
      sort = [],
      setPage = () => {},
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
        {pageState && (
          <>
            <TableFiltersControl
              filters={filters}
              setFilters={setFilters}
              fieldLabels={columnLabels}
              excludeFields={['id', '__typename']}
              onApply={onUpdate}
            />
            <TablePagingControl onSetPage={setPage} pageState={pageState} />
          </>
        )}
        <Table<ItemType>
          virtualized={true}
          keyFromItem={keyFromItem}
          items={items}
          hideKeys={!columnLabels ? ['id'] : undefined}
          renderValue={renderCellValue}
          sort={sort}
          setSort={setSort}
          pendingValues={pendingValues}
          editableValues={editableValues}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onEditValue={onEditValue}
          renderInput={renderInput}
          renderCell={renderCell}
          columnLabels={existingPropLabels}>
          <TableEmptyView>tableEmpty</TableEmptyView>
        </Table>
      </TableViewWrapper>
    )
  }
)

export default StatefulTable
