import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { roundNumber } from '../../util/round'

const minWidth = 10
const maxWidth = 50

export function useColumnResize(columns: any[], isResizeEnabled = true) {
  let columnWidth = 100 / Math.max(1, columns.length)

  let defaultColumnWidths = useMemo(() => {
    return columns.map(() => columnWidth)
  }, [columns, columnWidth])

  let [columnWidths, setColumnWidths] = useState<number[]>(defaultColumnWidths)

  useEffect(() => {
    if (columns.length !== columnWidths.length) {
      setColumnWidths(defaultColumnWidths)
    }
  }, [columns.length, columnWidths.length, defaultColumnWidths])

  let columnDragTarget = useRef<number | undefined>(undefined)
  let columnDragStart = useRef<number>(0)

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
      if (currentWidth && e.movementX !== 0) {
        let eventX = Math.abs(e.nativeEvent.pageX)
        let windowWidth = window.innerWidth

        // The pixels that the mouse moved, ie how much to grow or shrink the column.
        let movementPx = columnDragStart.current - eventX
        let movementDir = movementPx > 0 ? 'left' : 'right'
        // Convert the px movement to percentages, which is how the table columns are sized.
        let movementPercent = roundNumber((Math.abs(movementPx) / windowWidth) * 100)

        // If dragging the last column, special considerations need to be made.
        let isLast = resizeColIdx === nextWidths.length - 1
        // If dragging the last column, resize all columns in the table.
        // If dragging any other column, resize only columns after the current one.
        let resizeColumns = isLast ? nextWidths : nextWidths.slice(resizeColIdx)

        // The width modifier for all columns except the current one.
        let columnWidthModifier = roundNumber(
          movementPercent / Math.max(1, resizeColumns.length - 1)
        )
        let colIdx = isLast ? 0 : resizeColIdx // Start at the end if dragging the last one

        if (isLast) {
          // Reverse movement direction if dragging the last column.
          movementDir = movementDir === 'left' ? 'right' : 'left'
        }

        // Loop through and resize all columns.
        for (let colWidth of resizeColumns) {
          let nextColumnWidth = 0
          let columnWidth = (colWidth || 0) as number

          // Case for when the col to resize is not the currently dragged one.
          if (colIdx !== resizeColIdx) {
            let currentlyDraggingWidth = roundNumber(nextWidths[resizeColIdx] || 0)

            if (currentlyDraggingWidth <= minWidth || currentlyDraggingWidth > maxWidth) {
              break
            }

            // Add or remove the width modifier from the current width based on movement direction.
            if (movementDir === 'left') {
              nextColumnWidth = columnWidth + columnWidthModifier
            } else {
              nextColumnWidth = columnWidth - columnWidthModifier
            }
            // Case for when the col to resize IS the currently dragged one.
          } else {
            // Add or remove the actual movement percentage directly.
            if (movementDir === 'left') {
              nextColumnWidth = columnWidth - movementPercent
            } else {
              nextColumnWidth = columnWidth + movementPercent
            }
          }

          // Clamp the width to max and min values
          nextColumnWidth = nextColumnWidth
            ? Math.min(Math.max(minWidth, nextColumnWidth), maxWidth)
            : 0

          if (nextColumnWidth > 0) {
            nextWidths.splice(colIdx, 1, nextColumnWidth)
          }

          colIdx++
        }

        setColumnWidths(nextWidths)

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

  if (!isResizeEnabled) {
    return {
      columnWidths,
      onColumnDragStart: (colIdx) => (e) => {},
      onColumnDragEnd: (e) => {},
      onDragColumn: (e) => {},
    }
  }

  return {
    onColumnDragStart,
    onColumnDragEnd,
    onDragColumn,
    columnWidths,
  }
}
