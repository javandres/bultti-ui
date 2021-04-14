import { RefObject, useContext, useEffect, useMemo, useState } from 'react'
import { ScrollContext } from '../components/AppFrame'
import { useDebouncedCallback } from 'use-debounce'

export function useFloatingToolbar(
  tableViewRef: RefObject<HTMLDivElement>,
  showToolbar: boolean
) {
  // Scroll listeners for the floating toolbar.
  let [currentScroll, setCurrentScroll] = useState({ scrollTop: 0, viewportHeight: 0 })
  let subscribeToScroll = useContext(ScrollContext)

  let { callback: debouncedSetScroll } = useDebouncedCallback(
    (scrollTop: number, viewportHeight: number) => {
      setCurrentScroll({ scrollTop, viewportHeight })
    },
    50
  )

  // Subscribe to the scroll position only when there are items being edited.
  useEffect(() => {
    if (showToolbar) {
      subscribeToScroll(debouncedSetScroll)
    }
  }, [subscribeToScroll, showToolbar, debouncedSetScroll])

  return useMemo(() => {
    if (!showToolbar || !tableViewRef.current) {
      return false
    }

    let { scrollTop, viewportHeight } = currentScroll
    let tableBox = tableViewRef.current?.getBoundingClientRect()

    let tableTop = scrollTop + (tableBox?.top || 0)
    let tableBottom = tableTop + (tableBox?.height || 0)
    let scrollBottom = scrollTop + viewportHeight

    return scrollBottom < tableBottom + 58 && scrollBottom > tableTop + 58
  }, [tableViewRef.current, currentScroll, showToolbar])
}
