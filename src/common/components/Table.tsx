import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference, get, omitBy, orderBy } from 'lodash'
import { Button, ButtonSize } from './Button'
import { CrossThick } from '../icons/CrossThick'

const TableView = styled.div`
  width: calc(100% + 2rem);
  border-top: 1px solid var(--lighter-grey);
  border-bottom: 1px solid var(--lighter-grey);
  border-radius: 0;
  margin: 0 -1rem 1rem -1rem;

  &:last-child {
    margin-bottom: 0;
  }
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

const TableRow = styled.div<{ footer?: boolean }>`
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
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: stretch;
  justify-content: center;
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.005);

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

export const CellContent = styled.div<{ footerCell?: boolean }>`
  padding: ${(p) => (p.footerCell ? '0.75rem' : '0.5rem')} 0.15rem;
  border: 0;
  background: transparent;
  display: block;
  width: 100%;
  text-align: center;
  font-weight: ${(p) => (p.footerCell ? 'bold' : 'normal')};
  background: ${(p) => (p.footerCell ? 'rgba(255,255,255,0.75)' : 'transparent')};
`

type ItemRemover<ItemType = any> = false | (() => void)

export type PropTypes<ItemType = any> = {
  items: ItemType[]
  columnLabels?: { [key in keyof ItemType]: string }
  columnOrder?: string[]
  hideKeys?: string[]
  indexCell?: React.ReactChild
  keyFromItem?: (item: ItemType) => string
  onRemoveRow?: (item: ItemType) => ItemRemover<ItemType>
  className?: string
  renderCell?: (val: any, key?: string, item?: ItemType) => React.ReactChild
  getColumnTotal?: (key: string) => React.ReactChild
}

const defaultKeyFromItem = (item) => item.id

const defaultRenderCellContent = (val: any): React.ReactChild => (
  <>
    {!(val === false || val === null || typeof val === 'undefined') && (
      <CellContent>{val}</CellContent>
    )}
  </>
)

const Table: React.FC<PropTypes> = observer(
  ({
    items,
    columnLabels = {},
    columnOrder = [],
    hideKeys,
    indexCell = '',
    keyFromItem = defaultKeyFromItem,
    onRemoveRow,
    renderCell = defaultRenderCellContent,
    getColumnTotal,
    className,
  }) => {
    // Order the keys and get cleartext labels for the columns
    // Omit keys that start with an underscore.
    let columns = Object.keys(omitBy(items[0] || {}, (val, key) => key.startsWith('_')))

    const columnLabelKeys = Object.keys(columnLabels)

    const columnKeysOrdering =
      columnOrder && columnOrder.length !== 0 ? columnOrder : columnLabelKeys

    let keysToHide: string[] = []

    // Hide keys listed in hideKeys if hideKeys is a non-zero array.
    // Hide keys NOT listed in columnLabels if hideKeys is undefined.
    // If hideKeys is a zero-length array no keys will be hidden.

    if (hideKeys && hideKeys.length !== 0) {
      keysToHide = hideKeys
    } else if (!hideKeys && columnLabelKeys.length !== 0) {
      keysToHide = difference(columns, columnLabelKeys)
    }

    if (columnKeysOrdering.length !== 0) {
      columns = orderBy(columns, (key) => {
        const labelIndex = columnKeysOrdering.indexOf(key)
        return labelIndex === -1 ? 999 : labelIndex
      }).filter((c) => !keysToHide.includes(c))
    }

    let columnNames = columns

    if (columnLabelKeys.length !== 0) {
      columnNames = columns.map((key) => get(columnLabels, key, key))
    }

    return (
      <TableView className={className}>
        <TableHeader>
          {indexCell && (
            <ColumnHeaderCell style={{ fontSize: '0.6rem', fontWeight: 'normal' }}>
              {indexCell}
            </ColumnHeaderCell>
          )}
          {columnNames.map((colName) => (
            <ColumnHeaderCell key={colName}>{colName}</ColumnHeaderCell>
          ))}
        </TableHeader>
        {items.map((item, rowIndex) => {
          // Again, omit keys that start with an underscore.
          let itemEntries = Object.entries(omitBy(item, (val, key) => key.startsWith('_')))

          if (columnKeysOrdering.length !== 0) {
            itemEntries = orderBy(itemEntries, ([key]) => {
              const labelIndex = columnKeysOrdering.indexOf(key)
              return labelIndex === -1 ? 999 : labelIndex
            })
          }

          const rowKey = keyFromItem(item)

          const itemRemover = !onRemoveRow ? null : onRemoveRow(item)

          return (
            <TableRow key={rowKey ?? `row-${rowIndex}`}>
              {itemEntries
                .filter(([key]) => !keysToHide.includes(key))
                .map(([key, val], index) => (
                  <TableCell key={`${rowKey}-${key}-${index}`}>
                    {renderCell(val, key, item)}
                  </TableCell>
                ))}
              {itemRemover && (
                <RemoveButton onClick={itemRemover}>
                  <CrossThick fill="white" width="0.5rem" height="0.5rem" />
                </RemoveButton>
              )}
            </TableRow>
          )
        })}
        {typeof getColumnTotal === 'function' && (
          <TableRow key="totals" footer={true}>
            {columns.map((col) => (
              <TableCell key={`footer_${col}`}>
                <CellContent footerCell={true}>{getColumnTotal(col)}</CellContent>
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableView>
    )
  }
)

export default Table
