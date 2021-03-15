import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Input from '../common/input/Input'
import { isEqual, pick } from 'lodash'
import { ControlGroup, FormColumn, InputLabel } from '../common/components/form'
import { Inspection, InspectionInput, InspectionStatus } from '../schema-types'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { FlexRow, PageSection } from '../common/components/common'
import { Button, ButtonStyle } from '../common/components/Button'
import { ActionsWrapper } from '../common/input/ItemForm'
import styled from 'styled-components/macro'
import InspectionTimeline from './InspectionTimeline'
import InspectionSelectDates from './inspectionSelectDates'
import { getDateString } from '../util/formatDate'
import { Text, text } from '../util/translate'

const InspectionConfigView = styled(PageSection)`
  margin: 1rem 0 0;
  padding: 0 1rem 1rem;
`

export type PropTypes = {
  inspection: Inspection
  saveValues: (updatedValues: InspectionInput) => Promise<unknown>
}

const InspectionConfig: React.FC<PropTypes> = observer(({ saveValues, inspection }) => {
  let getInspectionInputValues = (setFromInspection: Inspection) => {
    return {
      name: setFromInspection.name || '',
      inspectionStartDate: setFromInspection.inspectionStartDate || '',
      inspectionEndDate: setFromInspection.inspectionEndDate || '',
    }
  }

  let initialInspectionInputValues = getInspectionInputValues(inspection)

  let [
    pendingInspectionInputValues,
    setPendingInspectionInputValues,
  ] = useState<InspectionInput>(initialInspectionInputValues)

  let onUpdateValue = useCallback((name: string, value: any) => {
    setPendingInspectionInputValues((currentValues) => {
      let nextValues: InspectionInput = { ...currentValues }
      nextValues[name] = value
      return nextValues
    })
  }, [])

  let onSave = useCallback(async () => {
    await saveValues(pendingInspectionInputValues!)
  }, [pendingInspectionInputValues])

  let isDirty = useMemo(
    () =>
      !isEqual(
        // Pick only props existing on the pending inspection input for comparison
        pick(inspection, Object.keys(pendingInspectionInputValues)),
        pendingInspectionInputValues
      ),
    [pendingInspectionInputValues, inspection]
  )

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
                value={pendingInspectionInputValues.name || ''}
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
              isEditingDisabled={inspection.status !== InspectionStatus.Draft}
              inspectionInput={pendingInspectionInputValues}
              onChange={(startDate: Date, endDate: Date) => {
                onUpdateValue('inspectionStartDate', getDateString(startDate))
                onUpdateValue('inspectionEndDate', getDateString(endDate))
              }}
            />
          </FlexRow>
          <FlexRow>
            {inspection.status !== InspectionStatus.Draft && (
              <FormColumn>
                <InputLabel>{text('inspection_inspectionSeason')}</InputLabel>
                <ControlGroup>
                  <Input
                    type="date"
                    value={inspection.startDate}
                    label={text('startDate')}
                    subLabel={true}
                    disabled={true}
                  />
                  <Input
                    type="date"
                    value={inspection.endDate}
                    label={text('endDate')}
                    subLabel={true}
                    disabled={true}
                  />
                </ControlGroup>
              </FormColumn>
            )}
          </FlexRow>
          <FlexRow>
            <ActionsWrapper>
              <Button style={{ marginRight: '1rem' }} onClick={onSave} disabled={!isDirty}>
                <Text>save</Text>
              </Button>
              <Button
                buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                onClick={() =>
                  setPendingInspectionInputValues(getInspectionInputValues(inspection))
                }>
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
