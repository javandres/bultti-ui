import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference, get, omitBy, orderBy } from 'lodash'
import { Button, ButtonSize, ButtonStyle, RemoveButton } from './Button'
import { CrossThick } from '../icon/CrossThick'
import { Checkmark2 } from '../icon/Checkmark2'
import { ScrollContext } from './AppFrame'
import { Info } from '../icon/Info'
import { FixedSizeList as List } from 'react-window'
import { useResizeObserver } from '../../util/useResizeObserver'
import { TextInput } from '../input/Input'

const TableWrapper = styled.div`
  position: relative;
  width: calc(100% + 2rem);
  border-top: 1px solid var(--lighter-grey);
  border-bottom: 1px solid var(--lighter-grey);
  border-radius: 0;
  margin: 0 -1rem 1rem -1rem;
`

const TableView = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;

  &:last-child {
    margin-bottom: 0;
  }
`

const EditInputWrapper = styled.div`
  width: calc(100% + 1rem + 36px);
  border-radius: 5px;
  display: flex;
`

export const TableInput = styled(TextInput).attrs(() => ({ theme: 'light' }))`
  font-family: var(--font-family);
  font-size: 0.75rem;
  padding: 0.25rem;
  border: 0;
  border-radius: 0;
  background: transparent;
`

const EditToolbar = styled.div<{ floating?: boolean }>`
  position: ${(p) => (p.floating ? 'fixed' : 'static')};
  bottom: 1rem;
  border-radius: ${(p) => (p.floating ? '0.5rem' : 0)};
  background: white;
  padding: ${(p) => (p.floating ? '1rem' : '0.25rem 1rem 1.25rem')};
  margin: ${(p) => (p.floating ? 0 : '0 -1rem 1.25rem -1rem')};
  left: ${(p) => (p.floating ? '29rem' : 'auto')};
  width: ${(p) =>
    p.floating
      ? 'calc(100% - 32rem - 2px)'
      : 'calc(100% + 2rem)'}; // Remove sidebar width when floating.
  z-index: 100;
  font-size: 1rem;
  box-shadow: ${(p) => (p.floating ? '0 0 10px rgba(0,0,0,0.2)' : 'none')};
  border: ${(p) => (p.floating ? '1px solid var(--lighter-grey)' : 0)};
  border-bottom: 1px solid var(--lighter-grey);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  transition: padding 0.2s ease-out, left 0.2s ease-out, bottom 0.2s ease-out;
`

const ToolbarDescription = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.75rem;
  }
`

const CancelButton = styled(Button)`
  position: static;
  display: flex;
  color: var(--red);
  background: white;
`

const SaveButton = styled(Button)`
  background: var(--green);
  margin-right: 1rem;
`

const TableRow = styled.div<{ isEditing?: boolean; footer?: boolean }>`
  display: flex;
  border-bottom: 1px solid ${(p) => (p.isEditing ? 'transparent' : 'var(--lighter-grey)')};
  border-top: ${(p) => (p.footer ? '1px solid var(--lighter-grey)' : '0')};
  position: relative;
  transition: outline 0.1s ease-out;
  outline: ${(p) =>
    !p.footer ? `1px solid ${p.isEditing ? 'var(--light-blue)' : 'transparent'}` : 'none'};
  z-index: ${(p) => (p.isEditing ? 101 : 'auto')};

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

    ${RemoveButton} {
      display: flex;
    }
  }
`

const RowRemoveButton = styled(RemoveButton)`
  position: absolute;
  left: 0.4rem;
  top: 0.4rem;
  display: none;
`

const TableHeader = styled(TableRow)`
  outline: none !important;
  border-bottom-color: var(--lighter-grey) !important;
  flex: 0;
`

const TableCell = styled.div<{
  editable?: boolean
  isEditing?: boolean
  isEditingRow?: boolean
  columnWidth?: number
}>`
  flex: 1 1 auto;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: stretch;
  justify-content: center;
  font-size: 0.75rem;
  background: ${(p) => (p.isEditing ? 'var(--lightest-blue)' : 'rgba(0, 0, 0, 0.005)')};
  position: relative;
  cursor: ${(p) => (p.editable ? 'pointer' : 'default')};
  width: ${(p) => (!p.columnWidth ? 'auto' : p.columnWidth + 'px')};

  &:last-of-type {
    border-right: 0;
  }

  &:nth-child(odd) {
    background: rgba(0, 0, 0, 0.025);
  }
`

