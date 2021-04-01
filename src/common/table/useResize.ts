import React, { useCallback, useMemo, useRef, useState } from 'react'
import { getTotalNumbers } from '../../util/getTotal'

export function useResize(columns: any[]) {
  let defaultColumnWidths = useMemo(() => {
    let columnWidth = 100 / Math.max(1, columns.length)
    return columns.map(() => columnWidth)
  }, [columns])

  let [columnWidths, setColumnWidths] = useState<number[]>(defaultColumnWidths)

  let columnDragTarget = useRef<number | undefined>(undefined)
  let columnDragStart = useRef<number>(0)

  const minWidth = 10

  let onDragColumn = useCallback(
    (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      let resizeColIdx = columnDragTarget.current

      // Bail if we are not resizing a column
      if (typeof resizeColIdx === 'undefined') {
        return
      }

      // Clone the widths to trigger the state update
      let nextWidths = [...columnWidths]
      let currentWidth = nextWidths[resizeColIdx] || 0

      // CurrentWidth can also be a percentage string if fluid=true
      if (currentWidth) {
        let eventX = Math.abs(e.nativeEvent.pageX)
        let windowWidth = window.innerWidth

        // The pixels that the mouse moved, ie how much to grow or shrink the column.
        let movementPx = columnDragStart.current - eventX
        let movementDir = movementPx > 0 ? 'left' : 'right'
        let movementPercent = (Math.abs(movementPx) / windowWidth) * 100

        let isLast = resizeColIdx === nextWidths.length - 1
        let resizeColumns = isLast ? nextWidths : nextWidths.slice(resizeColIdx)

        let columnWidthModifier = movementPercent / Math.max(1, resizeColumns.length - 1)
        let colIdx = isLast ? 0 : resizeColIdx

        if (isLast) {
          movementDir = movementDir === 'left' ? 'right' : 'left'
        }

        for (let colWidth of resizeColumns) {
          let nextColumnWidth = 0
          let columnWidth = (colWidth || 0) as number

          if (colIdx !== resizeColIdx) {
            if (movementDir === 'left') {
              nextColumnWidth = columnWidth + columnWidthModifier
            } else {
              nextColumnWidth = columnWidth - columnWidthModifier
            }
          } else {
            if (movementDir === 'left') {
              nextColumnWidth = columnWidth - movementPercent
            } else {
              nextColumnWidth = columnWidth + movementPercent
            }
          }

          let nextColWidth = nextColumnWidth
            ? Math.min(Math.max(minWidth, nextColumnWidth), 100 - minWidth * nextWidths.length)
            : 0

          if (nextColWidth) {
            nextWidths.splice(colIdx, 1, nextColWidth)
          }

          colIdx++
        }

        let updatedWidth = getTotalNumbers(nextWidths)

        if (updatedWidth <= 100) {
          setColumnWidths(nextWidths)
        }

        // Reset the movement origin
        columnDragStart.current = eventX
      }
    },
    [columnWidths, columnDragTarget.current, columnDragStart.current]
  )

  let onColumnDragStart = useCallback(
    (colIdx) => (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      columnDragTarget.current = colIdx
      columnDragStart.current = Math.abs(e.nativeEvent.pageX)
    },
    []
  )

  let onColumnDragEnd = useCallback((e) => {
    columnDragTarget.current = undefined
    columnDragStart.current = 0
  }, [])

  return {
    onColumnDragStart,
    onColumnDragEnd,
    onDragColumn,
    columnWidths,
  }
}
