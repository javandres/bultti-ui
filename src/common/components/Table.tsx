import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { get, orderBy } from 'lodash'
import { Button, ButtonSize } from './Button'
import { render } from 'react-dom'

const TableView = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid var(--light-grey);
  border-radius: 5px;
`

const RemoveButton = styled(Button).attrs({ size: ButtonSize.SMALL })`
  background: var(--red);
  position: absolute;
  border: 0;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  padding: 0;
  line-height: 1;
  align-items: baseline;
  justify-content: center;
  font-size: 0.75rem;
  left: -0.75rem;
  top: 0.4rem;
  display: none;
`

const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid var(--lighter-grey);
  position: relative;

  &:last-child {
    border-bottom: 0;
  }

  &:hover ${RemoveButton} {
    display: flex;
  }
`

const TableHeader = styled(TableRow)``

const TableCell = styled.div`
  flex: 1 1 calc(100% / 11);
  min-width: 45px;
  text-align: center;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;

  &:last-child {
    border-right: 0;
  }

  &:nth-child(odd) {
    background: rgba(0, 0, 0, 0.025);
  }
`

const ColumnHeaderCell = styled(TableCell)`
  padding: 0.5rem 0.5rem 0.4rem;
  font-weight: bold;
`

const CellContent = styled.div`
  padding: 0.5rem 0 0.5rem 0.15rem;
  text-align: center;
  border: 0;
  background: transparent;
  display: block;
`

export type PropTypes<ItemType = any> = {
  items: ItemType[]
  columnLabels?: { [key in keyof ItemType]: string }
  columnOrder?: string[]
  indexCell?: React.ReactChild
  keyFromItem?: (item: ItemType) => string
  onRemoveRow?: (item: ItemType) => () => void
  className?: string
  renderCell?: (val: any, item?: ItemType) => React.ReactChild
}

const defaultKeyFromItem = (item) => item.id

const defaultRenderCellContent = (val: any): React.ReactChild => (
  <>{val && <CellContent>{val}</CellContent>}</>
)

const Table: React.FC<PropTypes> = observer(
  ({
    items,
    columnLabels = {},
    columnOrder = [],
    indexCell = '',
    keyFromItem = defaultKeyFromItem,
    onRemoveRow,
    renderCell = defaultRenderCellContent,
    className,
  }) => {
    const filteredItems = useMemo(() => items.map(({ __typename, ...item }) => item), [items])

    // Order the keys and get cleartext labels for the columns
    let columns = Object.keys(filteredItems[0])

    const columnKeysOrdering =
      columnOrder && columnOrder.length !== 0 ? columnOrder : Object.keys(columnLabels)

    if (columnKeysOrdering.length !== 0) {
      columns = orderBy(columns, (key) => {
        const labelIndex = columnKeysOrdering.indexOf(key)
        return labelIndex === -1 ? 999 : labelIndex
      }).map((key) => get(columnLabels, key, key))
    }

    return (
      <TableView className={className}>
        <TableHeader>
          {indexCell && (
            <ColumnHeaderCell style={{ fontSize: '0.6rem', fontWeight: 'normal' }}>
              {indexCell}
            </ColumnHeaderCell>
          )}
          {columns.map((colName) => (
            <ColumnHeaderCell key={colName}>{colName}</ColumnHeaderCell>
          ))}
        </TableHeader>
        {filteredItems.map((item, rowIndex) => {
          let itemEntries = Object.entries(item)

          if (columnKeysOrdering.length !== 0) {
            itemEntries = orderBy(itemEntries, ([key]) => {
              const labelIndex = columnKeysOrdering.indexOf(key)
              return labelIndex === -1 ? 999 : labelIndex
            })
          }

          const itemValues = itemEntries.map(([, value]) => value)
          const rowKey = keyFromItem(item)

          return (
            <TableRow key={rowKey ?? `row-${rowIndex}`}>
              {itemValues.map((val: any, index) => (
                <TableCell key={`${rowKey}-${index}`}>
                  {renderCell(val, item)}
                </TableCell>
              ))}
              {onRemoveRow && <RemoveButton onClick={onRemoveRow(item)}>X</RemoveButton>}
            </TableRow>
          )
        })}
      </TableView>
    )
  }
)

export default Table
