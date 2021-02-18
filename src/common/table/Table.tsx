import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Dictionary, difference, get, omitBy, orderBy, toString, uniqueId } from 'lodash'
import { RemoveButton } from '../components/Button'
import { ScrollContext } from '../components/AppFrame'
import Input, { TextInput } from '../input/Input'
import { useDebouncedCallback } from 'use-debounce'
import { SCROLLBAR_WIDTH } from '../../constants'
import FormSaveToolbar from '../components/FormSaveToolbar'
import { usePromptUnsavedChanges } from '../../util/promptUnsavedChanges'
import { SortConfig, SortOrder } from '../../schema-types'
import { Text } from '../../util/translate'

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

const TableInput = styled(Input).attrs(() => ({ theme: 'light' }))`
  width: 100%;
`

export const TableTextInput = styled(TextInput).attrs(() => ({ theme: 'light' }))`
  font-family: var(--font-family);
  font-size: 0.75rem;
  padding: 0.25rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  height: calc(100% + 1px);
`

const RowRemoveButton = styled(RemoveButton)`
  transition: opacity 0.05s ease-out, right 0.1s ease-out;
  right: -2rem;
  opacity: 0;
  position: absolute;
`

const TableRow = styled.div<{ isEditing?: boolean; footer?: boolean }>`
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

const TableHeader = styled(TableRow)`
  outline: none !important;
  border-bottom-color: var(--lighter-grey) !important;
`

const TableCell = styled.div<{
  editable?: boolean
  isEditing?: boolean
  isEditingRow?: boolean
  highlightColor?: string
}>`
  flex: 1 0;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: stretch;
  justify-content: center;
  font-size: 0.875rem;
  background: ${(p) =>
    p.isEditing ? 'var(--lightest-blue)' : p.highlightColor || 'rgba(0, 0, 0, 0.005)'};
  position: relative;
  cursor: ${(p) => (p.editable ? 'pointer' : 'default')};
  box-sizing: border-box !important;

  &:nth-child(odd) {
    background: ${(p) =>
      p.isEditing ? 'var(--lightest-blue)' : p.highlightColor || 'rgba(0, 0, 0, 0.025)'};
  }

  &:last-child {
    border-right: 1px solid transparent;
  }
`

const ColumnHeaderCell = styled(TableCell)<{ isEditing?: boolean }>`
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
const PageSelectorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 1rem 0rem 1rem 0rem;
`
const PageSelector = styled.div`
  span {
    margin-left: 0.5rem;
  }
`
const RowsPerPageOptions = styled.div`
  span {
    margin-left: 0.5rem;
  }
`

const PageSelectorOption = styled.span`
  cursor: pointer;
  color: var(--blue);
  padding: 0.5rem;
  transition: 0.5s;
  &:hover {
    background-color: var(--white-grey);
  }
