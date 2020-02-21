import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import UploadFile from './UploadFile'
import Loading from '../components/Loading'
import { useUploader } from '../utils/useUploader'
import gql from 'graphql-tag'
import { DayType, DepartureBlock } from '../types/inspection'
import { difference, flatten, orderBy } from 'lodash'
import { Button } from '../components/Button'
import Table from '../components/Table'
import Checkbox from './Checkbox'

const uploadDepartureBlocksMutation = gql`
  mutation uploadDepartureBlocks($file: Upload!, $inspectionId: String!) {
    uploadDepartureBlocks(file: $file, inspectionId: $inspectionId) {
      id
      departureTime
      departureType
      direction
      routeId
      vehicleId
      arrivalTime
      inDepot
      outDepot
    }
  }
`

const DepartureBlocksView = styled.div``

const DepartureBlockGroupContainer = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #aeaeae;
`

const DayTypesContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: baseline;
`

const DayTypeOption = styled.div`
  margin-right: 0.5rem;
`

const DepartureBlocksTable = styled(Table)`
  margin-top: 1rem;
`

export type PropTypes = {
  departureBlocks: DepartureBlock[]
  onChangeBlocks: (departureBlocks: DepartureBlock[]) => void
}

type DayTypeGroup = {
  [DayType.Ma]: boolean
  [DayType.Ti]: boolean
  [DayType.Ke]: boolean
  [DayType.To]: boolean
  [DayType.Pe]: boolean
  [DayType.La]: boolean
  [DayType.Su]: boolean
}

type DayTypeState = Array<DayTypeGroup>

type DepartureBlockGroup = {
  dayTypes: DayTypeGroup
  groupIndex: number
  blocks: DepartureBlock[]
}

type BlockGroupPropTypes = {
  blockGroup: DepartureBlockGroup
  onAddBlock: (block: DepartureBlock) => void
  onRemoveBlock: (block: DepartureBlock) => void
  onAddDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
  onRemoveDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
}

const defaultDayTypeGroup: DayTypeGroup = {
  [DayType.Ma]: false,
  [DayType.Ti]: false,
  [DayType.Ke]: false,
  [DayType.To]: false,
  [DayType.Pe]: false,
  [DayType.La]: false,
  [DayType.Su]: false,
}

const departureBlockColumnLabels = {
  id: 'ID',
  departureTime: 'Lähtöaika',
  departureType: 'Lähtötyyppi',
  direction: 'Suunta',
  routeId: 'Reitti',
  vehicleId: 'Kylkinumero',
  arrivalTime: 'Saapumisaika',
  inDepot: 'Lähtövarikko',
  outDepot: 'Loppuvarikko',
}

const getEnabledDayTypes = (dayTypeGroup: DayTypeGroup) =>
  Object.entries(dayTypeGroup)
    .filter(([, enabled]) => !!enabled)
    .map(([dt]) => dt)

const isDayTypeEnabled = (dayType: DayType, dayTypeGroup: DayTypeGroup) =>
  getEnabledDayTypes(dayTypeGroup).includes(dayType)

const createDepartureBlockKey = (item: DepartureBlock, dayType = item.dayType) =>
  `${item.id}/${dayType}`

const DepartureBlockDayGroup: React.FC<BlockGroupPropTypes> = observer(
  ({ blockGroup, onAddBlock, onRemoveBlock, onAddDayType, onRemoveDayType }) => {
    const { dayTypes, groupIndex, blocks } = blockGroup

    const departureBlocksUploader = useUploader(uploadDepartureBlocksMutation, {
      variables: {
        inspectionId: '123',
      },
    })

    const [
      ,
      { data: departureBlockData, loading: departureBlocksLoading },
    ] = departureBlocksUploader

    const onDayTypeChange = useCallback(
      (dayType: DayType) => (e) => {
        const isSelected = e.target.checked

        if (isSelected) {
          onAddDayType(dayType, groupIndex)
        } else {
          onRemoveDayType(dayType, groupIndex)
        }
      },
      [onAddDayType, onRemoveDayType]
    )

    useEffect(() => {
      if (!departureBlockData) {
        return
      }

      const existingBlockKeys = blocks.map((block) =>
        createDepartureBlockKey(block, block.dayType)
      )

      const enabledDayTypes = getEnabledDayTypes(dayTypes)

      for (const dayType of enabledDayTypes) {
        for (const { __typename, ...block } of departureBlockData) {
          const blockKey = createDepartureBlockKey(block, dayType as DayType)

          if (!existingBlockKeys.includes(blockKey)) {
            const blockData = { ...block, dayType }
            onAddBlock(blockData)
          }
        }
      }
    }, [dayTypes, blocks, departureBlockData])

    return (
      <DepartureBlockGroupContainer>
        <DayTypesContainer>
          {Object.entries(dayTypes).map(([dt, enabled]) => (
            <DayTypeOption key={dt}>
              <Checkbox
                label={dt}
                onChange={onDayTypeChange(dt as DayType)}
                checked={enabled}
                name="daytype"
                value={dt}
              />
            </DayTypeOption>
          ))}
        </DayTypesContainer>
        <UploadFile label="Lataa lähtöketjutiedosto" uploader={departureBlocksUploader} />
        {departureBlocksLoading && <Loading />}
        {blocks.length !== 0 && (
          <DepartureBlocksTable
            keyFromItem={createDepartureBlockKey}
            items={orderBy(blocks, ({ dayType }) =>
              Object.keys(defaultDayTypeGroup).indexOf(dayType as string)
            )}
            columnLabels={departureBlockColumnLabels}
          />
        )}
      </DepartureBlockGroupContainer>
    )
  }
)

const DepartureBlocks: React.FC<PropTypes> = observer(
  ({ departureBlocks, onChangeBlocks }) => {
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
        nextDayTypeGroups.splice(groupIndex, 1, group)

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
        const nextDepartureBlocks = [...departureBlocks, block]
        onChangeBlocks(nextDepartureBlocks)
      },
      [departureBlocks]
    )

    const removeDepartureBlock = useCallback(
      (block: DepartureBlock) => {
        const blockIndex = departureBlocks.findIndex(
          (db) => db.id === block.id && db.dayType === block.dayType
        )

        if (blockIndex === -1) {
          return
        }

        const nextDepartureBlocks = [...departureBlocks]
        nextDepartureBlocks.splice(blockIndex, 1)

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
          <DepartureBlockDayGroup
            key={`dayTypeGroup-${groupIndex}`}
            blockGroup={blockGroup}
            onAddBlock={addDepartureBlock}
            onRemoveBlock={removeDepartureBlock}
            onAddDayType={addDayTypeToGroup}
            onRemoveDayType={removeDayTypeFromGroup}
          />
        ))}
        {difference(Object.keys(defaultDayTypeGroup), enabledDayTypes).length !== 0 && (
          <Button onClick={() => addDayTypeGroup()}>Lisää lähtöketju</Button>
        )}
      </DepartureBlocksView>
    )
  }
)

export default DepartureBlocks
