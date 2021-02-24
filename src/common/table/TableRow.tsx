import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { CellValType, TableRowWithDataAndFunctions } from './tableUtils'
import React, { CSSProperties } from 'react'
import { RemoveButton } from '../components/Button'
import { TableCell } from './TableCell'

export const RowRemoveButton = styled(RemoveButton)`
  transition: opacity 0.05s ease-out, right 0.1s ease-out;
  right: -2rem;
  opacity: 0;
  position: absolute;
`

export const TableRowElement = styled.div<{ isEditing?: boolean; footer?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 27px;
  flex-wrap: nowrap;
  border-bottom: 1px solid ${(p) => (p.isEditing ? 'transparent' : 'var(--lighter-grey)')};
  border-top: ${(p) => (p.footer ? '1px solid var(--lighter-grey)' : '0')};
  position: relative;
  transition: outline 0.1s ease-out;
  outline: ${(p) =>
    !p.footer ? `1px solid ${p.isEditing ? 'var(--light-blue)' : 'transparent'}` : 'none'};
  z-index: ${(p) => (p.isEditing ? 101 : 'auto')};
  user-select: ${(p) => (p.isEditing ? 'none' : 'text')};

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    outline: ${(p) =>
      !p.footer
        ? p.isEditing
          ? '1px solid var(--light-blue)'
          : `1px solid var(--lighter-blue)`
        : 'none'};
    border-bottom-color: transparent;
    z-index: 100;

    ${RowRemoveButton} {
      right: 1px;
      opacity: 1;
    }
  }
`

export const TableHeader = styled(TableRowElement)`
  outline: none !important;
  border-bottom-color: var(--lighter-grey) !important;
`

type RowPropTypes<ItemType = any, EditValueType = CellValType> = {
  index: number
  row: TableRowWithDataAndFunctions<ItemType, EditValueType>
  data?: TableRowWithDataAndFunctions<ItemType, EditValueType>[]
  style?: CSSProperties
  isScrolling?: boolean
}

export const TableRow = observer(
  <ItemType extends {}, EditValueType = CellValType>({
    row,
    style,
    index,
    data: allRows = [],
  }: RowPropTypes<ItemType, EditValueType>) => {
    let rowItem = row || allRows[index]

    if (!rowItem) {
      return null
    }

    let { itemEntries = [], key: rowKey, isEditingRow, onRemoveRow } = rowItem
    let rowId = rowKey ?? `row-${index}`

    return (
      <TableRowElement key={rowId} isEditing={isEditingRow} style={style}>
        {itemEntries.map(([key, val], colIndex) => (
          <TableCell<ItemType, EditValueType>
            key={`${rowId}_${key as string}`}
            row={rowItem}
            rowId={rowId}
            colIndex={colIndex}
            tabIndex={index * allRows.length + colIndex + 1}
            cell={[key as keyof ItemType, val]}
          />
        ))}
        {onRemoveRow && (
          <RowRemoveButton style={{ opacity: '0' }} onClick={() => onRemoveRow!(row.item)} />
        )}
      </TableRowElement>
    )
  }
)
