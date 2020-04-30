import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useUploader } from '../util/useUploader'
import Checkbox from '../common/input/Checkbox'
import UploadFile from '../common/input/UploadFile'
import { LoadingDisplay } from '../common/components/Loading'
import styled from 'styled-components'
import { DayTypeGroup, getEnabledDayTypes } from './departureBlocksCommon'
import { Button, ButtonStyle } from '../common/components/Button'
import { DayType, DepartureBlock } from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { removeDepartureBlocks, uploadDepartureBlocksMutation } from './departureBlocksQuery'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { ErrorView } from '../common/components/Messages'

const DepartureBlockGroupContainer = styled.div`
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-bottom: 1px solid var(--lighter-grey);
  position: relative;

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

const ResetButton = styled(Button).attrs(() => ({
  buttonStyle: ButtonStyle.SECONDARY_REMOVE,
}))`
  margin-left: auto;
`

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
    let [showBlocksLoading, setShowBlocksLoading] = useState(departureBlocks.length === 0)

    let preInspection = useContext(PreInspectionContext)
    let preInspectionId = preInspection?.id || ''

    useEffect(() => {
      if (!loading && departureBlocks.length !== 0) {
        setShowBlocksLoading(false)
      }
    }, [departureBlocks, loading])

    // The state of the file input.
    const [fileValue, setFileValue] = useState<File[]>([])

    // Create an upload handler for uploading the departure block file.
    const uploader = useUploader(uploadDepartureBlocksMutation, {
      variables: {
        inspectionId: preInspectionId,
        dayTypes: getEnabledDayTypes(dayTypeGroup),
      },
    })

    const [, { data: uploadedData, loading: uploadLoading, error: uploadFileError }] = uploader

    useEffect(() => {
      if (uploadedData && !uploadLoading) {
        onBlocksChange()
      }
    }, [onBlocksChange, uploadLoading, uploadedData])

    const [removeDepartureBlocksForDays, { loading: removeBlocksLoading }] = useMutationData(
      removeDepartureBlocks
    )

    let isLoading = useMemo(
      () =>
        removeBlocksLoading ||
        ((showBlocksLoading || departureBlocks.length === 0) && loading),
      [loading, showBlocksLoading, departureBlocks, removeBlocksLoading]
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
        setShowBlocksLoading(true)

        await removeDepartureBlocksForDays({
          variables: {
            dayTypes: getEnabledDayTypes(dayTypeGroup),
            preInspectionId: preInspectionId,
          },
        })

        onBlocksChange()
      }
    }, [dayTypeGroup, preInspectionId, removeDepartureBlocksForDays, onBlocksChange])

    // Loop through all blocks and find errors.
    let blockErrors = useMemo(
      () =>
        departureBlocks.reduce(
          (errors, block) => {
            // If all checks are already failed, just return the errors.
            if (Object.values(errors).every((val) => val)) {
              return errors
            }

            // Check for missing equipment. It's the only check for now.
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
          {departureBlocks.length !== 0 && !isLoading && isDisabled && (
            <ResetButton style={{ marginLeft: 'auto' }} onClick={onReset}>
              Poista kaikki ryhmän lähtöketjut
            </ResetButton>
          )}
        </DayTypesContainer>
        {((isDisabled && fileValue.length !== 0) || !isDisabled) && (
          <UploadFile
            disabled={loading || isDisabled}
            label="Lataa lähtöketjutiedosto"
            uploader={uploader}
            value={fileValue}
            onChange={setFileValue}
          />
        )}
        <LoadingDisplay loading={isLoading} />
        {departureBlocks.length !== 0 && (
          <>
            {uploadFileError && <ErrorView>{uploadFileError.message}</ErrorView>}
            {Object.entries(blockErrors).map(
              ([errorName, isError]) =>
                isError && <ErrorView key={errorName}>{errorName}</ErrorView>
            )}
          </>
        )}
      </DepartureBlockGroupContainer>
    )
  }
)

export default DepartureBlockGroupItem
