import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import UploadFile from './UploadFile'
import Loading from '../components/Loading'
import { useUploader } from '../utils/useUploader'
import gql from 'graphql-tag'
import { DayType, DepartureBlock } from '../types/inspection'
import { flatten } from 'lodash'

const uploadDepartureBlocksMutation = gql`
  mutation uploadDepartureBlocks($file: Upload!, $inspectionId: String!) {
    uploadDepartureBlocks(file: $file, inspectionId: $inspectionId) {
      id
      departureTime
      departureType
      direction
      routeId
      vehicleId
    }
  }
`

const DepartureBlocksView = styled.div``

export type PropTypes = {
  departureBlocks: DepartureBlock[]
  onChange: (departureBlocks: DepartureBlock[]) => void
}

type DayTypeGroup = DayType[]

type BlockGroupPropTypes = {
  dayTypeGroup: DayTypeGroup
  onAddBlock: (block: DepartureBlock, dayType: DayType) => void
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

const DepartureBlockDayGroup: React.FC<BlockGroupPropTypes> = observer(
  (dayTypeGroup, onAddBlock) => {
    const departureBlocksUploader = useUploader(uploadDepartureBlocksMutation, {
      variables: {
        inspectionId: '123',
      },
    })

    const [
      ,
      { data: departureBlockData, loading: departureBlocksLoading },
    ] = departureBlocksUploader

    return (
      <>
        <UploadFile label="Lataa lähtöketjutiedosto" uploader={departureBlocksUploader} />
        {departureBlocksLoading ? (
          <Loading />
        ) : departureBlockData ? (
          <pre>
            <code>{JSON.stringify(departureBlockData, null, 2)}</code>
          </pre>
        ) : null}
      </>
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

  const createDayTypeGroup = useCallback((dayType: DayType) => {
    const dayTypeGroup: DayTypeGroup = [dayType]
    return dayTypeGroup
  }, [])

  // Add a day type group. Each day type (listed in availableDayTypes) should only be in a single group.
  // If passed a dayType, the function will only return the dayTypeGroup it is in without adding a
  // new one if it is found in a group already. If all dayTypes are used, nothing will happen.
  const addDayTypeGroup = useCallback(
    (addDayType?: DayType) => {
      const usedDayTypes = flatten(dayTypeGroups)
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

  const addDayTypeToGroup = useCallback((dayType: DayType, dayTypeGroup: DayTypeGroup) => {
    let group = dayTypeGroup
    const groupIndex = dayTypeGroups.findIndex(dtg => dtg.every(dt => dayTypeGroup.includes(dt)))

    if(groupIndex !== -1) {
      group = dayTypeGroups.splice(groupIndex, 1)[0]
    }

    group.push(dayType)

    const nextGroups = [...dayTypeGroups]
  }, [dayTypeGroups])

  const addDepartureBlock = useCallback(
    (block: DepartureBlock, dayType: DayType) => {
      const dayTypeGroupIndex = blockGroup.findIndex((dtg) => dtg.dayTypes.includes(dayType))

      // By default, create a new DayTypeGroup for the block.
      // It will probably be replaced by an existing one.
      let dayTypeGroup = createDayTypeGroup(dayType)

      if (dayTypeGroupIndex !== -1) {
        const removedDayTypeGroup = blockGroup.splice(dayTypeGroupIndex, 1)
        dayTypeGroup = removedDayTypeGroup[0]
      }

      if (!dayTypeGroup) {
        return
      }

      dayTypeGroup.blocks.push(block)
      setDayTypes([...blockGroup, dayTypeGroup])
    },
    [blockGroup]
  )

  useEffect(() => {
    // Loop through all dayTypeGroups and add each day type of the group
    // to each departure block in the group. Call onChange with a flat
    // array of DepartureBlocks with dayTypes added.

    const nextDepartureBlocks = blockGroup.reduce<DepartureBlock[]>((blocks, dayTypeGroup) => {
      const blocksWithDayType: DepartureBlock[] = dayTypeGroup.dayTypes.reduce<
        DepartureBlock[]
      >((dayTypeBlocks, dayType) => {
        const blocksWithDayType: DepartureBlock[] = dayTypeGroup.blocks.map((block) => {
          block.dayType = dayType
          return block
        })

        return [...dayTypeBlocks, ...blocksWithDayType]
      }, [])

      return [...blocks, ...blocksWithDayType]
    }, [])

    onChange(nextDepartureBlocks)
  }, [blockGroup])

  return (
    <DepartureBlocksView>
      {blockGroup.map((dayTypeGroup) => (
        <DepartureBlockDayGroup dayTypeGroup={dayTypeGroup} onAddBlock={addDepartureBlock} />
      ))}
    </DepartureBlocksView>
  )
})

export default DepartureBlocks
