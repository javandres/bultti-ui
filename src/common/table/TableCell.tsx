import styled from 'styled-components/macro'
import {
  CellValType,
  ContextTypes,
  defaultHighlightRow,
  defaultKeyFromItem,
  defaultRenderCellContent,
  defaultRenderInput,
  defaultRenderValue,
  EditValue,
  TableContext,
  TableRowWithDataAndFunctions,
} from './tableUtils'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useMemo, useState } from 'react'

export const TableCellElement = styled.div<{
  editable?: boolean
  isEditing?: boolean
  isEditingRow?: boolean
  highlightColor?: string
}>`
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: stretch;
  justify-content: center;
  font-size: 0.875rem;
  background: ${(p) =>
    p.isEditing ? 'var(--lightest-blue)' : p.highlightColor || 'rgba(0, 0, 0, 0.005)'};
  position: relative;
  cursor: ${(p) => (p.editable ? 'pointer' : 'default')};
  overflow: hidden;

  &:nth-child(odd) {
    background: ${(p) =>
      p.isEditing ? 'var(--lightest-blue)' : p.highlightColor || 'rgba(0, 0, 0, 0.025)'};
  }

  &:last-child {
    border-right: 1px solid transparent;
  }
`

export const ColumnHeaderCell = styled(TableCellElement)<{ isEditing?: boolean }>`
  padding: 0;
  font-weight: bold;
  background: ${(p) => (p.isEditing ? 'var(--lightest-blue)' : 'transparent')};
  border: 0;
  border-right: 1px solid var(--lighter-grey);
  font-family: inherit;
  color: var(--darker-grey);
  cursor: pointer;
  text-align: left;
  justify-content: flex-start;
  white-space: nowrap;
  position: relative;
  display: flex;

  &:last-child {
    border-right: 1px solid transparent;
  }
`

export const CellContent = styled.div<{ footerCell?: boolean }>`
  user-select: text;
  padding: 0.1rem 0.15rem 0.1rem 0.25rem;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  font-weight: ${(p) => (p.footerCell ? 'bold' : 'normal')};
  background: ${(p) => (p.footerCell ? 'rgba(255,255,255,0.75)' : 'transparent')};
`

type CellPropTypes<ItemType = any, EditValueType = CellValType> = {
  row: TableRowWithDataAndFunctions<ItemType, EditValueType>
  cell: [keyof ItemType, EditValueType]
  colIndex: number
  tabIndex?: number
  rowId: string
}

export const TableCell = observer(
  <ItemType extends {}, EditValueType = CellValType>({
    row,
    cell,
    colIndex,
    tabIndex = 1,
  }: CellPropTypes<ItemType, EditValueType>) => {
    let {
      pendingValues = [],
      onEditValue,
      columnWidths = [],
      renderValue = defaultRenderValue,
      editableValues = [],
      onSaveEdit,
      onCancelEdit,
      renderCell = defaultRenderCellContent,
      renderInput = defaultRenderInput,
      keyFromItem = defaultKeyFromItem,
      highlightRow = defaultHighlightRow,
      isAlwaysEditable,
    }: ContextTypes<ItemType, EditValueType> = useContext(TableContext)

    let [isFocused, setIsFocused] = useState(false)

    let { item, key: itemId, isEditingRow, onMakeEditable, onValueChange } = row

    let [key, val] = cell
    let valueKey = key as keyof ItemType

    let canEditCell = onEditValue && editableValues.includes((valueKey as unknown) as string)

    let pendingValue = pendingValues.find(
      (val) => keyFromItem(val.item) === itemId && val.key === key
    )

    let cellIsEditable = (isAlwaysEditable || !!pendingValue) && canEditCell

    let editValue = (pendingValue || {
      key,
      value: val,
      item,
      itemId,
    }) as EditValue<ItemType, EditValueType>

    let columnWidth = columnWidths[colIndex]
    let makeCellEditable = useMemo(() => onMakeEditable(valueKey, val), [valueKey, val])

    let onKeyUp = useCallback(
      (e) => {
        if (!isAlwaysEditable && isFocused && e.key === 'Enter' && canEditCell) {
          makeCellEditable()
        }
      },
      [makeCellEditable, isFocused]
    )

    let rowHighlight = highlightRow(item)
    let rowHighlightColor =
      typeof rowHighlight === 'string'
        ? rowHighlight
        : rowHighlight
        ? '--lightest-blue'
        : undefined

    let cellWidthStyle = {
      width: typeof columnWidth !== 'undefined' ? columnWidth + '%' : 'auto',
      flex: typeof columnWidth !== 'undefined' ? 'none' : '1 0 auto',
    }

    return (
      <TableCellElement
        highlightColor={rowHighlightColor}
        style={cellWidthStyle}
        isEditing={cellIsEditable}
        isEditingRow={isEditingRow}
        editable={canEditCell}
        tabIndex={!canEditCell || editValue ? -1 : tabIndex}
        onKeyUp={!editValue && canEditCell ? onKeyUp : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onDoubleClick={makeCellEditable}>
        {cellIsEditable
          ? renderInput(
              key,
              editValue.value,
              onValueChange((valueKey as unknown) as string),
              onSaveEdit,
              onCancelEdit,
              tabIndex
            )
          : renderCell(valueKey, renderValue(valueKey as string, val, false, item), item)}
      </TableCellElement>
    )
  }
)
