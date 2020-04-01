import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useUploader } from '../util/useUploader'
import Checkbox from '../common/input/Checkbox'
import UploadFile from '../common/input/UploadFile'
import Loading from '../common/components/Loading'
import styled from 'styled-components'
import Table, { CellContent } from '../common/components/Table'
import { DayTypeGroup, getEnabledDayTypes } from './departureBlocksCommon'
import { Button, ButtonStyle, TextButton } from '../common/components/Button'
import { ErrorView, FlexRow, MessageView } from '../common/components/common'
import { DayType, Departure, DepartureBlock } from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { removeDepartureBlocks, uploadDepartureBlocksMutation } from './departureBlocksQuery'
import { PreInspectionContext } from '../preInspection/PreInspectionForm'

const DepartureBlockGroupContainer = styled.div`
  margin-bottom: 1rem;
  padding-top: 1rem;

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

const ResetButton = styled(Button).attrs(() => ({ buttonStyle: ButtonStyle.SECONDARY_REMOVE }))`
  margin-left: auto;
`

const departureBlocksColumnLabels = {
  blockNumber: 'Ketjunumero',
  registryNumber: 'Rekisterinumero',
  equipmentId: 'Ajoneuvon tiedot',
  firstStartTime: 'Ensimmäinen lähtö',
  lastEndTime: 'Viimeinen saapuminen',
  routes: 'Reitit',
}

type PropTypes = {
  loading?: boolean
  selectableDayTypes?: string[]
  departureBlocks: DepartureBlock[]
  dayTypeGroup: DayTypeGroup
  groupIndex: number
  onAddDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
  onRemoveDayType: (dayType: DayType, groupIndex: number) => DayTypeGroup[]
  onBlocksChange: () => void
}

const DepartureBlockGroupItem: React.FC<PropTypes> = observer(
  ({
    selectableDayTypes = [],
    dayTypeGroup,
    departureBlocks = [],
    loading,
    groupIndex,
    onAddDayType,
    onRemoveDayType,
    onBlocksChange,
  }) => {
    const [blocksVisible, setBlocksVisibility] = useState(false)
    const preInspection = useContext(PreInspectionContext)
    const preInspectionId = preInspection?.id || ''

    // The state of the file input.
    const [fileValue, setFileValue] = useState<File[]>([])

    // Create an upload handler for uploading the departure block file.
    const uploader = useUploader(uploadDepartureBlocksMutation, {
      variables: {
        inspectionId: preInspectionId,
        dayTypes: getEnabledDayTypes(dayTypeGroup),
      },
    })

    const [
      ,
      { data: uploadedData, loading: departureBlocksLoading, error: uploadFileError },
    ] = uploader

    useEffect(() => {
      if (uploadedData && !departureBlocksLoading) {
        onBlocksChange()
      }
    }, [onBlocksChange, departureBlocksLoading, uploadedData])

    const [removeDepartureBlocksForDays, { loading: removeBlocksLoading }] = useMutationData(
      removeDepartureBlocks
    )

    let isLoading = useMemo(
      () =>
        removeBlocksLoading || departureBlocksLoading || (departureBlocks.length === 0 && loading),
      [loading, departureBlocks, departureBlocksLoading, removeBlocksLoading]
    )

    let isDisabled = useMemo(() => departureBlocks.length !== 0, [departureBlocks])

    // Handle day type selection.
    const onDayTypeChange = useCallback(
      (dayType: DayType, isSelected) => {
        if (isLoading || isDisabled) {
          return
        }

        if (isSelected) {
          onAddDayType(dayType, groupIndex)
        } else {
          onRemoveDayType(dayType, groupIndex)
        }
      },
      [groupIndex, onAddDayType, onRemoveDayType, isDisabled, isLoading]
    )

    // Reset the file value (upload input value) and remove all blocks from the group.
    const onReset = useCallback(async () => {
      if (
        confirm(
          'Olet poistamassa kaikki tähän päiväryhmään kuuluvat lähtöketjut. Uusi lähtöketjutiedosto on ladattava. Ok?'
        )
      ) {
        setFileValue([])

        await removeDepartureBlocksForDays({
          variables: {
            dayTypes: getEnabledDayTypes(dayTypeGroup),
            preInspectionId: preInspectionId,
          },
        })

        onBlocksChange()
      }
    }, [dayTypeGroup, preInspectionId, removeDepartureBlocksForDays, onBlocksChange])

    const onToggleBlocksVisibility = useCallback(() => {
      setBlocksVisibility((currentVisible) => !currentVisible)
    }, [])

    let displayData = useMemo(() => {
      const displayDayTypes = getEnabledDayTypes(dayTypeGroup)
      const displayDayTypeBlocks = displayDayTypes[0]

      if (!displayDayTypeBlocks) {
        return []
      }

      return departureBlocks
        .filter((block) => block.dayType === displayDayTypeBlocks)
        .map((block) => {
          const firstDeparture: Departure | undefined = block.departures[0]
          const lastDeparture: Departure | undefined = block.departures[block.departures.length - 1]
          const routes = block.departures.reduce((allRoutes: string[], departure) => {
            const routeId = departure.routeId || ''

            if (!allRoutes.includes(routeId)) {
              allRoutes.push(routeId)
            }

            return allRoutes
          }, [])

          const equipmentId = block?.equipment?.uniqueVehicleId || ''

          return {
            id: block.id,
            blockNumber: block.blockNumber,
            dayTypes: displayDayTypes.join(', '),
            registryNumber: block.equipmentRegistryNumber,
            equipmentId: equipmentId,
            firstStartTime: firstDeparture?.journeyStartTime || '',
            lastEndTime: lastDeparture?.journeyEndTime || '',
            routes: routes.join(', '),
          }
        })
    }, [departureBlocks, dayTypeGroup])

    const renderTableCell = useCallback(
      (key, val) => {
        return (
          <CellContent style={{ backgroundColor: !val ? 'var(--lighter-red)' : 'transparent' }}>
            {val}
          </CellContent>
        )
      },
      [departureBlocks]
    )

    // Loop through all blocks and find errors.
    let blockErrors = useMemo(
      () =>
        departureBlocks.reduce(
          (errors, block) => {
            // If all checks are already failed, just return the errors.
            if (Object.values(errors).every((val) => val)) {
              return errors
            }

            // Check for missing equipment
            if (!block?.equipment) {
              errors.missingEquipment = true
            }

            return errors
          },
          { missingEquipment: false }
        ),
      [departureBlocks]
    )

    return (
      <DepartureBlockGroupContainer>
        <DayTypesContainer>
          {Object.entries(dayTypeGroup).map(([dt, enabled]) => (
            <DayTypeOption key={dt}>
              <Checkbox
                disabled={
                  isDisabled ||
                  (selectableDayTypes?.length !== 0 && !selectableDayTypes.includes(dt))
                }
                label={dt}
                onChange={(e) => onDayTypeChange(dt as DayType, e.target.checked)}
                checked={enabled}
                name="daytype"
                value={dt}
              />
            </DayTypeOption>
          ))}
        </DayTypesContainer>
        {!loading && !isDisabled && (
          <UploadFile
            label="Lataa lähtöketjutiedosto"
            uploader={uploader}
            value={fileValue}
            onChange={setFileValue}
          />
        )}
        {isLoading && <Loading />}
        {departureBlocks.length !== 0 && (
          <>
            {uploadFileError && <ErrorView>{uploadFileError.message}</ErrorView>}
            {Object.entries(blockErrors).map(
              ([errorName, isError]) =>
                isError && <ErrorView key={errorName}>{errorName}</ErrorView>
            )}
            <FlexRow style={{ marginTop: '1rem' }}>
              <TextButton onClick={onToggleBlocksVisibility} style={{ marginRight: '1rem' }}>
                {blocksVisible ? 'Piilota lähdöt' : 'Näytä lähdöt'}
              </TextButton>
              {!isLoading && isDisabled && (
                <ResetButton onClick={onReset}>Poista kaikki ryhmän lähtöketjut</ResetButton>
              )}
            </FlexRow>
          </>
        )}
        {blocksVisible && displayData.length !== 0 ? (
          <DepartureBlocksTable
            renderCell={renderTableCell}
            keyFromItem={(item) => item.id}
            items={displayData}
            columnLabels={departureBlocksColumnLabels}
          />
        ) : displayData.length === 0 ? (
          <MessageView>Päiväryhmällä ei ole lähtöketjuja.</MessageView>
        ) : null}
      </DepartureBlockGroupContainer>
    )
  }
)

export default DepartureBlockGroupItem
