import { useCallback, useMemo } from 'react'
import { SortConfig, SortOrder } from '../../schema-types'
import { orderBy } from 'lodash'

export function useTableSorting<ItemType>({
  items,
  sort,
  setSort,
  itemsAreSorted,
}: {
  setSort: (arg: ((sort: SortConfig[]) => SortConfig[]) | SortConfig[]) => unknown
  items: ItemType[]
  sort: SortConfig[]
  itemsAreSorted?: boolean
}) {
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

  let sortedItems: ItemType[] = useMemo<ItemType[]>(() => {
    if (!items || !Array.isArray(items)) {
      return []
    }

    // If the Table was provided external sort config, assume the items are already sorted.
    if (itemsAreSorted || sort.length === 0) {
      return items
    }

    return orderBy(
      items,
      sort.map((s) => s.column),
      sort.map((s) => (s.order === SortOrder.Desc ? 'desc' : 'asc'))
    )
  }, [items, sort])

  return { sortByColumn, sortedItems }
}
