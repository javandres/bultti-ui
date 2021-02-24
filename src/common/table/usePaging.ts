import { chunk } from 'lodash'
import { useCallback, useMemo, useState } from 'react'

export type PageConfig = {
  currentPage: number
  pageSize: number
}

export type TablePagingStateType<ItemType = unknown> = {
  currentPage: number
  pageSize: number
  pageSizeOptions: number[]
  pageCount: number
  setCurrentPage: (setToPage: number) => void
  setCurrentPageWithOffset: (offset: number) => void
  setPageSize: (pageSizeIndex: number) => void
  currentPageItems: ItemType[]
  itemsCount: number
  itemsOnPage: number
}

export const defaultPageSizeOptions = [10, 20, 30, 50, 100]

export const defaultPageConfig = {
  currentPage: 1,
  pageSize: defaultPageSizeOptions[0],
}

export function usePaging<ItemType>(items: ItemType[] = []): TablePagingStateType<ItemType> {
  let itemsLength = items.length
  // Limit the page size options to the actual number of items, so that the user does not see
  // options for larger page sizes than there are items.
  let pageSizeOptions = defaultPageSizeOptions.filter((size) => itemsLength > size)

  let [currentPage, setCurrentPage] = useState<number>(1)
  let [pageSize, setPageSize] = useState<number>(10)

  let itemPages = useMemo(() => chunk(items, pageSize), [items, pageSize])
  let pagesLength = itemPages.length

  let setPageSizeByIndex = useCallback(
    (pageSizeIdx: number) => {
      let nextPageSize = pageSizeOptions[pageSizeIdx] || pageSizeOptions[0]
      setPageSize(nextPageSize)
    },
    [pageSizeOptions]
  )

  // Set the current page to some index. Upper boundary is the number of pages, lower boundary is 1.
  let setCurrentPageToIndex = useCallback(
    (setToPage) => {
      let attemptPageValue = Math.max(setToPage, 1)
      let nextPageValue = Math.min(attemptPageValue, pagesLength)
      setCurrentPage(nextPageValue)
    },
    [pagesLength]
  )

  let setCurrentPageWithOffset = useCallback(
    (offset: number) => {
      setCurrentPage((currentPageVal) => {
        let attemptPageValue = Math.max(currentPageVal + offset, 1)
        return Math.min(attemptPageValue, pagesLength)
      })
    },
    [pagesLength]
  )

  // The items in the current page. Use -1 to get an array index from the currentPage value.
  let currentPageItems = useMemo(() => itemPages[currentPage - 1] || itemPages[0] || [], [
    currentPage,
    itemPages,
  ])

  return {
    currentPage,
    pageSize,
    pageSizeOptions,
    pageCount: pagesLength,
    setCurrentPageWithOffset,
    setPageSize: setPageSizeByIndex,
    setCurrentPage: setCurrentPageToIndex,
    currentPageItems,
    itemsCount: itemsLength,
    itemsOnPage: currentPageItems.length,
  }
}
