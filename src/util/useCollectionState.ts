import { useCallback, useState } from 'react'
import { get } from 'lodash'

export type CollectionStateTuple<T> = [
  T[],
  {
    add: (item: T) => void
    remove: (item: T) => void
    update: (item: T, key?: string, value?: unknown, onEdit?: (item: T) => T) => void
    replace: (items: T[]) => void
  }
]

export const useCollectionState = <T>(
  value: T[],
  idProp: string = 'id'
): CollectionStateTuple<T> => {
  const [currentValue, setCurrentValue] = useState<T[]>(value)

  const add = useCallback((item: T, unique = true) => {
    setCurrentValue((val) => {
      let itemId = get(item, idProp)
      if (!unique || !val.find((v) => get(v, idProp) === itemId)) {
        return [...val, item]
      }

      return val
    })
  }, [])

  const remove = useCallback((item: T) => {
    setCurrentValue((val) => {
      const nextValue = [...val]
      let itemId = get(item, idProp)
      const itemIndex = nextValue.findIndex((i) => get(i, idProp) === itemId)

      if (itemIndex !== -1) {
        nextValue.splice(itemIndex, 1)
      }

      return nextValue
    })
  }, [])

  const update = useCallback(
    (item: T, key?: string, value?: unknown, onEdit: (item: T) => T = (item) => item) => {
      setCurrentValue((val) => {
        const nextValue = [...val]
        let itemId = get(item, idProp)
        const itemIndex = nextValue.findIndex((i) => get(i, idProp) === itemId)

        if (itemIndex !== -1) {
          let editItem = nextValue.splice(itemIndex, 1)[0]

          if (key && typeof value !== 'undefined') {
            editItem[key] = value
          }

          editItem = onEdit(editItem)
          nextValue.splice(itemIndex, 0, editItem)
        } else {
          if (key && typeof value !== 'undefined') {
            item[key] = value
          }

          let editItem = onEdit(item)
          nextValue.push(editItem)
        }

        return nextValue
      })
    },
    []
  )

  const replace = useCallback((items: T[]) => {
    if (items && items.length !== 0) {
      setCurrentValue(items)
    }
  }, [])

  return [currentValue, { add, remove, update, replace }]
}
