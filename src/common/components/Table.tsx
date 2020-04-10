import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference, get, omitBy, orderBy } from 'lodash'
import { Button, ButtonSize } from './Button'
import { CrossThick } from '../icon/CrossThick'
import { TextInput } from '../input/Input'
import { Checkmark2 } from '../icon/Checkmark2'

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
  left: 0.4rem;
  top: 0.4rem;
  display: none;

  svg {
    margin: 0;
  }
`

const EditInputWrapper = styled.div`
  position: absolute;
  z-index: 200;
  top: -0.5rem;
  bottom: -0.5rem;
  left: -0.5rem;
  background: var(--blue);
  width: calc(100% + 1rem + 36px);
  border-radius: 5px;
  padding: 0.5rem;
  display: flex;
`

const EditButtonsWrapper = styled.div`
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
`

const CancelButton = styled(RemoveButton)`
  border: 1px solid white;
  position: static;
  display: flex;
`
const SaveButton = styled(CancelButton)`
  background: var(--green);
  margin-left: 0.5rem;
`

const TableRow = styled.div<{ isEditing?: boolean; footer?: boolean }>`
  display: flex;
  border-bottom: 1px solid var(--lighter-grey);
  position: relative;
  transition: outline 0.1s ease-out;
  outline: ${(p) =>
    !p.footer ? `1px solid ${p.isEditing ? 'var(--light-blue)' : 'transparent'}` : 'none'};

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    outline: ${(p) => (!p.footer ? `1px solid var(--light-blue)` : 'none')};
    border-bottom-color: transparent;
    z-index: 100;

    ${RemoveButton} {
      display: flex;
    }
  }
`

const TableHeader = styled(TableRow)`
  outline: none !important;
  border-bottom-color: var(--lighter-grey) !important;
`

const TableCell = styled.div<{ editable?: boolean }>`
  flex: 1 1 calc(100% / 11);
  min-width: 45px;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: stretch;
  justify-content: center;
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.005);
  position: relative;
  cursor: ${(p) => (p.editable ? 'pointer' : 'default')};

  &:last-of-type {
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
  padding: 0.5rem 0.15rem;
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
  canRemoveRow?: (item: ItemType) => boolean
  className?: string
  renderCell?: (key: string, val: any, item?: ItemType) => React.ReactNode
  renderValue?: (key: string, val: any, isHeader?: boolean, item?: ItemType) => React.ReactNode
  getColumnTotal?: (key: string) => React.ReactChild
  onEditValue?: (key: string, value: string | number, item?: ItemType) => unknown
  editValue?: null | { key: string; value: string | number; item: ItemType }
  onCancelEdit?: () => unknown
  onSaveEdit?: () => unknown
  editableValues?: string[]
  renderInput?: (
    key: string,
    val: any,
    onChange: (val: any) => void,
    onAccept?: () => unknown,
    onCancel?: () => unknown
  ) => React.ReactChild
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
  <TextInput theme="light" value={val} onChange={(e) => onChange(e.target.value)} name={key} />
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
    canRemoveRow = (item) => !!onRemoveRow,
    renderCell = defaultRenderCellContent,
    renderValue = defaultRenderValue,
    getColumnTotal,
    className,
    onEditValue,
    onCancelEdit,
    onSaveEdit,
    editValue,
    renderInput = defaultRenderInput,
    editableValues = [],
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
            <ColumnHeaderCell key={colName}>{renderValue('', colName, true)}</ColumnHeaderCell>
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

          let isEditingRow: boolean = !!editValue && keyFromItem(editValue.item) === rowKey

          const itemRemover = onRemoveRow && canRemoveRow(item) ? onRemoveRow(item) : null

          const onStartValueEdit = (key, val) => () => {
            if (!isEditingRow && onEditValue) {
              onEditValue(key, val, item)
            }
          }

          const onValueChange = (key) => (nextValue) => {
            if (isEditingRow && onEditValue) {
              onEditValue(key, nextValue)
            }
          }

          return (
            <TableRow key={rowKey ?? `row-${rowIndex}`} isEditing={isEditingRow}>
              {itemEntries
                .filter(([key]) => !keysToHide.includes(key))
                .map(([key, val], index) => (
                  <TableCell
                    editable={editableValues?.includes(key)}
                    onDoubleClick={onStartValueEdit(key, val)}
                    key={`${rowKey}-${key}-${index}`}>
                    {onEditValue && editValue && isEditingRow && editValue.key === key ? (
                      <>
                        <EditInputWrapper>
                          {renderInput(
                            key,
                            editValue.value,
                            onValueChange(key),
                            onSaveEdit,
                            onCancelEdit
                          )}
                          <EditButtonsWrapper>
                            <CancelButton onClick={onCancelEdit}>
                              <CrossThick fill="white" width="0.5rem" height="0.5rem" />
                            </CancelButton>
                            <SaveButton onClick={onSaveEdit}>
                              <Checkmark2 fill="white" width="0.5rem" height="0.5rem" />
                            </SaveButton>
                          </EditButtonsWrapper>
                        </EditInputWrapper>
                      </>
                    ) : (
                      renderCell(key, renderValue(key, val, false, item), item)
                    )}
                  </TableCell>
                ))}
              {!isEditingRow && itemRemover && (
                <RemoveButton onClick={itemRemover}>
                  <CrossThick fill="white" width="0.5rem" height="0.5rem" />
                </RemoveButton>
              )}
            </TableRow>
          )
        })}
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
    )
  }
)

export default Table
