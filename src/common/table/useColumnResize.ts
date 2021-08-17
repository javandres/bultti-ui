import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { roundNumber } from '../../util/round'

const minWidth = 75

export function useColumnResize(columns: unknown[], isResizeEnabled = true) {
  // The widths are in percentages. The default widths for each column is 100 divided by the number of columns.
  let columnWidth = Math.max(10, 100 / Math.max(1, columns.length))

  let defaultColumnWidths = useMemo(
    () => columns.map(() => columnWidth),
    [columns, columnWidth]
  )

  let [columnWidths, setColumnWidths] = useState<number[]>(defaultColumnWidths)

  // Reset the widths if the number of columns changes.
  useEffect(() => {
    if (columns.length !== columnWidths.length) {
      setColumnWidths(defaultColumnWidths)
    }
  }, [columns.length, columnWidths.length, defaultColumnWidths])

  let columnDragTarget = useRef<number | undefined>(undefined)
  let columnDragStart = useRef<number>(0)

  // Called on each mouse move event.
  let onDragColumn = useCallback(
    (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      // The index of the currently dragged column.
      let resizeColIdx = columnDragTarget.current

      // Bail if we are not resizing a column
      if (typeof resizeColIdx === 'undefined') {
        return
      }

      // Clone the widths to trigger the state update
      let nextWidths = [...columnWidths]
      let currentWidth = nextWidths[resizeColIdx] || 0

      // Sometimes e.movementX is 0, we can filter out these events.
      if (currentWidth && e.movementX !== 0) {
        let eventX = Math.abs(e.nativeEvent.pageX)
        let windowWidth = window.innerWidth
        let parentWidth = e.currentTarget.getBoundingClientRect().width

        const maxWidth = parentWidth / 1.5

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
        // Start at the end if dragging the last one
        let colIdx = isLast ? 0 : resizeColIdx

        if (isLast) {
          // Reverse movement direction if dragging the last column.
          movementDir = movementDir === 'left' ? 'right' : 'left'
        }

        // Get the width of the current column
        let currentlyDraggingWidth = nextWidths[resizeColIdx] || 0
        let currentPxWidth = Math.round((parentWidth * currentlyDraggingWidth) / 100)

        // Loop through and resize all columns.
        for (let colWidth of resizeColumns) {
          let nextColumnWidth = 0
          let columnWidth = (colWidth || 0) as number

          // Case for when the col to resize is not the currently dragged one.
          if (colIdx !== resizeColIdx) {
            // Prevent other columns from being resized if the current column is at min/max limit.
            if (currentPxWidth <= minWidth || currentPxWidth > maxWidth) {
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
            // Add or remove the actual movement percentage directly to the current column.
            if (movementDir === 'left') {
              nextColumnWidth = columnWidth - movementPercent
            } else {
              nextColumnWidth = columnWidth + movementPercent
            }
          }

          let pxWidth = (parentWidth * nextColumnWidth) / 100

          // Only positive values allowed
          if (pxWidth >= minWidth && pxWidth <= maxWidth) {
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
      // Set the drag target
      columnDragTarget.current = colIdx
      // Set the movement origin, used to calculate how far the mouse moves
      columnDragStart.current = Math.abs(e.nativeEvent.pageX)
    },
    []
  )

  // When the dragging ends, set the target and movement origin to empty values.
  let onColumnDragEnd = useCallback((e) => {
    columnDragTarget.current = undefined
    columnDragStart.current = 0
  }, [])

  // Return only the default widths if resize is not enabled.
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
