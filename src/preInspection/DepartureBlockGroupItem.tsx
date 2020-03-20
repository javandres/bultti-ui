import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useUploader } from '../util/useUploader'
import Checkbox from '../common/input/Checkbox'
import UploadFile from '../common/input/UploadFile'
import Loading from '../common/components/Loading'
import styled from 'styled-components'
import Table from '../common/components/Table'
import gql from 'graphql-tag'
import { DayTypeGroup, getEnabledDayTypes } from './departureBlocksCommon'
import { Button, TextButton } from '../common/components/Button'
import { FlexRow } from '../common/components/common'
import { DayType, DepartureBlock } from '../schema-types'

const uploadDepartureBlocksMutation = gql`
  mutation uploadDepartureBlocks($file: Upload!, $dayTypes: [DayType!]!, $inspectionId: String!) {
    createDepartureBlockFromFile(file: $file, dayTypes: $dayTypes, preInspectionId: $inspectionId) {
      id
      dayType
      departures {
        id
        blockNumber
        controlDepot
        startDepot
        direction
        routeId
        variant
        journeyStartTime
        journeyEndTime
        journeyType
        equipment {
          id
          vehicleId
          registryNr
        }
      }
    }
  }
`

const DepartureBlockGroupContainer = styled.div`
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--lighter-grey);

  &:first-child {
    padding-top: 0;
  }
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

const departureColumnLabels = {
  id: 'ID',
  dayType: 'Päivä',
  departureTime: 'Aika',
  direction: 'Suunta',
  routeId: 'Reitti',
  variant: 'Variantti',
}

type PropTypes = {
  inspectionId: string
  dayTypeGroup: DayTypeGroup
  groupIndex: number
  onAddDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
  onRemoveDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
}

const DepartureBlockGroupItem: React.FC<PropTypes> = observer(
  ({ inspectionId, dayTypeGroup, groupIndex, onAddDayType, onRemoveDayType }) => {
    const [blocksVisible, setBlocksVisibility] = useState(false)

    // The state of the file input.
    const [fileValue, setFileValue] = useState<File[]>([])

    // Create an upload handler for uploading the departure block file.
    const uploader = useUploader(uploadDepartureBlocksMutation, {
      variables: {
        inspectionId: inspectionId,
        dayTypes: getEnabledDayTypes(dayTypeGroup),
      },
    })

    const [, { data: departureBlockData, loading: departureBlocksLoading }] = uploader

    console.log(departureBlockData)

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

    // Reset the file value (upload input value) and remove all blocks from the group.
    const onReset = useCallback(() => {
      setFileValue([])
    }, [dayTypeGroup])

    let displayBlock: null | DepartureBlock = useMemo(() => {
      if (!departureBlockData || departureBlockData.length === 0) {
        return null
      }

      return departureBlockData[0]
    }, [departureBlockData])

    const onToggleBlocksVisibility = useCallback(() => {
      setBlocksVisibility(!blocksVisible)
    }, [blocksVisible])

    let departures = useMemo(() => displayBlock?.departures || [], [displayBlock])

    return (
      <DepartureBlockGroupContainer>
        <DayTypesContainer>
          {Object.entries(dayTypeGroup).map(([dt, enabled]) => (
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
          {displayBlock && (
            <>
              <TextButton onClick={onToggleBlocksVisibility} style={{ marginRight: '1rem' }}>
                {blocksVisible ? 'Piilota lähdöt' : 'Näytä lähdöt'}
              </TextButton>
            </>
          )}
          {fileValue.length !== 0 && <ResetButton onClick={onReset}>Reset</ResetButton>}
        </FlexRow>
        {blocksVisible && displayBlock && (displayBlock?.departures || []).length !== 0 && (
          <DepartureBlocksTable
            keyFromItem={(item) => item.id}
            items={departures}
            columnLabels={departureColumnLabels}
          />
        )}
      </DepartureBlockGroupContainer>
    )
  }
)

export default DepartureBlockGroupItem
