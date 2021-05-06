import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import Table, { TablePropTypes } from './Table'
import { EmptyView } from '../components/Messages'
import { Text } from '../../util/translate'
import { usePaging } from './usePaging'
import TablePagingControl from './TablePagingControl'
import { FilteredResponseMeta, TableItemType } from './tableUtils'

const TableViewWrapper = styled.div`
  position: relative;
`

const TableEmptyView = styled(EmptyView)`
  margin: 1rem !important;
`

export type PropTypes<ItemType extends TableItemType> = FilteredResponseMeta &
  TablePropTypes<ItemType>

const PagedTable = observer(
  <ItemType extends TableItemType>({
    filteredCount,
    totalCount,
    items,
    ...tableProps
  }: PropTypes<ItemType>) => {
    let pageState = usePaging(items)

    return (
      <TableViewWrapper>
        <TablePagingControl
          pageState={pageState}
          filteredCount={filteredCount}
          totalCount={totalCount}
        />
        <Table<ItemType> {...tableProps} items={pageState.currentPageItems}>
          <TableEmptyView>
            <Text>tableEmpty</Text>
          </TableEmptyView>
        </Table>
      </TableViewWrapper>
    )
  }
)

export default PagedTable
