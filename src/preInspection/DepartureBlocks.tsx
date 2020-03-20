import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference } from 'lodash'
import { Button } from '../common/components/Button'
import {
  createDepartureBlockKey,
  defaultDayTypeGroup,
  DepartureBlockGroup,
  isDayTypeEnabled,
  useDayTypeGroups,
} from './departureBlocksCommon'
import DepartureBlockGroupItem from './DepartureBlockGroupItem'
import { useCollectionState } from '../util/useCollectionState'
import { DayType, DepartureBlock } from '../schema-types'

const DepartureBlocksView = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`

type PropTypes = {
  inspectionId: string
}

const DepartureBlocks: React.FC<PropTypes> = observer(({ inspectionId }) => {
  let [
    departureBlocks,
    { add: addBlock, remove: removeBlock, update: updateBlock, replace: replaceBlocks },
  ] = useCollectionState<DepartureBlock>([])

  const removedBlocks = useRef<string[]>([])

  // Reset removedBlocks if there are no departureBlocks.
  useEffect(() => {
    if (departureBlocks.length === 0) {
      removedBlocks.current = []
    }
  }, [departureBlocks])

  const addDepartureBlock = useCallback(
    (block: DepartureBlock) => {
      const blockKey = createDepartureBlockKey(block)

      if (removedBlocks.current.includes(blockKey)) {
        return
      }

      addBlock(block)
    },
    [removedBlocks.current]
  )

  const removeDepartureBlock = useCallback(
    (block: DepartureBlock) => {
      if (block.dayType) {
        const blockKey = createDepartureBlockKey(block)
        removedBlocks.current.push(blockKey)
      }

      removeBlock(block.id)
    },
    [removedBlocks.current]
  )

  const removeAllBlocksForDayTypes = useCallback(
    (dayTypes: DayType[]) => {
      const blockFilter = (db) => db.dayType && !dayTypes.includes(db.dayType)

      removedBlocks.current = removedBlocks.current.filter(blockFilter)
      const nextDepartureBlocks = departureBlocks.filter(blockFilter)

      replaceBlocks(nextDepartureBlocks)
    },
    [departureBlocks]
  )

  let [
    dayTypeGroups,
    enabledDayTypes,
    { addDayTypeToGroup, removeDayTypeFromGroup, addDayTypeGroup },
  ] = useDayTypeGroups()

  useEffect(() => {
    if (enabledDayTypes.length === 0 || departureBlocks.length === 0) {
      return
    }

    for (const block of departureBlocks) {
      if (!block.dayType || !enabledDayTypes.includes(block?.dayType)) {
        removeDepartureBlock(block)
      }
    }
  }, [enabledDayTypes, removeDepartureBlock, departureBlocks])

  // Before rendering the blocks, group them by day type. Each day type group
  // is a unit of selected day types and departure blocks.
  const blockGroups: DepartureBlockGroup[] = useMemo(() => {
    return departureBlocks.reduce<DepartureBlockGroup[]>(
      (groups: DepartureBlockGroup[], departureBlock) => {
        if (typeof departureBlock.dayType === 'undefined') {
          return groups
        }

        const blockType: DayType = departureBlock.dayType

        // Check if there is a group with this dayType already.
        const blockGroupIndex = groups.findIndex((group) =>
          isDayTypeEnabled(blockType, group.dayTypes)
        )

        let blockGroup: DepartureBlockGroup | null = null

        // Pluck the existing group that matches the day type of the current block from the dayTypeGroups state.
        if (blockGroupIndex !== -1) {
          blockGroup = groups.splice(blockGroupIndex, 1)[0]
        }

        // Create a new block group if none existed already.
        if (!blockGroup) {
          // Find the DayTypeGroup that has the dayType of the block enabled.
          const dayTypeGroupIndex = dayTypeGroups.findIndex((dtg) =>
            isDayTypeEnabled(blockType, dtg)
          )

          // If none, don't show this block now.
          if (dayTypeGroupIndex === -1) {
            return groups
          }

          const dayTypeGroup = dayTypeGroups[dayTypeGroupIndex]

          blockGroup = {
            dayTypes: dayTypeGroup,
            groupIndex: dayTypeGroupIndex,
            blocks: [departureBlock],
          }

          groups.push(blockGroup)
        } else {
          blockGroup.blocks.push(departureBlock)
          groups.splice(blockGroupIndex, 0, blockGroup)
        }

        return groups
      },
      dayTypeGroups.length !== 0
        ? dayTypeGroups.map((dtg, index) => ({
            dayTypes: dtg,
            groupIndex: index,
            blocks: [],
          }))
        : []
    )
  }, [departureBlocks, dayTypeGroups])

  return (
    <DepartureBlocksView>
      {blockGroups.map((blockGroup, groupIndex) => (
        <DepartureBlockGroupItem
          key={`dayTypeGroup-${groupIndex}`}
          inspectionId={inspectionId}
          blockGroup={blockGroup}
          onAddBlock={addDepartureBlock}
          onRemoveBlock={removeDepartureBlock}
          onRemoveAllBlocks={removeAllBlocksForDayTypes}
          onAddDayType={addDayTypeToGroup}
          onRemoveDayType={removeDayTypeFromGroup}
        />
      ))}
      {difference(Object.keys(defaultDayTypeGroup), enabledDayTypes).length !== 0 && (
        <Button onClick={() => addDayTypeGroup()}>Lisää päiväryhmä</Button>
      )}
    </DepartureBlocksView>
  )
})

export default DepartureBlocks
