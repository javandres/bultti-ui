import React, { useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { uniqueId } from 'lodash'
import Input, { TextInput } from '../input/Input'
import FormSaveToolbar from '../components/FormSaveToolbar'
import { usePromptUnsavedChanges } from '../../util/promptUnsavedChanges'
import { SortConfig, SortOrder } from '../../schema-types'
import {
  CellValType,
  ContextTypes,
  defaultHighlightRow,
  defaultKeyFromItem,
  defaultRenderCellContent,
  defaultRenderInput,
  defaultRenderValue,
  RenderInputType,
  TableContext,
  TableEditProps,
} from './tableUtils'
import { ROW_HEIGHT, TableHeader, TableRow, TableRowElement } from './TableRow'
import { CellContent, ColumnHeaderCell, TableCellElement } from './TableCell'
import { useColumnResize } from './useColumnResize'
import { useTableSorting } from './useTableSorting'
import { useFloatingToolbar } from './useFloatingToolbar'
import { useTableRows } from './useTableRows'
import { SCROLLBAR_WIDTH } from '../../constants'
import { getTotalNumbers } from '../../util/getTotal'

const TableWrapper = styled.div<{ height: number }>`
  position: relative;
  width: calc(100% + 2rem);
  border-radius: 0;
  overflow: hidden;
  overflow-x: scroll;
  margin: 0 -1rem 0rem -1rem;
  height: ${(p) => p.height || 60}px;

  &:last-child {
    margin-bottom: 0;
  }
`

const TableView = styled.div<{ width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  min-width: ${(p) => p.width}%;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--lighter-grey);
  border-bottom: 1px solid var(--lighter-grey);
`

export const TableInput = styled(Input)`
  width: 100%;
`

export const TableTextInput = styled(TextInput)`
  font-family: var(--font-family);
  font-size: 0.75rem;
  padding: 0.25rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  height: calc(100% + 1px);
`

const HeaderCellContent = styled.div`
  padding: 0.25rem 25px 0.1rem 0.25rem;
  width: 100%;
`

const TableBodyWrapper = styled.div`
  width: 100%;
  position: relative;
`

const ColumnSortIndicator = styled.div`
  position: absolute;
  font-weight: normal;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 0.25rem 0 0.75rem;
`

export type TablePropTypes<ItemType, EditValueType = CellValType> = {
  items: ItemType[]
  columnLabels?: { [key in keyof ItemType]?: string }
  columnOrder?: string[]
  hideKeys?: string[]
  indexCell?: React.ReactChild
  keyFromItem?: (item: ItemType) => string
  onRemoveRow?: (item: ItemType) => unknown
  canRemoveRow?: (item: ItemType) => boolean
  className?: string
  renderCell?: (key: keyof ItemType, val: any, item?: ItemType) => React.ReactNode
  renderValue?: (key: string, val: any, isHeader?: boolean, item?: ItemType) => React.ReactNode
  getColumnTotal?: (key: string) => React.ReactChild
  highlightRow?: (item: ItemType) => boolean | string
  renderInput?: RenderInputType<ItemType>
  maxHeight?: number
  showToolbar?: boolean // Show toolbar when there are editable values and a save function
  children?: React.ReactChild
  sort?: SortConfig[]
  setSort?: (arg: ((sort: SortConfig[]) => SortConfig[]) | SortConfig[]) => unknown
  isResizeEnabled?: boolean
} & TableEditProps<ItemType, EditValueType>

const Table = observer(
  <ItemType extends {}, EditValueType = CellValType>({
    items,
    columnLabels = {},
    columnOrder = [],
    hideKeys,
    indexCell = '',
    keyFromItem = defaultKeyFromItem,
    onRemoveRow,
    renderCell = defaultRenderCellContent,
    renderValue = defaultRenderValue,
    getColumnTotal,
    className,
    onEditValue,
    onCancelEdit,
    onSaveEdit,
    pendingValues = [],
    isAlwaysEditable = false,
    renderInput = defaultRenderInput,
    editableValues = [],
    showToolbar = true,
    highlightRow = defaultHighlightRow,
    children: emptyContent,
    sort: propSort,
    setSort: propSetSort,
    isResizeEnabled = true,
  }: TablePropTypes<ItemType, EditValueType>) => {
    const formId = useMemo(() => uniqueId(), [])

    let tableViewRef = useRef<null | HTMLDivElement>(null)
    let [_sort, _setSort] = useState<SortConfig[]>([])

    let sort = propSort ?? _sort
    let setSort = propSetSort ?? _setSort

    let { sortByColumn, sortedItems } = useTableSorting({
      items,
      sort,
      setSort,
      itemsAreSorted: typeof propSort !== 'undefined',
    })

    let { columnNames, columns, rows } = useTableRows<ItemType, EditValueType>({
      items: sortedItems,
      pendingValues,
      editableValues,
      onRemoveRow,
      keyFromItem,
      onEditValue,
      isAlwaysEditable,
      columnLabels,
      columnOrder,
      hideKeys,
    })

    let toolbarIsFloating = useFloatingToolbar(tableViewRef, pendingValues.length !== 0)

    // The table is empty if we don't have any items,
    // OR
    // When there is one item with only falsy values (which still gives the column names)
    let tableIsEmpty =
      items.length === 0 ||
      (items.length === 1 && Object.values(items[0]).every((val) => !val))

    let { onDragColumn, onColumnDragEnd, onColumnDragStart, columnWidths } = useColumnResize(
      columnNames,
      isResizeEnabled
    )

    let contextValue: ContextTypes<ItemType, EditValueType> = {
      columnWidths,
      editableValues,
      pendingValues,
      onEditValue,
      onSaveEdit,
      onCancelEdit,
      renderCell,
      renderInput,
      renderValue,
      keyFromItem,
      highlightRow,
      isAlwaysEditable,
    }

    usePromptUnsavedChanges({
      uniqueComponentId: formId,
      shouldShowPrompt: pendingValues.length !== 0 && !!onSaveEdit,
    })

    let showFooterRow = typeof getColumnTotal === 'function'

    // Table content is floating inside the TableWrapper in position:absolute to facilitate
    // horizontal scrolling. Table height thus needs to be calculated for the wrapper to show
    // the whole table.
    // Row height is always a static value, so the table height can be calculated by summing
    // rows length plus one for the header row, and multiplying that by the ROW_HEIGHT.
    // Then add scrollbar width to prevent the scrollbar from blocking anything.
    let tableHeight = (items.length + 1) * ROW_HEIGHT + SCROLLBAR_WIDTH

    if (showFooterRow) {
      // If the footer is visible, add one more row height for that.
      tableHeight += ROW_HEIGHT
    }

    let tableWidth = getTotalNumbers(columnWidths)

    return (
      <TableContext.Provider value={contextValue}>
        <TableWrapper className={className} ref={tableViewRef} height={tableHeight}>
          <TableView width={Math.max(100, tableWidth)}>
            <TableHeader
              onMouseMove={onDragColumn}
              onMouseLeave={onColumnDragEnd}
              onMouseUp={onColumnDragEnd}>
              {indexCell && (
                <ColumnHeaderCell style={{ fontSize: '0.6rem', fontWeight: 'normal' }}>
                  {indexCell}
                </ColumnHeaderCell>
              )}
              {columnNames.map(([colKey, colName], colIdx) => {
                let isEditingColumn =
                  pendingValues.length !== 0 &&
                  pendingValues.map((val) => val.key).includes(colKey as keyof ItemType)

                let sortIndex = sort.findIndex((s) => s.column === colKey)
                let sortConfig = sort[sortIndex]
                let columnWidth = columnWidths[colIdx]
                let onMouseDownHandler = onColumnDragStart(colIdx)

                return (
                  <ColumnHeaderCell
                    as="button"
                    style={{
                      userSelect: 'none',
                      width: typeof columnWidth !== 'undefined' ? columnWidth + '%' : 'auto',
                      flex: typeof columnWidth !== 'undefined' ? 'none' : '1 1 auto',
                    }}
                    isEditing={isEditingColumn}
                    key={colKey}
                    onMouseDown={onMouseDownHandler}>
                    <HeaderCellContent>
                      {renderValue('', colName, true)}
                      <ColumnSortIndicator onClick={() => sortByColumn(colKey)}>
                        {sortIndex !== -1 ? (
                          <>
                            {sortIndex + 1} {sortConfig.order === SortOrder.Asc ? '▲' : '▼'}
                          </>
                        ) : (
                          <span>⇵</span>
                        )}
                      </ColumnSortIndicator>
                    </HeaderCellContent>
                  </ColumnHeaderCell>
                )
              })}
            </TableHeader>
            <TableBodyWrapper>
              {tableIsEmpty
                ? emptyContent
                : rows.map((row, rowIndex) => (
                    <TableRow<ItemType, EditValueType>
                      key={row.key || rowIndex}
                      row={row}
                      index={rowIndex}
                    />
                  ))}
            </TableBodyWrapper>
            {typeof getColumnTotal === 'function' && (
              <TableRowElement key="totals" footer={true}>
                {columns.map((col, colIdx) => {
                  const total = getColumnTotal(col) || (colIdx === 0 ? 'Yhteensä' : '')
                  let columnWidth = columnWidths[colIdx]

                  return (
                    <TableCellElement
                      key={`footer_${col}`}
                      style={{
                        width: typeof columnWidth !== 'undefined' ? columnWidth + '%' : 'auto',
                        flex: typeof columnWidth !== 'undefined' ? 'none' : '1 1 auto',
                      }}>
                      <CellContent footerCell={true}>{total}</CellContent>
                    </TableCellElement>
                  )
                })}
              </TableRowElement>
            )}
          </TableView>
        </TableWrapper>
        {showToolbar && (!!onSaveEdit || !!onCancelEdit) && pendingValues.length !== 0 && (
          <FormSaveToolbar
            onSave={onSaveEdit!}
            onCancel={onCancelEdit!}
            floating={toolbarIsFloating}
          />
        )}
      </TableContext.Provider>
    )
  }
)

export default Table