const ColumnHeaderCell = styled(TableCell)<{ isEditing?: boolean }>`
  padding: 0.5rem 1.5rem 0.4rem 0.5rem;
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
  padding: 0.5rem 0.15rem;
  border: 0;
  background: transparent;
  display: block;
  width: 100%;
  text-align: center;
  font-weight: ${(p) => (p.footerCell ? 'bold' : 'normal')};
  background: ${(p) => (p.footerCell ? 'rgba(255,255,255,0.75)' : 'transparent')};
`

type ItemRemover = undefined | false | null | (() => void)

export type CellValType = string | number | null
export type EditValue<ItemType = any> = { key: string; value: CellValType; item: ItemType }

export type PropTypes<ItemType> = {
  items: ItemType[]
  columnLabels?: { [key in keyof ItemType]?: string }
  columnOrder?: string[]
  hideKeys?: string[]
  indexCell?: React.ReactChild
  keyFromItem?: (item: ItemType) => string
  onRemoveRow?: (item: ItemType) => undefined | ItemRemover
  canRemoveRow?: (item: ItemType) => boolean
  className?: string
  renderCell?: (key: string, val: any, item?: ItemType) => React.ReactNode
  renderValue?: (key: string, val: any, isHeader?: boolean, item?: ItemType) => React.ReactNode
  getColumnTotal?: (key: string) => React.ReactChild
  onEditValue?: (key: string, value: CellValType, item: ItemType) => unknown
  pendingValues?: EditValue<ItemType>[]
  onCancelEdit?: () => unknown
  onSaveEdit?: () => unknown
  editableValues?: string[]
  renderInput?: (
    key: keyof ItemType,
    val: any,
    onChange: (val: any) => void,
    onAccept?: () => unknown,
    onCancel?: () => unknown
  ) => React.ReactChild
  virtualized?: boolean
  maxHeight?: number
  children?: React.ReactChild
}

const defaultKeyFromItem = (item) => item.id

const defaultRenderCellContent = (key: string, val: any): React.ReactChild => (
  <>
    {!(val === false || val === null || typeof val === 'undefined') && (
      <CellContent>{val}</CellContent>
    )}
  </>
)

const defaultRenderValue = (key, val) => val

const defaultRenderInput = (key, val, onChange) => (
  <TableInput
    theme="light"
    value={val}
    onChange={(e) => onChange(e.target.value)}
    name={key}
  />
)

type SortConfig = {
  column: string
  order: 'asc' | 'desc'
}

type TableRowWithDataAndFunctions<ItemType = any> = {
  key: string
  isEditingRow: boolean
  removeItem: ItemRemover
  onMakeEditable: (key: string, value: CellValType) => () => unknown
  onValueChange: (key: string) => (value: CellValType) => unknown
  itemEntries: [keyof ItemType, CellValType][]
  item: ItemType
}

