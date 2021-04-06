import { FilterConfig, SortConfig } from '../../schema-types'
import React, { useCallback } from 'react'
import { round } from '../../util/round'
import { format, isValid, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../../constants'
import { toString } from 'lodash'
import { TableInput, TablePropTypes, TableTextInput } from './Table'
import { CellContent } from './TableCell'

export type FilteredResponseMeta = {
  filteredCount?: number
  totalCount?: number
}

export interface IFilteredSortedResponse<DataType> {
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
      return round(val)
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

export type EditValue<ItemType = any, ValueType = CellValType> = {
  key: keyof ItemType
  value: ValueType
  item: ItemType
  itemId: string
}

export type TableEditProps<ItemType, EditValueType = CellValType> = {
  onEditValue?: (key: keyof ItemType, value: EditValueType, item: ItemType) => unknown
  pendingValues?: EditValue<ItemType, EditValueType>[]
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

export const defaultKeyFromItem = (item) => item.id

export const defaultRenderCellContent = (key: unknown, val: any): React.ReactChild => (
  <>
    {!(val === false || val === null || typeof val === 'undefined') && (
      <CellContent>{val}</CellContent>
    )}
  </>
)

export const defaultRenderValue = (key: unknown, val: any) => toString(val)

export const defaultRenderInput = <ItemType extends {}>(
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
    value={val}
    onChange={(value) => onChange(value)}
    name={key as string}
    onEnterPress={onAccept}
    onEscPress={onCancel}
    inputComponent={TableTextInput}
  />
)

export type TableRowWithDataAndFunctions<ItemType = any, EditValueType = CellValType> = {
  key: string
  isEditingRow: boolean
  onRemoveRow?: (item: ItemType) => void
  onMakeEditable: (key: keyof ItemType, value: EditValueType) => unknown
  onValueChange: (key: string) => (value: EditValueType) => unknown
  itemEntries: [string, EditValueType][]
  item: ItemType
}

export type ContextTypes<ItemType, EditValueType = CellValType> = {
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
