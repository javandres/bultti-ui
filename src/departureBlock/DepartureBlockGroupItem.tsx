import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useUploader } from '../util/useUploader'
import Checkbox from '../common/input/Checkbox'
import UploadFile from '../common/input/UploadFile'
import { LoadingDisplay } from '../common/components/Loading'
import styled from 'styled-components'
import { DayTypeGroup, getEnabledDayTypes } from './departureBlocksCommon'
import { Button, ButtonStyle } from '../common/components/Button'
import { DayType } from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { removeDepartureBlocks, uploadDepartureBlocksMutation } from './blockDeparturesQuery'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { ErrorView, SuccessView } from '../common/components/Messages'

const DepartureBlockGroupContainer = styled.div`
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-bottom: 1px solid var(--lighter-grey);
  position: relative;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: 0;
    margin-bottom: 0;
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
  hasDepartures: boolean
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
    loading = false,
    groupIndex,
    onAddDayType,
    onRemoveDayType,
    onBlocksChange,
    hasDepartures,
  }) => {
    let [showBlocksLoading, setShowBlocksLoading] = useState(loading)

    let inspection = useContext(PreInspectionContext)
    let inspectionId = inspection?.id || ''

    useEffect(() => {
      if (!loading) {
        setShowBlocksLoading(false)
      }
    }, [loading])

    // The state of the file input.
    const [fileValue, setFileValue] = useState<File[]>([])

    // Create an upload handler for uploading the departure block file.
    const uploader = useUploader(uploadDepartureBlocksMutation, {
      variables: {
        inspectionId: inspectionId,
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
      () => removeBlocksLoading || ((hasDepartures || showBlocksLoading) && loading),
      [loading, hasDepartures, showBlocksLoading, removeBlocksLoading]
    )

    // The group is disabled when there are no departures.
    let isDisabled = hasDepartures

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
            inspectionId: inspectionId,
          },
        })

        onBlocksChange()
      }
    }, [dayTypeGroup, inspectionId, removeDepartureBlocksForDays, onBlocksChange])

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
          {hasDepartures && !isLoading && (
            <ResetButton style={{ marginLeft: 'auto' }} onClick={onReset}>
              Poista kaikki ryhmän lähtöketjut
            </ResetButton>
          )}
        </DayTypesContainer>
        {(!hasDepartures || fileValue.length !== 0) && (
          <UploadFile
            disabled={loading || isDisabled}
            label="Lataa lähtöketjutiedosto"
            uploader={uploader}
            value={fileValue}
            onChange={setFileValue}
          />
        )}
        <LoadingDisplay loading={isLoading} />
        {hasDepartures && (
          <>
            <SuccessView>
              Tällä päiväryhmällä on lähtöketjuja ja se ei ole muokattavissa.
            </SuccessView>
            {uploadFileError && <ErrorView>{uploadFileError.message}</ErrorView>}
          </>
        )}
      </DepartureBlockGroupContainer>
    )
  }
)

export default DepartureBlockGroupItem
