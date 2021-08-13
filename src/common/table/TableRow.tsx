import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { TableItemType, TableRowWithDataAndFunctions } from './tableUtils'
import React, { CSSProperties } from 'react'
import { RemoveButton } from '../components/buttons/Button'
import { TableCell } from './TableCell'

export const ROW_HEIGHT = 30

export const RowRemoveButton = styled(RemoveButton)`
  transition: opacity 0.05s ease-out, right 0.1s ease-out;
  right: 1px;
  opacity: 0;
  position: absolute;
  pointer-events: none;
`

export const TableRowElement = styled.div<{ isEditing?: boolean; footer?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: ${ROW_HEIGHT}px;
  flex-wrap: nowrap;
  position: relative;
  transition: outline 0.1s ease-out;
  outline: ${(p) =>
    !p.footer ? `1px solid ${p.isEditing ? 'var(--light-blue)' : 'transparent'}` : 'none'};
  z-index: ${(p) => (p.isEditing ? 101 : 'auto')};
  user-select: ${(p) => (p.isEditing ? 'none' : 'text')};

  &:hover {
    outline: ${(p) =>
      !p.footer
        ? p.isEditing
          ? '1px solid var(--light-blue)'
          : `1px solid var(--lighter-blue)`
        : 'none'};
    z-index: 100;

    ${RowRemoveButton} {
      pointer-events: all;
      opacity: 1;
    }
  }
`

export const TableHeader = styled(TableRowElement)`
  outline: none !important;
  border-bottom-color: var(--lighter-grey) !important;
`

type RowPropTypes<ItemType extends TableItemType> = {
  index: number
  row: TableRowWithDataAndFunctions<ItemType>
  data?: TableRowWithDataAndFunctions<ItemType>[]
  style?: CSSProperties
  isScrolling?: boolean
  getRowHighlightColor: (item: TableRowWithDataAndFunctions<ItemType>) => string
  getCellHighlightColor: (item: TableRowWithDataAndFunctions<ItemType>, key: string) => string
  testId?: string
}

export const TableRow = observer(
  <ItemType extends TableItemType>({
    row,
    style,
    index,
    getRowHighlightColor,
    getCellHighlightColor,
    data: allRows = [],
    testId,
  }: RowPropTypes<ItemType>) => {
    let rowItem = row || allRows[index]

    if (!rowItem) {
      return null
    }

    let { itemEntries = [], key: rowKey, isEditingRow, onRemoveRow } = rowItem
    let rowId = rowKey ?? `row-${index}`

    let rowHighlightColor = getRowHighlightColor(rowItem)

    return (
      <TableRowElement key={rowId} isEditing={isEditingRow} style={style} data-cy={testId}>
        {itemEntries.map(([key, val], colIndex) => (
          <TableCell<ItemType>
            testId={`${testId}_col_${colIndex}`}
            key={`${rowId}_${key as string}`}
            row={rowItem}
            rowId={rowId}
            colIndex={colIndex}
            tabIndex={index * allRows.length + colIndex + 1}
            cell={[key as keyof ItemType, val]}
            cellHighlightColor={
              rowHighlightColor !== ''
                ? rowHighlightColor
                : getCellHighlightColor(rowItem, key as string)
            }
          />
        ))}
        {onRemoveRow && (
          <RowRemoveButton
            data-cy={`${testId}_remove_btn`}
            style={{ opacity: '0' }}
            onClick={() => onRemoveRow!(row.item)}
          />
        )}
      </TableRowElement>
    )
  }
)
