import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { LoadingDisplay } from '../components/Loading'
import TableFiltersControl from './TableFiltersControl'
import { TableStateType } from './useTableState'
import { IFilteredSortedResponse, useRenderCellValue } from './tableUtils'
import { pick } from 'lodash'
import { CellValType, TablePropTypes } from './Table'
import { EmptyView } from '../components/Messages'
import { Text } from '../../util/translate'
import PagedTable from './PagedTable'

const TableViewWrapper = styled.div`
  position: relative;
`

const TableEmptyView = styled(EmptyView)`
  margin: 1rem !important;
`

export type PropTypes<ItemType extends {}, EditValueType = CellValType> = {
  tableState: TableStateType
  data?: IFilteredSortedResponse<ItemType>
  loading?: boolean
} & Omit<TablePropTypes<ItemType, EditValueType>, 'items'>

const FilteredResponseTable = observer(
  <ItemType extends {}, EditValueType = CellValType>({
    data,
    columnLabels,
    loading = false,
    tableState,
    ...tableProps
  }: PropTypes<ItemType, EditValueType>) => {
    let { filters = [], sort = [], setFilters = () => {}, setSort = () => {} } = tableState
    const renderCellValue = useRenderCellValue()
    let items = useMemo(() => data?.rows || [], [data])

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
        <TableFiltersControl
          filters={filters}
          setFilters={setFilters}
          fieldLabels={columnLabels}
          excludeFields={['id', '__typename']}
        />
        <PagedTable<ItemType, EditValueType>
          {...tableProps}
          items={items}
          totalCount={data?.totalCount}
          filteredCount={data?.filteredCount}
          hideKeys={tableProps.hideKeys || (!columnLabels ? ['id'] : undefined)}
          renderValue={tableProps.renderValue || renderCellValue}
          sort={sort}
          setSort={setSort}
          columnLabels={existingPropLabels}>
          <TableEmptyView>
            <Text>tableEmpty</Text>
          </TableEmptyView>
        </PagedTable>
      </TableViewWrapper>
    )
  }
)

export default FilteredResponseTable
