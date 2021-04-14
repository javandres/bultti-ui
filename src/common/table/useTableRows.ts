import { CellValType, EditValue, TableRowWithDataAndFunctions } from './tableUtils'
import { useMemo } from 'react'
import { orderBy } from 'lodash'
import { useTableColumns } from './useTableColumns'

export function useTableRows<ItemType extends {}, EditValueType = CellValType>({
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
}: {
  items: ItemType[]
  keyFromItem: (item: ItemType) => string
  columnLabels?: { [key in keyof ItemType]?: string }
  columnOrder?: string[]
  hideKeys?: string[]
  onRemoveRow?: (item: ItemType) => unknown
  onEditValue?: (key: keyof ItemType, value: EditValueType, item: ItemType) => unknown
  pendingValues?: EditValue<ItemType, EditValueType>[]
  editableValues?: string[]
  isAlwaysEditable?: boolean
}) {
  let { columnNames, keysToHide, columnKeysOrdering, columns } = useTableColumns({
    items,
    columnOrder,
    columnLabels,
    hideKeys,
  })

  let rows: TableRowWithDataAndFunctions<ItemType, EditValueType>[] = useMemo(
    () =>
      items.map((item) => {
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

        const onMakeEditable = (key: keyof ItemType, val: EditValueType) => {
          if (!isEditingRow && onEditValue && (editableValues || []).includes(key as string)) {
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
