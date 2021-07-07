import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Input from '../common/input/Input'
import { FormColumn } from '../common/components/form'
import { Inspection, InspectionInput, InspectionStatus, InspectionType } from '../schema-types'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { FlexRow, PageSection } from '../common/components/common'
import { Button, ButtonStyle } from '../common/components/buttons/Button'
import { ActionsWrapper, FieldLabel } from '../common/input/ItemForm'
import styled from 'styled-components/macro'
import InspectionTimeline from './InspectionTimeline'
import InspectionSelectDates from './inspectionSelectDates'
import { getDateString } from '../util/formatDate'
import { Text, text } from '../util/translate'
import { useWatchDirtyForm } from '../util/promptUnsavedChanges'
import DatePicker from '../common/input/DatePicker'
import {
  didInspectionPeriodChange,
  isPreInspection,
  useCanEditInspection,
} from './inspectionUtils'
import { useStateValue } from '../state/useAppState'

const InspectionConfigView = styled(PageSection)`
  margin: 1rem 0 0;
  padding: 0 1rem 1rem;
`

const ProductionDatePickers = styled(FlexRow)`
  div:first-of-type {
    margin-right: 0.25rem;
  }
`

export type PropTypes = {
  inspection: Inspection
  saveValues: (updatedValues: InspectionInput) => Promise<unknown>
}

const InspectionConfig: React.FC<PropTypes> = observer(({ saveValues, inspection }) => {
  let [globalOperator] = useStateValue('globalOperator')
  let canEditInspection = useCanEditInspection({
    inspectionType: inspection.inspectionType,
    operatorId: globalOperator.id,
  })

  let [
    pendingInspectionInputValues,
    setPendingInspectionInputValues,
  ] = useState<InspectionInput>({})

  let onUpdateValue = useCallback((name: string, value: unknown) => {
    setPendingInspectionInputValues((currentValues) => {
      let nextValues: InspectionInput = { ...currentValues }
      nextValues[name] = value
      return nextValues
    })
  }, [])

  let onChangeInspectionDate = useCallback((startDate: Date, endDate: Date, id?: string) => {
    if (id) {
      onUpdateValue('inspectionDateId', id)
    }

    onUpdateValue('inspectionStartDate', getDateString(startDate))
    onUpdateValue('inspectionEndDate', getDateString(endDate))
  }, [])

  let onSave = useCallback(async () => {
    if (
      inspection.inspectionType === InspectionType.Pre &&
      didInspectionPeriodChange(pendingInspectionInputValues, inspection) &&
      !confirm(text('preInspection_confirmInspectionPeriodChange'))
    ) {
      return
    }

    await saveValues(pendingInspectionInputValues!)
    setPendingInspectionInputValues({})
  }, [inspection, pendingInspectionInputValues])

  let inspectionValues = useMemo(() => ({ ...inspection, ...pendingInspectionInputValues }), [
    inspection,
    pendingInspectionInputValues,
  ])

  let isDirty = useMemo(() => Object.keys(pendingInspectionInputValues).length !== 0, [
    pendingInspectionInputValues,
  ])

  useWatchDirtyForm(isDirty)

  return (
    <InspectionConfigView>
      {!inspection ? (
        <MessageContainer>
          <MessageView>
            <Text>inspection_inspectionNotSelected</Text>
          </MessageView>
        </MessageContainer>
      ) : (
        <>
          <FlexRow>
            <FormColumn>
              <Input
                disabled={!canEditInspection}
                value={inspectionValues.name || ''}
                label={text('inspection_inspectionName')}
                onChange={(value: string) => {
                  onUpdateValue('name', value)
                }}
              />
            </FormColumn>
          </FlexRow>
          <FlexRow>
            <InspectionTimeline currentInspection={inspection} />
          </FlexRow>
          <FlexRow>
            <InspectionSelectDates
              inspectionType={inspection.inspectionType}
              inspectionSeason={inspection.season}
              isEditingDisabled={inspection.status !== InspectionStatus.Draft}
              inspectionInput={inspectionValues}
              onChange={onChangeInspectionDate}
            />
          </FlexRow>
          {isPreInspection(inspection) && (
            <>
              <FieldLabel style={{ textTransform: 'uppercase' }}>
                <Text>inspection_selectProductionDate</Text>
              </FieldLabel>
              <ProductionDatePickers>
                <DatePicker
                  value={getDateString(inspectionValues.startDate)}
                  minDate={inspection.minStartDate}
                  maxDate={inspection.season.endDate}
                  onChange={(dateString: string | null) => {
                    onUpdateValue('startDate', dateString)
                  }}
                  acceptableDayTypes={['Ma']}
                  disabled={inspection.status !== InspectionStatus.Draft}
                />
                <DatePicker
                  value={getDateString(inspectionValues.endDate)}
                  maxDate={inspection.season.endDate}
                  onChange={(dateString: string | null) => {
                    onUpdateValue('endDate', dateString)
                  }}
                  acceptableDayTypes={['Su']}
                  disabled={inspection.status !== InspectionStatus.Draft}
                />
              </ProductionDatePickers>
            </>
          )}
          <FlexRow>
            <ActionsWrapper>
              <Button style={{ marginRight: '1rem' }} onClick={onSave} disabled={!isDirty}>
                <Text>save</Text>
              </Button>
              <Button
                buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                onClick={() => setPendingInspectionInputValues({})}>
                <Text>cancel</Text>
              </Button>
            </ActionsWrapper>
          </FlexRow>
        </>
      )}
    </InspectionConfigView>
  )
})

export default InspectionConfig
