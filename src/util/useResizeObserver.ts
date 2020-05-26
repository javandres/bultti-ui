import { RefObject, useEffect, useState } from 'react'

export interface ResizeObserverEntry {
  target: HTMLElement
  contentRect: DOMRectReadOnly
}

type RectValue = DOMRectReadOnly | Partial<DOMRectReadOnly>

export const useResizeObserver = (ref: RefObject<HTMLElement>) => {
  let [sizeRect, setSizeRect] = useState<RectValue>({})

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const resizeObserver = new (window as any).ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        let rect = entries[0].contentRect
        setSizeRect(rect)
      }
    )

    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref.current])

  return sizeRect
}

export const useResizeCallback = (
  ref: RefObject<HTMLElement>,
  cb: (sizeRect: RectValue) => unknown
) => {
  useEffect(() => {
    if (!ref.current) {
      return
    }

    const resizeObserver = new (window as any).ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        let rect = entries[0].contentRect
        cb(rect)
      }
    )

    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref.current])
}
