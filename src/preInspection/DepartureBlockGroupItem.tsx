import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useUploader } from '../utils/useUploader'
import { DayType, DepartureBlock } from '../types/inspection'
import Checkbox from '../common/inputs/Checkbox'
import UploadFile from '../common/inputs/UploadFile'
import Loading from '../common/components/Loading'
import { orderBy, uniqBy } from 'lodash'
import styled from 'styled-components'
import Table from '../common/components/Table'
import gql from 'graphql-tag'
import {
  createDepartureBlockKey,
  DayTypeGroup,
  defaultDayTypeGroup,
  DepartureBlockGroup,
  getEnabledDayTypes,
} from './departureBlocksCommon'
import { Button, TextButton } from '../common/components/Button'
import { FlexRow } from '../common/components/common'

const uploadDepartureBlocksMutation = gql`
  mutation uploadDepartureBlocks($file: Upload, $inspectionId: String!) {
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

const ResetButton = styled(Button)`
  margin-left: auto;
`

const departureBlockColumnLabels = {
  id: 'ID',
  dayType: 'Päivä',
  departureTime: 'Aika',
  departureType: 'Tyyppi',
  direction: 'Suunta',
  routeId: 'Reitti',
  vehicleId: 'Kylkinro',
  arrivalTime: 'Saap.aika',
  inDepot: 'Lähtövar.',
  outDepot: 'Loppuvar.',
}

type PropTypes = {
  blockGroup: DepartureBlockGroup
  onAddBlock: (block: DepartureBlock) => void
  onRemoveBlock: (block: DepartureBlock) => void
  onRemoveAllBlocks: (dayTypes: DayType[]) => void
  onAddDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
  onRemoveDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
}

const DepartureBlockGroupItem: React.FC<PropTypes> = observer(
  ({
    blockGroup,
    onAddBlock,
    onRemoveBlock,
    onAddDayType,
    onRemoveDayType,
    onRemoveAllBlocks,
  }) => {
    const groupHasHiddenBlocks = useRef(false)

    const [blocksVisible, setBlocksVisibility] = useState(false)
    const [dayTypesVisible, setDayTypesVisibility] = useState(false)

    // The state of the file input.
    const [fileValue, setFileValue] = useState<File[]>([])

    const { dayTypes, groupIndex, blocks } = blockGroup

    // Create an upload handler for uploading the departure block file.
    const uploader = useUploader(uploadDepartureBlocksMutation, {
      variables: {
        inspectionId: '123',
      },
    })

    const [, { data: departureBlockData, loading: departureBlocksLoading }] = uploader

    // Handle day type selection.
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

    // Reset the file value (file input value) and remove all blocks from the group.
    const onReset = useCallback(() => {
      setFileValue([])
      groupHasHiddenBlocks.current = false
      onRemoveAllBlocks(getEnabledDayTypes(dayTypes) as DayType[])
    }, [dayTypes])

    const onBlockRemoveClick = useCallback(
      (block) => () => {
        groupHasHiddenBlocks.current = true
        onRemoveBlock(block)
      },
      [onRemoveBlock]
    )

    useEffect(() => {
      // If we have no uploaded blocks, bail.
      if (!departureBlockData || fileValue.length === 0 || departureBlocksLoading) {
        return
      }

      // If all blocks were removed, reset the group. Then bail.
      if (
        groupHasHiddenBlocks.current &&
        blocks.length === 0 &&
        ((departureBlockData && departureBlockData.length !== 0) || fileValue.length !== 0)
      ) {
        onReset()
        return
      }

      // Add all uploaded blocks to the pre-inspection state. Add one copy of each departure
      // per day type selected for this group. If the file contains one row and there are
      // four dayTypes selected, we would add four distinct departures.

      const existingBlockKeys = blocks.map((block) => createDepartureBlockKey(block))
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
    }, [dayTypes, blocks, departureBlockData, fileValue, departureBlocksLoading, onReset])

    const onToggleBlocksVisibility = useCallback(() => {
      setBlocksVisibility(!blocksVisible)
    }, [blocksVisible])

    const onToggleDayTypesVisibility = useCallback(() => {
      setDayTypesVisibility(!dayTypesVisible)
    }, [dayTypesVisible])

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
        <UploadFile
          label="Lataa lähtöketjutiedosto"
          uploader={uploader}
          value={fileValue}
          onChange={setFileValue}
        />
        {departureBlocksLoading && <Loading />}
        <FlexRow>
          {blocks.length !== 0 && (
            <>
              <TextButton onClick={onToggleBlocksVisibility} style={{ marginRight: '1rem' }}>
                {blocksVisible ? 'Piilota lähtöketjut' : 'Näytä lähtöketjut'}
              </TextButton>
              {blocksVisible && (
                <TextButton onClick={onToggleDayTypesVisibility}>
                  {dayTypesVisible ? 'Piilota päivätyypit' : 'Näytä päivätyypit'}
                </TextButton>
              )}
            </>
          )}
          {fileValue.length !== 0 && <ResetButton onClick={onReset}>Reset</ResetButton>}
        </FlexRow>
        {blocksVisible && blocks.length !== 0 && (
          <DepartureBlocksTable
            onRemoveRow={dayTypesVisible && blocks.length > 1 ? onBlockRemoveClick : undefined}
            keyFromItem={createDepartureBlockKey}
            items={
              dayTypesVisible
                ? orderBy(blocks, ({ dayType }) =>
                    Object.keys(defaultDayTypeGroup).indexOf(dayType as string)
                  )
                : uniqBy(blocks, 'id').map(({ dayType, ...block }) => block)
            }
            columnLabels={departureBlockColumnLabels}
          />
        )}
      </DepartureBlockGroupContainer>
    )
  }
)

export default DepartureBlockGroupItem
