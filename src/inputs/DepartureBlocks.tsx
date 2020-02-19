import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import UploadFile from './UploadFile'
import Loading from '../components/Loading'
import { useUploader } from '../utils/useUploader'
import gql from 'graphql-tag'
import { DayType, DepartureBlock } from '../types/inspection'
import { difference, flatten } from 'lodash'
import { Button } from '../components/Button'
import Table from '../components/Table'

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
  margin-top: 1rem;
  display: flex;
  align-items: baseline;
`

const DayTypeOption = styled.div`
  margin-right: 0.5rem;
`

const BlocksHeading = styled.h4`
  margin-top: 0;
  margin-bottom: 0.5rem;
`

export type PropTypes = {
  departureBlocks: DepartureBlock[]
  onChange: (departureBlocks: DepartureBlock[]) => void
}

type DayTypeGroup = DayType[]

type DepartureBlockGroup = {
  dayTypes: DayTypeGroup
  groupIndex: number
  blocks: DepartureBlock[]
}

type BlockGroupPropTypes = {
  blockGroup: DepartureBlockGroup
  onAddBlock: (block: DepartureBlock) => void
  onAddDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
  onRemoveDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
}

const availableDayTypes: DayType[] = [
  DayType.Ma,
  DayType.Ti,
  DayType.Ke,
  DayType.To,
  DayType.Pe,
  DayType.La,
  DayType.Su,
]

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

const createDepartureBlockKey = (item) => `${item.id}/${item.dayType}`

const DepartureBlockDayGroup: React.FC<BlockGroupPropTypes> = observer(
  ({ blockGroup, onAddBlock, onAddDayType, onRemoveDayType }) => {
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

      const existingBlockKeys = blocks.map(createDepartureBlockKey)

      for (const dayType of dayTypes) {
        for (const { __typename, ...block } of departureBlockData) {
          if (existingBlockKeys.includes(createDepartureBlockKey(block))) {
            continue
          }

          const blockData = { ...block, dayType }
          onAddBlock(blockData)
        }
      }
    }, [dayTypes, blocks, departureBlockData])

    return (
      <DepartureBlockGroupContainer>
        <UploadFile label="Lataa lähtöketjutiedosto" uploader={departureBlocksUploader} />
        {departureBlocksLoading && <Loading />}

        {blocks.length !== 0 && (
          <Table
            keyFromItem={createDepartureBlockKey}
            items={blocks}
            columnLabels={departureBlockColumnLabels}
          />
        )}

        <DayTypesContainer>
          {availableDayTypes.map((dt) => (
            <DayTypeOption key={dt}>
              <label>
                {dt}{' '}
                <input
                  type="checkbox"
                  onChange={onDayTypeChange(dt)}
                  checked={dayTypes.includes(dt)}
                />
              </label>
            </DayTypeOption>
          ))}
        </DayTypesContainer>
      </DepartureBlockGroupContainer>
    )
  }
)

const DepartureBlocks: React.FC<PropTypes> = observer(({ departureBlocks, onChange }) => {
  const [dayTypeGroups, setDayTypeGroups] = useState<DayTypeGroup[]>([
    [DayType.Ma, DayType.Ti, DayType.Ke, DayType.To],
    [DayType.Pe],
    [DayType.La],
    [DayType.Su],
  ])

  const usedDayTypes = useMemo(() => flatten(dayTypeGroups), [dayTypeGroups])

  const createDayTypeGroup = useCallback((dayType: DayType) => {
    const dayTypeGroup: DayTypeGroup = [dayType]
    return dayTypeGroup
  }, [])

  // Add a day type group. Each day type (listed in availableDayTypes) should only be in a single group.
  // If passed a dayType, the function will only return the dayTypeGroup it is in without adding a
  // new one if it is found in a group already. If all dayTypes are used, nothing will happen.
  const addDayTypeGroup = useCallback(
    (addDayType?: DayType) => {
      // If no specific dayType was given, search for the next available and unused day type.
      let nextDayType =
        addDayType ?? availableDayTypes.filter((dt) => !usedDayTypes.includes(dt))[0]

      // No day type available to add, bail.
      if (!nextDayType) {
        return
      }

      // If found in an existing group, return the existing group without adding a new group.
      if (usedDayTypes.includes(nextDayType)) {
        return dayTypeGroups.find((dtg) => dtg.includes(nextDayType))
      }

      const addGroup: DayTypeGroup = createDayTypeGroup(nextDayType)
      const nextDayTypes: DayTypeGroup[] = [...dayTypeGroups, addGroup]

      setDayTypeGroups(nextDayTypes)
      return addGroup
    },
    [dayTypeGroups]
  )

  const removeDayTypeFromGroup = useCallback(
    (dayType: DayType, groupIndex: number): DayTypeGroup[] => {
      let group = [...(dayTypeGroups[groupIndex] ?? [])]

      if (group.length === 0) {
        return dayTypeGroups
      }

      const dayTypeIndex = group.findIndex((dt) => dt === dayType)

      if (dayTypeIndex === -1) {
        return dayTypeGroups
      }

      group.splice(dayTypeIndex, 1)

      const nextDayTypeGroups = [...dayTypeGroups]

      if (group.length !== 0) {
        nextDayTypeGroups.splice(groupIndex, 1, group)
      } else {
        nextDayTypeGroups.splice(groupIndex, 1)
      }

      setDayTypeGroups(nextDayTypeGroups)
      return nextDayTypeGroups
    },
    [dayTypeGroups]
  )

  const addDayTypeToGroup = useCallback(
    (dayType: DayType, groupIndex: number): DayTypeGroup[] => {
      let currentDayTypeGroups = dayTypeGroups
      let group = [...(currentDayTypeGroups[groupIndex] ?? [])]

      // Bail if it already exists. Shouldn't happen though.
      if (group.includes(dayType)) {
        return currentDayTypeGroups
      }

      const existingDayTypeGroupIndex = currentDayTypeGroups.findIndex((dtg) =>
        dtg.includes(dayType)
      )

      if (existingDayTypeGroupIndex !== -1) {
        currentDayTypeGroups = removeDayTypeFromGroup(dayType, existingDayTypeGroupIndex)
      }

      // Renew the group after potentially changing the state.
      group = [...(currentDayTypeGroups[groupIndex] ?? [])]
      group.push(dayType)

      const nextDayTypeGroups = [...currentDayTypeGroups]
      nextDayTypeGroups.splice(groupIndex, 1, group)
      setDayTypeGroups(nextDayTypeGroups)

      return nextDayTypeGroups
    },
    [dayTypeGroups]
  )

  const addDepartureBlock = useCallback(
    (block: DepartureBlock) => {
      const nextDepartureBlocks = [...departureBlocks, block]
      onChange(nextDepartureBlocks)
    },
    [departureBlocks]
  )

  const blockGroups: DepartureBlockGroup[] = useMemo(() => {
    return departureBlocks.reduce<DepartureBlockGroup[]>(
      (groups: DepartureBlockGroup[], departureBlock) => {
        if (typeof departureBlock.dayType === 'undefined') {
          return groups
        }

        const blockType: DayType = departureBlock.dayType
        const blockGroupIndex = groups.findIndex((group) => group.dayTypes.includes(blockType))
        let blockGroup: DepartureBlockGroup | null = null

        if (blockGroupIndex !== -1) {
          blockGroup = groups.splice(blockGroupIndex, 1)[0]
        }

        if (!blockGroup) {
          const dayTypeGroupIndex = dayTypeGroups.findIndex((dtg) => dtg.includes(blockType))

          if (dayTypeGroupIndex === -1) {
            return groups
          }

          const dayTypeGroup = dayTypeGroups[dayTypeGroupIndex]

          blockGroup = {
            dayTypes: dayTypeGroup,
            groupIndex: dayTypeGroupIndex,
            blocks: [departureBlock],
          }
        }

        groups.push(blockGroup)
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
          onAddDayType={addDayTypeToGroup}
          onRemoveDayType={removeDayTypeFromGroup}
        />
      ))}
      {difference(availableDayTypes, flatten(dayTypeGroups)).length !== 0 && (
        <Button onClick={() => addDayTypeGroup()}>Lisää lähtöketju</Button>
      )}
    </DepartureBlocksView>
  )
})

export default DepartureBlocks