`

export type CellValType = string | number
export type EditValue<ItemType = any> = {
  key: keyof ItemType
  value: CellValType
  item: ItemType
  itemId: string
}

export type TableEditProps<ItemType> = {
  onEditValue?: (key: keyof ItemType, value: CellValType, item: ItemType) => unknown
  pendingValues?: EditValue<ItemType>[]
  onCancelEdit?: () => unknown
  onSaveEdit?: () => unknown
  editableValues?: string[]
  isAlwaysEditable?: boolean
}

export type RenderInputType<ItemType> = (
  key: keyof ItemType,
  val: any,
  onChange: (val: any) => void,
  onAccept?: () => unknown,
  onCancel?: () => unknown,
  tabIndex?: number
) => React.ReactChild

export type TablePropTypes<ItemType> = {
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
  renderValue?: (
    key: unknown,
    val: any,
    isHeader?: boolean,
    item?: ItemType
  ) => React.ReactNode
  getColumnTotal?: (key: keyof ItemType) => React.ReactChild
  highlightRow?: (item: ItemType) => boolean | string
  renderInput?: RenderInputType<ItemType>
  visibleRowCountOptions?: number[] // Options to limit number of rows shown. Give an empty array to display all rows
  selectedRowCountIndex?: number
  maxHeight?: number
  fluid?: boolean // Fluid or calculated-then-static table and columns width
  showToolbar?: boolean // Show toolbar when there are editable values and a save function
  children?: React.ReactChild
  sort?: SortConfig[]
  setSort?: (arg: ((sort: SortConfig[]) => SortConfig[]) | SortConfig[]) => unknown
} & TableEditProps<ItemType>

const defaultKeyFromItem = (item) => item.id

const defaultRenderCellContent = (key: unknown, val: any): React.ReactChild => (
  <>
    {!(val === false || val === null || typeof val === 'undefined') && (
      <CellContent>{val}</CellContent>
    )}
  </>
)

const defaultRenderValue = (key: unknown, val: any) => toString(val)

const defaultRenderInput = <ItemType extends {}>(
  key: keyof ItemType,
  val: any,
  onChange,
  onAccept,
  onCancel,
  tabIndex
) => (
  <TableInput
    autoFocus
    tabIndex={tabIndex}
    theme="light"
    value={val}
    onChange={(value) => onChange(value)}
    name={key as string}
    onEnterPress={onAccept}
    onEscPress={onCancel}
    inputComponent={TableTextInput}
  />
)

type TableRowWithDataAndFunctions<ItemType = any> = {
  key: string
  isEditingRow: boolean
  onRemoveRow?: (item: ItemType) => void
  onMakeEditable: (key: keyof ItemType, value: CellValType) => () => unknown
  onValueChange: (key: string) => (value: CellValType) => unknown
  itemEntries: [string, CellValType][]
  item: ItemType
}

type RowPropTypes<ItemType = any> = {
  index: number
  row: TableRowWithDataAndFunctions<ItemType>
  data?: TableRowWithDataAndFunctions<ItemType>[]
  style?: CSSProperties
  isScrolling?: boolean
}

type CellPropTypes<ItemType = any> = {
  row: TableRowWithDataAndFunctions<ItemType>
  cell: [keyof ItemType, CellValType]
  colIndex: number
  tabIndex?: number
  rowId: string
}

type ContextTypes<ItemType> = {
  pendingValues?: EditValue[]
  columnWidths?: Array<number | string>
  editableValues?: TablePropTypes<ItemType>['editableValues']
  onEditValue?: TablePropTypes<ItemType>['onEditValue']
  renderInput?: TablePropTypes<ItemType>['renderInput']
  onSaveEdit?: TablePropTypes<ItemType>['onSaveEdit']
  onCancelEdit?: TablePropTypes<ItemType>['onCancelEdit']
  renderCell?: TablePropTypes<ItemType>['renderCell']
  renderValue?: TablePropTypes<ItemType>['renderValue']
  keyFromItem?: TablePropTypes<ItemType>['keyFromItem']
  fluid?: boolean
  highlightRow?: TablePropTypes<ItemType>['highlightRow']
  isAlwaysEditable?: TablePropTypes<ItemType>['isAlwaysEditable']
}

const TableContext = React.createContext<ContextTypes<any>>({})

const TableCellComponent = observer(
  <ItemType extends {}>({ row, cell, colIndex, tabIndex = 1 }: CellPropTypes<ItemType>) => {
    let ctx = useContext(TableContext)

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
      fluid,
      highlightRow = defaultHighlightRow,
      isAlwaysEditable,
    } = ctx || {}

    let [isFocused, setIsFocused] = useState(false)

    let { item, key: itemId, isEditingRow, onMakeEditable, onValueChange } = row

    let [key, val] = cell
    let valueKey = key as keyof ItemType

    let canEditCell = onEditValue && editableValues.includes((valueKey as unknown) as string)

    let editValue: EditValue<ItemType> | undefined =
      pendingValues.length !== 0
        ? pendingValues.find((val) => keyFromItem(val.item) === itemId && val.key === key)
        : isAlwaysEditable && canEditCell
        ? { key, value: val, item, itemId }
        : undefined

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

    let cellWidthStyle =
      !fluid && !!columnWidth
        ? {
            minWidth:
              typeof columnWidth === 'string'
                ? columnWidth
                : Math.min(columnWidth, 300) + 'px',
          }
        : {}

    return (
      <TableCell
        highlightColor={rowHighlightColor}
        style={cellWidthStyle}
        isEditing={!!editValue}
        isEditingRow={isEditingRow}
        editable={canEditCell}
        tabIndex={!canEditCell || editValue ? -1 : tabIndex}
        onKeyUp={!editValue && canEditCell ? onKeyUp : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onDoubleClick={makeCellEditable}>
        {onEditValue && editValue
          ? renderInput(
              key as string,
              editValue.value,
              onValueChange((valueKey as unknown) as string),
              onSaveEdit,
              onCancelEdit,
              tabIndex
            )
          : renderCell(valueKey, renderValue(valueKey, val, false, item), item)}
      </TableCell>
    )
  }
)

const TableRowComponent = observer(
  <ItemType extends {}>({ row, style, index, data: allRows = [] }: RowPropTypes<ItemType>) => {
    let rowItem = row || allRows[index]

    if (!rowItem) {
      return null
    }

    let { itemEntries = [], key: rowKey, isEditingRow, onRemoveRow } = rowItem
    let rowId = rowKey ?? `row-${index}`

    return (
      <TableRow key={rowId} isEditing={isEditingRow} style={style}>
        {itemEntries.map(([key, val], colIndex) => (
          <TableCellComponent<ItemType>
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
      </TableRow>
    )
  }
)

const defaultHighlightRow = (): string | boolean => false

const Table = observer(
  <ItemType extends {}>({
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
    visibleRowCountOptions = [],
    selectedRowCountIndex = 0,
    onEditValue,
    onCancelEdit,
    onSaveEdit,
    pendingValues = [],
    isAlwaysEditable = false,
    renderInput = defaultRenderInput,
    editableValues = [],
    maxHeight = window.innerHeight * 0.6,
    fluid = false,
    showToolbar = true,
    highlightRow = defaultHighlightRow,
    children: emptyContent,
    sort: propSort,
    setSort: propSetSort,
  }: TablePropTypes<ItemType>) => {
    let tableViewRef = useRef<null | HTMLDivElement>(null)
    let [_sort, _setSort] = useState<SortConfig[]>([])

    let sort = propSort ?? _sort
    let setSort = propSetSort ?? _setSort

    // Sort the table by some column. Multiple columns can be sorted by at the same time.
    // Sorting is performed in the order that the columns were added to the sort config.
    // Adding a column a second time switches its order between asc, desc and no sorting.
    let sortByColumn = useCallback((columnName) => {
      setSort((currentSort) => {
        if (!items[0] || !Object.keys(items[0] as {}).includes(columnName)) {
          return currentSort
        }

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

    let rows: TableRowWithDataAndFunctions<ItemType>[] = useMemo(
      () =>
        sortedItems.map((item) => {
          // Again, omit keys that start with an underscore.
          let itemEntries = Object.entries<CellValType>(item)

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
            (!!pendingValues || isAlwaysEditable) &&
            pendingValues.map((val) => keyFromItem(val.item)).includes(rowKey)

          const onMakeEditable = (key: keyof ItemType, val: CellValType) => () => {
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
            isEditingRow,
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

    // Variables to handle shown rows per page
    const areVisibleRowCountOptionsShown = visibleRowCountOptions.length > 1 // selectedRowCountIndex
    let [selectedRowCount, setSelectedRowCount] = useState<number>(
      visibleRowCountOptions[selectedRowCountIndex]
    )
    let [selectedPageIndex, setSelectedPageIndex] = useState<number>(0)
    let rowsToRender = areVisibleRowCountOptionsShown
      ? rows.slice(
          selectedPageIndex * selectedRowCount,
          (selectedPageIndex + 1) * selectedRowCount
        )
      : rows
    let pageOptions: number[] = []
    for (let i = 1; i <= Math.ceil(rows.length / selectedRowCount); i++) {
      pageOptions.push(i)
    }
    let selectedPageOptionStyles = {
      color: 'var(--dark-grey)',
      cursor: 'default',
    }

    let columnWidths: Array<string | number> = useMemo(() => {
      if (fluid) {
        let percentageWidth = columnNames.length / 100 + '%'
        return columnNames.map(() => percentageWidth)
      }

      let widths: number[] = []
      let colIdx = 0

      for (let colName of columnNames) {
        let nameLength = Math.max(colName[1].length, 8)
        let colWidth = nameLength * 10

        for (let row of rowsToRender) {
          let [colKey, colValue] = row.itemEntries[colIdx]
          let strVal = toString(renderValue(colKey as keyof ItemType, colValue))
          let valLength = Math.max(strVal.length, 5)
          colWidth = Math.max(valLength * 10, colWidth)
        }

        widths.push(Math.ceil(colWidth))
        colIdx++
      }

      return widths
    }, [columnNames, rowsToRender, fluid])

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

    let contextValue: ContextTypes<ItemType> = {
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
            <TableHeader>
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

                return (
                  <ColumnHeaderCell
                    as="button"
                    style={
                      !fluid && !!columnWidth
                        ? {
                            minWidth:
                              typeof columnWidth === 'string'
                                ? columnWidth
                                : Math.min(columnWidth, 300) + 'px',
                          }
                        : undefined
                    }
                    isEditing={isEditingColumn}
                    key={colKey}
                    onClick={() => sortByColumn(colKey)}>
                    <HeaderCellContent>
                      {renderValue('' as unknown, colName, true)}
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
                : rowsToRender.map((row, rowIndex) => (
                    <TableRowComponent key={row.key || rowIndex} row={row} index={rowIndex} />
                  ))}
            </TableBodyWrapper>
            {typeof getColumnTotal === 'function' && (
              <TableRow key="totals" footer={true}>
                {columns.map((col, colIdx) => {
                  const total =
                    getColumnTotal(col as keyof ItemType) || (colIdx === 0 ? 'Yhteensä' : '')

                  let columnWidth = fluid ? undefined : columnWidths[colIdx]

                  return (
                    <TableCell
                      key={`footer_${col}`}
                      style={
                        !fluid && !!columnWidth
                          ? {
                              minWidth:
                                typeof columnWidth === 'string'
                                  ? columnWidth
                                  : Math.min(columnWidth, 300) + 'px',
                            }
                          : undefined
                      }>
                      <CellContent footerCell={true}>{total}</CellContent>
                    </TableCell>
                  )
                })}
              </TableRow>
            )}
          </TableView>
        </TableWrapper>
        {areVisibleRowCountOptionsShown && (
          <PageSelectorContainer>
            <PageSelector>
              <PageSelectorOption
                style={selectedPageIndex === 0 ? selectedPageOptionStyles : {}}
                onClick={() =>
                  selectedPageIndex > 0
                    ? setSelectedPageIndex(selectedPageIndex - 1)
                    : undefined
                }>
                <Text>previous</Text>
              </PageSelectorOption>
              {pageOptions.map((option: number, index: number) => {
                return (
                  <PageSelectorOption
                    key={`option-${index}`}
                    onClick={() => setSelectedPageIndex(index)}
                    style={selectedPageIndex === index ? selectedPageOptionStyles : {}}>
                    {option}
                  </PageSelectorOption>
                )
              })}
              <PageSelectorOption
                style={
                  selectedPageIndex === pageOptions.length - 1 ? selectedPageOptionStyles : {}
                }
                onClick={() =>
                  selectedPageIndex < pageOptions.length - 1
                    ? setSelectedPageIndex(selectedPageIndex + 1)
                    : undefined
                }>
                <Text>next</Text>
              </PageSelectorOption>
            </PageSelector>
            <RowsPerPageOptions>
              <Text>show</Text>
              {visibleRowCountOptions.map((rowCount: number, index: number) => {
                return (
                  <PageSelectorOption
                    style={selectedRowCount === rowCount ? selectedPageOptionStyles : {}}
                    key={`option-${index}`}
                    onClick={() => {
                      setSelectedRowCount(rowCount)
                      setSelectedPageIndex(0)
                    }}>
                    {rowCount}
                  </PageSelectorOption>
                )
              })}{' '}
              <Text>table_rowsPerPage</Text>
            </RowsPerPageOptions>
          </PageSelectorContainer>
        )}
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
