import { FilterConfig, SortConfig } from '../../schema-types'
import React, { ReactNode, useCallback } from 'react'
import { round } from '../../util/round'
import { format, isValid, parseISO } from 'date-fns'
import { DEFAULT_DECIMALS, READABLE_TIME_FORMAT } from '../../constants'
import { toString } from 'lodash'
import { TableInput, TablePropTypes, TableTextInput } from './Table'
import { CellContent } from './TableCell'
import { getThousandSeparatedNumber } from '../../util/formatNumber'
import { ValueOf } from '../../type/common'

export type FilteredResponseMeta = {
  filteredCount?: number
  totalCount?: number
}

export type TableItemType = Record<string, unknown>

export interface IFilteredSortedResponse<DataType extends TableItemType> {
  rows: DataType[]
  filteredCount: number
  totalCount: number
  filters?: FilterConfig[] | null
  sort?: SortConfig[] | null
}

// Sensible default rendering function for nice looking data.
export function useRenderCellValue() {
  return useCallback((key, val) => {
    if (typeof val === 'boolean') {
      return val ? '✓' : 'x'
    }

    if (typeof val === 'undefined' || val === null) {
      return '-'
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

export type EditValue<ItemType extends TableItemType> = {
  key: keyof ItemType
  value: ValueOf<ItemType>
  item: ItemType
  itemId: string
}

export type TableEditProps<ItemType extends TableItemType> = {
  onEditValue?: (key: keyof ItemType, value: ValueOf<ItemType>, item: ItemType) => unknown
  pendingValues?: EditValue<ItemType>[]
  onCancelEdit?: () => unknown
  onSaveEdit?: () => unknown
  editableValues?: (keyof ItemType)[]
  isAlwaysEditable?: boolean
}

export type RenderInputType<ItemType extends TableItemType> = (
  key: keyof ItemType,
  val: ValueOf<ItemType>,
  onChange: (val: string) => unknown,
  onAccept?: () => unknown,
  onCancel?: () => unknown,
  tabIndex?: number
) => React.ReactChild

export function defaultKeyFromItem(item) {
  return item.id
}

export function defaultRenderCellContent<ItemType extends TableItemType>(
  key: keyof ItemType,
  val: ValueOf<ItemType> | ReactNode
): ReactNode {
  return (
    <>
      {!(val === false || val === null || typeof val === 'undefined') && (
        <CellContent>{val + ''}</CellContent>
      )}
    </>
  )
}

export function defaultRenderValue<ItemType extends TableItemType>(
  key: keyof ItemType,
  val: ValueOf<ItemType> | string
) {
  return toString(val)
}

export function defaultRenderInput<ItemType extends TableItemType>(
  key: keyof ItemType,
  val: ValueOf<ItemType>,
  onChange: (val: string) => unknown,
  onAccept?: () => unknown,
  onCancel?: () => unknown,
  tabIndex?: number
): React.ReactChild {
  return (
    <TableInput
      autoFocus
      tabIndex={tabIndex}
      value={val + ''}
      onChange={(value) => onChange(value)}
      name={key as string}
      onEnterPress={onAccept}
      onEscPress={onCancel}
      inputComponent={TableTextInput}
    />
  )
}

export type TableRowWithDataAndFunctions<ItemType extends TableItemType> = {
  key: string
  isEditingRow: boolean
  onRemoveRow?: (item: ItemType) => void
  onMakeEditable: <K extends keyof ItemType>(key: K, value: ItemType[K]) => unknown
  onValueChange: (key: keyof ItemType) => (value: string) => unknown
  itemEntries: [string, ValueOf<ItemType>][]
  item: ItemType
}

export type ContextTypes<ItemType extends TableItemType> = {
  pendingValues?: EditValue<ItemType>[]
  columnWidths?: Array<number | string>
  editableValues?: TablePropTypes<ItemType>['editableValues']
  onEditValue?: TablePropTypes<ItemType>['onEditValue']
  renderInput?: TablePropTypes<ItemType>['renderInput']
  onSaveEdit?: TablePropTypes<ItemType>['onSaveEdit']
  onCancelEdit?: TablePropTypes<ItemType>['onCancelEdit']
  renderCell?: TablePropTypes<ItemType>['renderCell']
  renderValue?: TablePropTypes<ItemType>['renderValue']
  keyFromItem?: TablePropTypes<ItemType>['keyFromItem']
  getRowHighlightColor?: TablePropTypes<ItemType>['getRowHighlightColor']
  isAlwaysEditable?: TablePropTypes<ItemType>['isAlwaysEditable']
}

export const TableContext = React.createContext({})

export const defaultGetRowHighlightColor = (): string => ''

export const defaultGetCellHighlightColor = (): string => ''
