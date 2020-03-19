import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { DayType, DepartureBlock } from '../type/inspection'
import { difference, flatten } from 'lodash'
import { Button } from '../common/components/Button'
import {
  createDepartureBlockKey,
  DayTypeGroup,
  DayTypeState,
  defaultDayTypeGroup,
  DepartureBlockGroup,
  getEnabledDayTypes,
  isDayTypeEnabled,
} from './departureBlocksCommon'
import DepartureBlockGroupItem from './DepartureBlockGroupItem'

const DepartureBlocksView = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

type PropTypes = {
  inspectionId: string
  departureBlocks: DepartureBlock[]
  onChangeBlocks: (departureBlocks: DepartureBlock[]) => void
}

const DepartureBlocks: React.FC<PropTypes> = observer(
  ({ inspectionId, departureBlocks, onChangeBlocks }) => {
    const removedBlocks = useRef<string[]>([])

    // Reset removedBlocks if there are no departureBlocks.
    useEffect(() => {
      if (departureBlocks.length === 0) {
        removedBlocks.current = []
      }
    }, [departureBlocks])

    const [dayTypeGroups, setDayTypeGroups] = useState<DayTypeState>([
      {
        ...defaultDayTypeGroup,
        [DayType.Ma]: true,
        [DayType.Ti]: true,
        [DayType.Ke]: true,
        [DayType.To]: true,
      },
    ])

    const enabledDayTypes = useMemo(
      () => flatten(dayTypeGroups.map((g) => getEnabledDayTypes(g))),
      [dayTypeGroups]
    )

    const createDayTypeGroup = useCallback((dayType: DayType) => {
      const dayTypeGroup: DayTypeGroup = { ...defaultDayTypeGroup, [dayType]: true }
      return dayTypeGroup
    }, [])

    // Add a day type group. Each day type (listed in availableDayTypes) should only be in a single group.
    // If passed a dayType, the function will only return the dayTypeGroup it is in without adding a
    // new one if it is found in a group already. If all dayTypes are used, nothing will happen.
    const addDayTypeGroup = useCallback(
      (addDayType?: DayType) => {
        // If no specific dayType was given, search for the next available and unused day type.
        let nextDayType =
          addDayType ??
          Object.keys(defaultDayTypeGroup).filter((dt) => !enabledDayTypes.includes(dt))[0]

        // No day type available to add, bail.
        if (!nextDayType || enabledDayTypes.includes(nextDayType)) {
          return
        }

        const addGroup: DayTypeGroup = createDayTypeGroup(nextDayType as DayType)
        const nextDayTypes: DayTypeGroup[] = [...dayTypeGroups, addGroup]
        setDayTypeGroups(nextDayTypes)
      },
      [dayTypeGroups]
    )

    const setDayTypeInGroup = useCallback(
      (dayType: DayType, groupIndex: number, setTo = true): DayTypeState => {
        let currentDayTypeGroups = dayTypeGroups

        if (!currentDayTypeGroups[groupIndex]) {
          return currentDayTypeGroups
        }

        if (setTo && enabledDayTypes.includes(dayType)) {
          const existingIndex = currentDayTypeGroups.findIndex((dtg) =>
            isDayTypeEnabled(dayType, dtg)
          )

          currentDayTypeGroups = setDayTypeInGroup(dayType, existingIndex, false)
        }

        const group = currentDayTypeGroups[groupIndex]
        group[dayType] = setTo

        const nextDayTypeGroups = [...currentDayTypeGroups]

        if (Object.values(group).some((val) => val)) {
          nextDayTypeGroups.splice(groupIndex, 1, group)
        } else {
          nextDayTypeGroups.splice(groupIndex, 1)
        }

        setDayTypeGroups(nextDayTypeGroups)
        return nextDayTypeGroups
      },
      [dayTypeGroups]
    )

    const removeDayTypeFromGroup = useCallback(
      (dayType: DayType, groupIndex: number) => setDayTypeInGroup(dayType, groupIndex, false),
      [setDayTypeInGroup]
    )

    const addDayTypeToGroup = useCallback(
      (dayType: DayType, groupIndex: number) => setDayTypeInGroup(dayType, groupIndex, true),
      [setDayTypeInGroup]
    )

    const addDepartureBlock = useCallback(
      (block: DepartureBlock) => {
        const blockKey = createDepartureBlockKey(block)

        if (removedBlocks.current.includes(blockKey)) {
          return
        }

        const nextDepartureBlocks = [...departureBlocks, block]
        onChangeBlocks(nextDepartureBlocks)
      },
      [departureBlocks, removedBlocks.current]
    )

    const removeDepartureBlock = useCallback(
      (block: DepartureBlock) => {
        const blockIndex = departureBlocks.findIndex(
          (db) => db.id === block.id && db.dayType === block.dayType
        )

        if (blockIndex === -1) {
          return
        }

        if (block.dayType) {
          const blockKey = createDepartureBlockKey(block)
          removedBlocks.current.push(blockKey)
        }

        const nextDepartureBlocks = [...departureBlocks]
        nextDepartureBlocks.splice(blockIndex, 1)

        onChangeBlocks(nextDepartureBlocks)
      },
      [departureBlocks, removedBlocks.current]
    )

    const removeAllBlocksForDayTypes = useCallback(
      (dayTypes: DayType[]) => {
        const blockFilter = (db) => db.dayType && !dayTypes.includes(db.dayType)

        removedBlocks.current = removedBlocks.current.filter(blockFilter)
        const nextDepartureBlocks = departureBlocks.filter(blockFilter)

        onChangeBlocks(nextDepartureBlocks)
      },
      [departureBlocks]
    )

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
  }
)

export default DepartureBlocks
