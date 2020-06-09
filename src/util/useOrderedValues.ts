import { difference, omitBy, orderBy } from 'lodash'
import { useMemo } from 'react'

/*
 * Create an array of keys and values of an object with custom labels and ordering.
 * Use hideKeys to hide any keys from the list.
 */

export const useOrderedValues = (
  item: any,
  labels = {},
  order: string[] = [],
  hideKeys?: string[]
) => {
  return useMemo(() => {
    let itemEntries = Object.entries(omitBy(item, (val, key) => key.startsWith('_')))

    const labelKeys = Object.keys(labels)
    const inputOrdering = order && order.length !== 0 ? order : labelKeys

    let keysToHide: string[] = []

    // Hide keys listed in hideKeys if hideKeys is a non-zero array.
    // Hide keys NOT listed in columnLabels if hideKeys is undefined.
    // If hideKeys is a zero-length array no keys will be hidden.

    if (hideKeys && hideKeys.length !== 0) {
      keysToHide = hideKeys
    } else if (!hideKeys && labelKeys.length !== 0) {
      keysToHide = difference(
        itemEntries.map(([key]) => key),
        labelKeys
      )
    }

    if (inputOrdering.length !== 0) {
      itemEntries = orderBy(itemEntries, ([key]) => {
        const labelIndex = inputOrdering.indexOf(key)
        return labelIndex === -1 ? 999 : labelIndex
      })
    }

    if (keysToHide && keysToHide.length !== 0) {
      itemEntries = itemEntries.filter(([key]) => !keysToHide.includes(key))
    }

    return itemEntries
  }, [item, labels, order, hideKeys])
}
