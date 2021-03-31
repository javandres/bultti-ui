import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Dictionary, difference, get, omitBy, orderBy, toString, uniqueId } from 'lodash'
import { ScrollContext } from '../components/AppFrame'
import Input, { TextInput } from '../input/Input'
import { useDebouncedCallback } from 'use-debounce'
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
  TableRowWithDataAndFunctions,
} from './tableUtils'
import { TableHeader, TableRow, TableRowElement } from './TableRow'
import { CellContent, ColumnHeaderCell, TableCellElement } from './TableCell'

const TableWrapper = styled.div`
  position: relative;
  width: calc(100% + 2rem);
  max-width: calc(100% + 2rem);
  border-radius: 0;
  margin: 0 -1rem 0rem -1rem;
  overflow-x: auto;

  &:last-child {
    margin-bottom: 0;
  }
`

const TableView = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
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
  fluid?: boolean // Fluid or calculated-then-static table and columns width
  showToolbar?: boolean // Show toolbar when there are editable values and a save function
  children?: React.ReactChild
  sort?: SortConfig[]
  setSort?: (arg: ((sort: SortConfig[]) => SortConfig[]) | SortConfig[]) => unknown
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
    fluid = false,
    showToolbar = true,
    highlightRow = defaultHighlightRow,
    children: emptyContent,
    sort: propSort,
    setSort: propSetSort,
  }: TablePropTypes<ItemType, EditValueType>) => {
    let tableViewRef = useRef<null | HTMLDivElement>(null)
    let [_sort, _setSort] = useState<SortConfig[]>([])

    let sort = propSort ?? _sort
    let setSort = propSetSort ?? _setSort

    // Sort the table by some column. Multiple columns can be sorted by at the same time.
    // Sorting is performed in the order that the columns were added to the sort config.
    // Adding a column a second time switches its order between asc, desc and no sorting.
    let sortByColumn = useCallback((columnName) => {
      setSort((currentSort) => {
        let currentColumnSortIndex = currentSort.findIndex((s) => s.column === columnName)
        // New array instance so that the state update will actually trigger
        let nextSort = [...currentSort]

        let columnSortConfig: SortConfig = {
          column: columnName,
          order: SortOrder.Asc, // Start sorting by asc
        }

        if (currentColumnSortIndex !== -1) {
          columnSortConfig = nextSort.splice(currentColumnSortIndex, 1)[0]

          // Reset the column after desc by returning the array without the sort config.
          if (columnSortConfig.order === SortOrder.Desc) {
            return nextSort
          }

          // If a sort config for the column was found, that means it's currently asc sorted.
          // The next order is desc.
          columnSortConfig.order = SortOrder.Desc
          nextSort.splice(currentColumnSortIndex, 0, columnSortConfig)
        } else {
          nextSort.push(columnSortConfig)
        }

        return nextSort
      })
    }, [])

    // Order the keys and get cleartext labels for the columns
    // Omit keys that start with an underscore.
    let columns = Object.keys(
      omitBy((items[0] || columnLabels) as Dictionary<ItemType>, (val, key) =>
        key.startsWith('_')
      )
    )
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

    // Order the columns by the provided columnOrder
    if (columnKeysOrdering.length !== 0) {
      columns = orderBy(columns, (key) => {
        const labelIndex = columnKeysOrdering.indexOf(key)
        return labelIndex === -1 ? 999 : labelIndex
      }).filter((c) => !keysToHide.includes(c))
    }

    // Column name array for the header row
    let columnNames = columns.map((key) => [key, key])

    // Get user-facing names for the columns
    if (columnLabelKeys.length !== 0) {
      columnNames = columns.map((key) => [key, get(columnLabels, key, key)])
    }

    let sortedItems: ItemType[] = useMemo<ItemType[]>(() => {
      if (!items || !Array.isArray(items)) {
        return []
      }

      // If the Table was provided external sort config, assume the items are already sorted.
      if (typeof propSort !== 'undefined' || sort.length === 0) {
        return items
      }

      return orderBy(
        items,
        sort.map((s) => s.column),
        sort.map((s) => (s.order === SortOrder.Desc ? 'desc' : 'asc'))
      )
    }, [items, sort])

    let rows: TableRowWithDataAndFunctions<ItemType, EditValueType>[] = useMemo(
      () =>
        sortedItems.map((item) => {
          // Again, omit keys that start with an underscore.
          let itemEntries = Object.entries<EditValueType>(item)

          itemEntries = itemEntries.filter(
            ([key]) => !key.startsWith('_') && !keysToHide.includes(key)
          )

          if (columnKeysOrdering.length !== 0) {
            itemEntries = orderBy(itemEntries, ([key]) => {
              const labelIndex = columnKeysOrdering.indexOf(key)
              return labelIndex === -1 ? 999 : labelIndex
            })
          }

          const rowKey = keyFromItem(item)

          let isEditingRow: boolean =
            isAlwaysEditable ||
            (!!pendingValues &&
              pendingValues.map((val) => keyFromItem(val.item)).includes(rowKey))

          const onMakeEditable = (key: keyof ItemType, val: EditValueType) => () => {
            if (!isEditingRow && onEditValue) {
              onEditValue(key, val, item)
            }
          }

          const onValueChange = (key) => (nextValue) => {
            if (isEditingRow && onEditValue) {
              onEditValue(key, nextValue, item)
            }
          }

          return {
            key: rowKey,
            isEditingRow: isAlwaysEditable ? false : isEditingRow,
            onRemoveRow,
            onMakeEditable,
            onValueChange,
            itemEntries,
            item,
            fluid,
          }
        }),
      [
        sortedItems,
        pendingValues,
        editableValues,
        onRemoveRow,
        onEditValue,
        keyFromItem,
        columnKeysOrdering,
        onEditValue,
        isAlwaysEditable,
      ]
    )

    let defaultColumnWidths: Array<string | number> = useMemo(() => {
      if (fluid) {
        let percentageWidth = columnNames.length / 100 + '%'
        return columnNames.map(() => percentageWidth)
      }

      let widths: number[] = []
      let colIdx = 0

      for (let colName of columnNames) {
        let nameLength = Math.max(colName[1].length, 8)
        let colWidth = nameLength * 10

        for (let row of rows) {
          let [colKey, colValue] = row.itemEntries[colIdx]
          let strVal = toString(renderValue(colKey, colValue))
          let valLength = Math.max(strVal.length, 5)
          colWidth = Math.max(valLength * 10, colWidth)
        }

        widths.push(Math.ceil(colWidth))
        colIdx++
      }

      return widths
    }, [columnNames, rows, fluid])

    let [columnWidths, setColumnWidths] = useState<Array<string | number>>(defaultColumnWidths)

    let columnDragTarget = useRef<number | undefined>(undefined)
    let columnDragStart = useRef<number>(0)

    let onDragColumn = useCallback(
      (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        let colIdx = columnDragTarget.current

        if (typeof colIdx === 'undefined') {
          return
        }

        let nextWidths = [...columnWidths]
        let currentWidth = nextWidths[colIdx] || 0

        if (typeof currentWidth === 'number') {
          let movementPx = -1 * (columnDragStart.current - Math.abs(e.nativeEvent.pageX))
          let nextWidthPx = currentWidth + movementPx

          let nextWidth = Math.min(Math.max(10, nextWidthPx), 1000)

          nextWidths.splice(colIdx, 1, nextWidth)
          setColumnWidths(nextWidths)
        }
      },
      [columnDragTarget.current, columnDragStart.current]
    )

    let onColumnDragStart = useCallback(
      (colIdx) => (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        columnDragTarget.current = colIdx
        columnDragStart.current = Math.abs(e.nativeEvent.pageX)
      },
      []
    )

    let onColumnDragEnd = useCallback((e) => {
      columnDragTarget.current = undefined
      columnDragStart.current = 0
    }, [])

    // The table is empty if we don't have any items,
    // OR
    // When there is one item with only falsy values (which still gives the column names)
    let tableIsEmpty =
      items.length === 0 ||
      (items.length === 1 && Object.values(items[0]).every((val) => !val))

    let width =
      fluid || columnWidths.some((w) => typeof w === 'string')
        ? '100%'
        : Math.ceil(
            columnWidths.reduce((total: number, col) => {
              if (typeof col !== 'number') {
                return total
              }

              return total + col
            }, 0)
          )

    // Scroll listeners for the floating toolbar.
    let [currentScroll, setCurrentScroll] = useState({ scrollTop: 0, viewportHeight: 0 })
    let subscribeToScroll = useContext(ScrollContext)

    let { callback: debouncedSetScroll } = useDebouncedCallback(
      (scrollTop: number, viewportHeight: number) => {
        setCurrentScroll({ scrollTop, viewportHeight })
      },
      50
    )

    // Subscribe to the scroll position only when there are items being edited.
    useEffect(() => {
      if (pendingValues.length !== 0) {
        subscribeToScroll(debouncedSetScroll)
      }
    }, [subscribeToScroll, pendingValues, debouncedSetScroll])

    let toolbarIsFloating = useMemo(() => {
      if (pendingValues.length === 0 || !tableViewRef.current) {
        return false
      }

      let { scrollTop, viewportHeight } = currentScroll

      let tableBox: DOMRect = tableViewRef.current?.getBoundingClientRect()
      let tableTop = scrollTop + tableBox.top
      let tableBottom = tableTop + tableBox.height
      let scrollBottom = scrollTop + viewportHeight

      return scrollBottom < tableBottom + 58 && scrollBottom > tableTop + 58
    }, [tableViewRef.current, currentScroll, pendingValues])

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
      fluid,
      highlightRow,
      isAlwaysEditable,
    }

    let tableViewWidth = fluid ? '100%' : width
    const formId = useMemo(() => uniqueId(), [])

    usePromptUnsavedChanges({
      uniqueComponentId: formId,
      shouldShowPrompt: pendingValues.length !== 0 && !!onSaveEdit,
    })

    return (
      <TableContext.Provider value={contextValue}>
        <TableWrapper
          className={className}
          style={{ overflowX: fluid ? 'auto' : 'scroll' }}
          ref={tableViewRef}>
          <TableView style={{ minWidth: tableViewWidth + 'px' }}>
            <TableHeader
              onDrag={() => false}
              onDragStart={() => false}
              onDragEnd={() => false}
              onMouseMove={onDragColumn}>
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
                      userSelect:
                        typeof columnDragTarget.current !== 'undefined' ? 'none' : 'all',
                      width: !fluid && typeof columnWidth !== 'undefined' ? columnWidth : 0,
                    }}
                    isEditing={isEditingColumn}
                    key={colKey}
                    onMouseDown={onMouseDownHandler}
                    onMouseUp={onColumnDragEnd}
                    onClick={() => sortByColumn(colKey)}>
                    <HeaderCellContent>
                      {renderValue('', colName, true)}
                      {sortIndex !== -1 && (
                        <ColumnSortIndicator>
                          {sortIndex + 1} {sortConfig.order === SortOrder.Asc ? '▲' : '▼'}
                        </ColumnSortIndicator>
                      )}
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

                  let columnWidth = fluid ? undefined : columnWidths[colIdx]

                  return (
                    <TableCellElement
                      key={`footer_${col}`}
                      style={
                        !fluid && typeof columnWidth !== 'undefined'
                          ? {
                              width: columnWidth,
                            }
                          : undefined
                      }>
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
