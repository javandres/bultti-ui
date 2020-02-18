import React, { useCallback, useEffect, useState } from 'react'
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

type DayTypeGroup = {
  dayTypes: DayType[]
  blocks: DepartureBlock[]
}

const availableDayTypes: DayType[] = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']

const DepartureBlocks: React.FC<PropTypes> = observer(({ departureBlocks, onChange }) => {
  const [dayTypeGroups, setDayTypes] = useState<DayTypeGroup[]>([
    {
      dayTypes: ['Ma', 'Ti', 'Ke', 'To'],
      blocks: [],
    },
  ])

  const addDayTypeGroup = useCallback(() => {
    const usedDayTypes = flatten(dayTypeGroups.map((group) => group.dayTypes))
    const nextDayType = availableDayTypes.filter((dt) => !usedDayTypes.includes(dt))[0]

    if (!nextDayType) {
      return
    }

    const addDayTypeGroup: DayTypeGroup = { dayTypes: [nextDayType], blocks: [] }
    const nextDayTypes: DayTypeGroup[] = [...dayTypeGroups, addDayTypeGroup]

    setDayTypes(nextDayTypes)
  }, [dayTypeGroups])

  useEffect(() => {
    // Loop through all dayTypeGroups and add each day type of the group
    // to each departure block in the group. Call onChange with a flat
    // array of DepartureBlocks with dayTypes added.

    const nextDepartureBlocks = dayTypeGroups.reduce<DepartureBlock[]>(
      (blocks, dayTypeGroup) => {
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
      },
      []
    )

    onChange(nextDepartureBlocks)
  }, [dayTypeGroups])

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
    <DepartureBlocksView>
      <UploadFile label="Lataa lähtöketjutiedosto" uploader={departureBlocksUploader} />
      {departureBlocksLoading ? (
        <Loading />
      ) : departureBlockData ? (
        <pre>
          <code>{JSON.stringify(departureBlockData, null, 2)}</code>
        </pre>
      ) : null}
    </DepartureBlocksView>
  )
})

export default DepartureBlocks
