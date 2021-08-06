import { EditValue, TableItemType, TableRowWithDataAndFunctions } from './tableUtils'
import { useMemo } from 'react'
import { orderBy } from 'lodash'
import { useTableColumns } from './useTableColumns'
import { ValueOf } from '../../type/common'

export function useTableRows<ItemType extends TableItemType>({
  items,
  pendingValues,
  editableValues,
  onRemoveRow,
  keyFromItem,
  onEditValue,
  isAlwaysEditable,
  hideKeys,
  columnLabels,
  columnOrder,
  testId,
}: {
  items: ItemType[]
  keyFromItem: (item: ItemType) => string
  columnLabels?: { [key in keyof ItemType]?: string }
  columnOrder?: string[]
  hideKeys?: string[]
  onRemoveRow?: (item: ItemType) => unknown
  onEditValue?: <K extends keyof ItemType>(
    key: K,
    value: ItemType[K],
    item: ItemType
  ) => unknown
  pendingValues?: EditValue<ItemType>[]
  editableValues?: (keyof ItemType)[] | ((item: ItemType) => (keyof ItemType)[])
  isAlwaysEditable?: boolean
  testId?: string
}) {
  let { columnNames, keysToHide, columnKeysOrdering, columns } = useTableColumns({
    items,
    columnOrder,
    columnLabels,
    hideKeys,
  })

  let rows: TableRowWithDataAndFunctions<ItemType>[] = useMemo(
    () =>
      items.map((item) => {
        // Again, omit keys that start with an underscore.
        let itemEntries = Object.entries(item) as [string, ValueOf<ItemType>][]

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

        const onMakeEditable = (key: keyof ItemType, val: ValueOf<ItemType>) => {
          let itemEditableValues =
            typeof editableValues === 'function'
              ? editableValues(item) // Some columns may be editable on a per-item basis.
              : Array.isArray(editableValues)
              ? editableValues
              : []

          if (!isEditingRow && onEditValue && itemEditableValues.includes(key as string)) {
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
        }
      }),
    [
      items,
      pendingValues,
      editableValues,
      onRemoveRow,
      keyFromItem,
      columnKeysOrdering,
      onEditValue,
      isAlwaysEditable,
    ]
  )

  return {
    columnNames,
    columns,
    rows,
  }
}
