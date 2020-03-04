import { useCallback, useState } from 'react'

export type CollectionStateTuple<T = any> = [
  T[],
  {
    add: (item: T) => void
    remove: (item: T) => void
    update: (item: T, key: string, value: any, onEdit?: (item: T) => T) => void
  }
]

export const useCollectionState = <T = any>(
  value: T[],
  idProp: string = 'id'
): CollectionStateTuple => {
  const [currentValue, setCurrentValue] = useState<T[]>(value)

  const add = useCallback((item: T) => {
    setCurrentValue((val) => [...val, item])
  }, [])

  const remove = useCallback((item: T) => {
    setCurrentValue((val) => {
      const nextValue = [...val]
      const itemIndex = nextValue.findIndex((i) => i[idProp] === item[idProp])

      if (itemIndex !== -1) {
        nextValue.splice(itemIndex, 1)
      }

      return nextValue
    })
  }, [])

  const update = useCallback(
    (item: T, key: string, value: any, onEdit: (item: T) => T = (item) => item) => {
      setCurrentValue((val) => {
        const nextValue = [...val]
        const itemIndex = nextValue.findIndex((i) => i[idProp] === item[idProp])

        if (itemIndex !== -1) {
          let editItem = nextValue.splice(itemIndex, 1)[0]

          editItem[key] = value
          editItem = onEdit(editItem)

          nextValue.splice(itemIndex, 0, editItem)
          setCurrentValue(nextValue)
        }

        return nextValue
      })
    },
    []
  )

  return [currentValue, { add, remove, update }]
}
