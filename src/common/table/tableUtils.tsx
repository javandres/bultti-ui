import { FilterConfig, SortConfig } from '../../schema-types'
import React, { useCallback } from 'react'
import { round } from '../../util/round'
import { format, isValid, parseISO } from 'date-fns'
import { DEFAULT_DECIMALS, READABLE_TIME_FORMAT } from '../../constants'
import { toString } from 'lodash'
import { TableInput, TablePropTypes, TableTextInput } from './Table'
import { CellContent } from './TableCell'
import { getThousandSeparatedNumber } from '../../util/formatNumber'

export type FilteredResponseMeta = {
  filteredCount?: number
  totalCount?: number
}

export interface IFilteredSortedResponse<DataType extends Record<string, unknown>> {
  rows: DataType[]
  filteredCount: number
  totalCount: number
  filters?: FilterConfig[] | null
  sort?: SortConfig[] | null
}

// Sensible default rendering function for nice looking data.
export function useRenderCellValue() {
  return useCallback((key, val) => {
    if (typeof val === 'boolean' || typeof val === 'undefined' || val === null) {
      return (
        <span
          style={{
            fontSize: '1.2rem',
            marginTop: '-3px',
            display: 'block',
          }}>
          {val ? '✓' : '⨯'}
        </span>
      )
    }

    if (typeof val === 'number') {
      return getThousandSeparatedNumber(round(val, DEFAULT_DECIMALS))
    }

    if (val.length >= 20) {
      let date: Date | undefined
      try {
        let parsedDate = parseISO(val)

        if (isValid(parsedDate)) {
          date = parsedDate
        }
      } catch (err) {
        date = undefined
      }

      if (date) {
        return format(date, READABLE_TIME_FORMAT + ':ss')
      }
    }

    return toString(val)
  }, [])
}

export type CellValType = string | number

export type EditValue<ItemType = Record<string, unknown>, ValueType = CellValType> = {
  key: keyof ItemType
  value: ValueType
  item: ItemType
  itemId: string
}

export type TableEditProps<ItemType, EditValueType = CellValType> = {
  onEditValue?: (key: keyof Partial<ItemType>, value: EditValueType, item: ItemType) => unknown
  pendingValues?: EditValue<ItemType, EditValueType>[]
  onCancelEdit?: () => unknown
  onSaveEdit?: () => unknown
  editableValues?: string[]
  isAlwaysEditable?: boolean
}

export type RenderInputType<
  ItemType extends Record<string, ValueType>,
  ValueType = unknown
> = (
  key: keyof ItemType,
  val: ValueType,
  onChange: (val: CellValType) => unknown,
  onAccept?: () => unknown,
  onCancel?: () => unknown,
  tabIndex?: number
) => React.ReactChild

export const defaultKeyFromItem = (item) => item.id

export const defaultRenderCellContent = (key: unknown, val: unknown): React.ReactChild => (
  <>
    {!(val === false || val === null || typeof val === 'undefined') && (
      <CellContent>{val as string}</CellContent>
    )}
  </>
)

export const defaultRenderValue = (key: unknown, val: unknown) => toString(val)

export function defaultRenderInput<ItemType extends Record<string, unknown>>(
  key: keyof ItemType,
  val: unknown,
  onChange: (val: CellValType) => unknown,
  onAccept?: () => unknown,
  onCancel?: () => unknown,
  tabIndex?: number
) {
  return (
    <TableInput
      autoFocus
      tabIndex={tabIndex}
      value={val as string}
      onChange={(value: CellValType) => onChange(value)}
      name={key as string}
      onEnterPress={onAccept}
      onEscPress={onCancel}
      inputComponent={TableTextInput}
    />
  )
}

export type TableRowWithDataAndFunctions<
  ItemType = Record<string, unknown>,
  EditValueType = CellValType
> = {
  key: string
  isEditingRow: boolean
  onRemoveRow?: (item: ItemType) => void
  onMakeEditable: (key: keyof ItemType, value: EditValueType) => unknown
  onValueChange: (key: keyof ItemType) => (value: unknown) => unknown
  itemEntries: [string, EditValueType][]
  item: ItemType
}

export type ContextTypes<
  ItemType extends Record<string, unknown>,
  EditValueType = CellValType
> = {
  pendingValues?: EditValue<ItemType, EditValueType>[]
  columnWidths?: Array<number | string>
  editableValues?: TablePropTypes<ItemType, EditValueType>['editableValues']
  onEditValue?: TablePropTypes<ItemType, EditValueType>['onEditValue']
  renderInput?: TablePropTypes<ItemType, EditValueType>['renderInput']
  onSaveEdit?: TablePropTypes<ItemType, EditValueType>['onSaveEdit']
  onCancelEdit?: TablePropTypes<ItemType, EditValueType>['onCancelEdit']
  renderCell?: TablePropTypes<ItemType, EditValueType>['renderCell']
  renderValue?: TablePropTypes<ItemType, EditValueType>['renderValue']
  keyFromItem?: TablePropTypes<ItemType, EditValueType>['keyFromItem']
  highlightRow?: TablePropTypes<ItemType, EditValueType>['highlightRow']
  isAlwaysEditable?: TablePropTypes<ItemType, EditValueType>['isAlwaysEditable']
}

export const TableContext = React.createContext({})

export const defaultHighlightRow = (): string | boolean => false