const Table = observer(
  <ItemType extends any>({
    items,
    columnLabels = {},
    columnOrder = [],
    hideKeys,
    indexCell = '',
    keyFromItem = defaultKeyFromItem,
    onRemoveRow,
    canRemoveRow = (item) => !!onRemoveRow,
    renderCell = defaultRenderCellContent,
    renderValue = defaultRenderValue,
    getColumnTotal,
    className,
    onEditValue,
    onCancelEdit,
    onSaveEdit,
    pendingValues = [],
    renderInput = defaultRenderInput,
    editableValues = [],
    virtualized = false,
    maxHeight = window.innerHeight * 0.75,
    children: emptyContent,
  }: PropTypes<ItemType>) => {
    let tableViewRef = useRef<null | HTMLDivElement>(null)
    let [sort, setSort] = useState<SortConfig[]>([])
    let [columnWidths, setColumnWidths] = useState<number[]>([])

    let setColumnWidth = useCallback((index, width) => {
      setColumnWidths((currentWidths) => {
        let nextWidths = [...currentWidths]
        let curWidth = nextWidths[index] || 0

        if (!curWidth || width !== curWidth) {
          nextWidths.splice(index, 0, width)
          return nextWidths
        }

        return currentWidths
      })
    }, [])

    let setWidthFromCellRef = useCallback(
      (ref, index) => {
        if (ref) {
          let rect = ref.getBoundingClientRect()

          if (rect && rect.width) {
            setColumnWidth(index, rect.width)
          }
        }
      },
      [setColumnWidth]
    )

    // Sort the table by some column. Multiple columns can be sorted by at the same time.
    // Sorting is performed in the order that the columns were added to the sort config.
    // Adding a column a second time switches its
    let sortByColumn = useCallback((columnName) => {
      setSort((currentSort) => {
        if (!Object.keys(items[0]).includes(columnName)) {
          return currentSort
        }

        let currentColumnSortIndex = currentSort.findIndex((s) => s.column === columnName)
        // New array instance so that the state update will actually trigger
        let nextSort = [...currentSort]

        let columnSortConfig: SortConfig = {
          column: columnName,
          order: 'asc', // Start sorting by asc
        }

        if (currentColumnSortIndex !== -1) {
          columnSortConfig = nextSort.splice(currentColumnSortIndex, 1)[0]

          // Reset the column after desc by returning the array without the sort config.
          if (columnSortConfig.order === 'desc') {
            return nextSort
          }

          // If a sort config for the column was found, that means it's currently asc sorted.
          // The next order is desc.
          columnSortConfig.order = 'desc'
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
      omitBy(items[0] || columnLabels, (val, key) => key.startsWith('_'))
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

    // Scroll listeners for the floating toolbar.
    let [currentScroll, setCurrentScroll] = useState(0)
    let subscribeToScroll = useContext(ScrollContext)

    useEffect(() => {
      if (pendingValues.length !== 0) {
        subscribeToScroll(setCurrentScroll)
      }
    }, [subscribeToScroll, pendingValues])

    let toolbarIsFloating = useMemo(() => {
      if (pendingValues.length === 0 || !tableViewRef.current) {
        return false
      }

      let tableBox = tableViewRef.current?.getBoundingClientRect()
      let tableBottomEdge = tableBox.bottom + 75

      return currentScroll < tableBottomEdge
    }, [tableViewRef.current, currentScroll, pendingValues])

    let sortedItems = useMemo(() => {
      if (!items || !Array.isArray(items)) {
        return []
      }

      if (sort.length === 0) {
        return items
      }

      return orderBy(
        items,
        sort.map((s) => s.column),
        sort.map((s) => s.order)
      )
    }, [items, sort])

    let getListItemKey = useCallback((index, data) => {
      let item = data[index]
      return item.key
    }, [])

    let rows: TableRowWithDataAndFunctions<ItemType>[] = useMemo(
      () =>
        sortedItems.map((item) => {
          // Again, omit keys that start with an underscore.
          let itemEntries = Object.entries(item).filter(
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
            !!pendingValues &&
            pendingValues.map((val) => keyFromItem(val.item)).includes(rowKey)

          const itemRemover = onRemoveRow && canRemoveRow(item) ? onRemoveRow(item) : null

          const onMakeEditable = (key: string, val: CellValType) => () => {
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
            removeItem: itemRemover,
            onMakeEditable,
            onValueChange,
            itemEntries,
            item,
          }
        }),
      [
        sortedItems,
        pendingValues,
        editableValues,
        canRemoveRow,
        onRemoveRow,
        onEditValue,
        keyFromItem,
        columnKeysOrdering,
      ]
    )

    let TableCellComponent = useCallback(
      ({
        row,
        cell,
        cellIndex,
      }: {
        row: TableRowWithDataAndFunctions
        cell: [keyof ItemType, CellValType]
        cellIndex: number
      }) => {
        let { item, key: itemId, isEditingRow, onMakeEditable, onValueChange } = row

        if (!itemId) {
          return null
        }

        let [key, val] = cell
        let valueKey: string = key as string

        let editValue =
          pendingValues.length !== 0
            ? pendingValues.find((val) => val.item.id === itemId && val.key === key)
            : null

        let columnWidth = columnWidths[cellIndex] || 0

        return (
          <TableCell
            columnWidth={columnWidth}
            isEditing={!!editValue}
            isEditingRow={isEditingRow}
            editable={editableValues?.includes(valueKey)}
            onDoubleClick={onMakeEditable(valueKey, val)}>
            {onEditValue && editValue ? (
              <>
                <EditInputWrapper>
                  {renderInput(
                    key as keyof ItemType,
                    editValue.value,
                    onValueChange(valueKey),
                    onSaveEdit,
                    onCancelEdit
                  )}
                </EditInputWrapper>
              </>
            ) : (
              renderCell(valueKey, renderValue(valueKey, val, false, item), item)
            )}
          </TableCell>
        )
      },
      [
        onSaveEdit,
        onCancelEdit,
        pendingValues,
        editableValues,
        onEditValue,
        renderInput,
        renderCell,
        renderValue,
        columnWidths,
      ]
    )

    let TableRowComponent = useCallback(
      ({
        row,
        style,
        index,
        data: allRows = [],
      }: {
        data?: TableRowWithDataAndFunctions[]
        row?: TableRowWithDataAndFunctions
        index: number
        style?: CSSProperties
      }) => {
        let rowItem = row || allRows[index]

        if (!rowItem) {
          return null
        }

        let { itemEntries, key: rowKey, isEditingRow, removeItem } = rowItem

        return (
          <TableRow key={rowKey ?? `row-${index}`} isEditing={isEditingRow} style={style}>
            {itemEntries.map(([key, val], index) => (
              <TableCellComponent
                row={rowItem}
                cellIndex={index}
                cell={[key as string, val]}
                key={`${rowKey}_${index}`}
              />
            ))}
            {!isEditingRow && removeItem && (
              <RowRemoveButton onClick={removeItem}>
                <CrossThick fill="white" width="0.5rem" height="0.5rem" />
              </RowRemoveButton>
            )}
          </TableRow>
        )
      },
      [TableCellComponent]
    )

    let rowsContainerRef = useRef(null)
    let { width = 0 } = useResizeObserver(rowsContainerRef)

    let rowHeight = 27
    let listHeight = rows.length * rowHeight // height of all rows combined
    let height = Math.min(maxHeight, listHeight) // Limit height to maxheight if needed

    // The table is empty if we don't have any items,
    // OR
    // When there is one item with only falsy values (which still gives the column names)
    let tableIsEmpty =
      items.length === 0 ||
      (items.length === 1 && Object.values(items[0]).every((val) => !val))

    return (
      <TableWrapper className={className}>
        <TableView ref={tableViewRef}>
          <TableHeader
            style={{ paddingRight: virtualized && maxHeight < listHeight ? 15 : 0 }}>
            {indexCell && (
              <ColumnHeaderCell style={{ fontSize: '0.6rem', fontWeight: 'normal' }}>
                {indexCell}
              </ColumnHeaderCell>
            )}
            {columnNames.map(([colKey, colName], colIdx) => {
              let isEditingColumn =
                pendingValues.length !== 0 &&
                pendingValues.map((val) => val.key).includes(colKey)

              let sortIndex = sort.findIndex((s) => s.column === colKey)
              let sortConfig = sort[sortIndex]

              return (
                <ColumnHeaderCell
                  ref={(ref) => setWidthFromCellRef(ref, colIdx)}
                  as="button"
                  isEditing={isEditingColumn}
                  key={colName}
                  onClick={() => sortByColumn(colKey)}>
                  {renderValue('', colName, true)}
                  {sortIndex !== -1 && (
                    <ColumnSortIndicator>
                      {sortIndex + 1} {sortConfig.order === 'asc' ? '▲' : '▼'}
                    </ColumnSortIndicator>
                  )}
                </ColumnHeaderCell>
              )
            })}
          </TableHeader>
          <div
            ref={rowsContainerRef}
            style={{
              position: 'relative',
              width: '100%',
            }}>
            {tableIsEmpty ? (
              emptyContent
            ) : virtualized ? (
              <List
                height={height}
                width={width}
                itemCount={rows.length}
                itemSize={rowHeight}
                layout="vertical"
                itemData={rows}
                itemKey={getListItemKey}>
                {TableRowComponent}
              </List>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRowComponent key={row.key || rowIndex} row={row} index={rowIndex} />
              ))
            )}
          </div>
          {typeof getColumnTotal === 'function' && (
            <TableRow key="totals" footer={true}>
              {columns.map((col, colIdx) => {
                const total = getColumnTotal(col) || (colIdx === 0 ? 'Yhteensä' : '')

                return (
                  <TableCell key={`footer_${col}`}>
                    <CellContent footerCell={true}>{total}</CellContent>
                  </TableCell>
                )
              })}
            </TableRow>
          )}
        </TableView>
        {(!!onSaveEdit || !!onCancelEdit) && pendingValues.length !== 0 && (
          <EditToolbar floating={toolbarIsFloating}>
            <ToolbarDescription>
              <Info fill="var(--dark-grey)" width={20} height={20} />
              Muista tallentaa taulukkoon tekemäsi muutokset.
            </ToolbarDescription>
            <SaveButton
              onClick={onSaveEdit}
              size={ButtonSize.MEDIUM}
              buttonStyle={ButtonStyle.NORMAL}>
              <Checkmark2 fill="white" width="0.5rem" height="0.5rem" />
              Tallenna muutokset
            </SaveButton>
            <CancelButton
              onClick={onCancelEdit}
              size={ButtonSize.MEDIUM}
              buttonStyle={ButtonStyle.SECONDARY_REMOVE}>
              <CrossThick fill="var(--red)" width="0.5rem" height="0.5rem" />
              Peruuta
            </CancelButton>
          </EditToolbar>
        )}
      </TableWrapper>
    )
  }
)

export default Table
