import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import SelectDate from '../common/input/SelectDate'
import Input from '../common/input/Input'
import { isEqual } from 'lodash'
import { ControlGroup, FormColumn, InputLabel } from '../common/components/form'
import { Inspection, InspectionInput, InspectionStatus } from '../schema-types'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { FlexRow, PageSection } from '../common/components/common'
import { Button, ButtonStyle } from '../common/components/Button'
import { ActionsWrapper } from '../common/input/ItemForm'
import { DATE_FORMAT } from '../constants'
import styled from 'styled-components'
import { format, parseISO, startOfISOWeek } from 'date-fns'
import InspectionTimeline from './InspectionTimeline'

const InspectionConfigView = styled(PageSection)`
  margin: 1rem 0 0;
  padding: 0 1rem 1rem;
`

export type PropTypes = {
  inspection: Inspection
  isEditable: boolean
  saveValues: (updatedValues: InspectionInput) => Promise<unknown>
}

const InspectionConfig: React.FC<PropTypes> = observer(
  ({ saveValues, isEditable, inspection }) => {
    const getInspectionInputValues = (setFromInspection: Inspection) => {
      return {
        name: setFromInspection.name || '',
        inspectionStartDate: setFromInspection.inspectionStartDate || '',
        inspectionEndDate: setFromInspection.inspectionEndDate || '',
      }
    }
    const initialInspectionInputValues = getInspectionInputValues(inspection)
    let [pendingInspectionInputValues, setPendingInspectionInputValues] = useState<
      InspectionInput
    >(initialInspectionInputValues)
    let [oldInspectionInputValues, setOldInspectionInputValues] = useState<InspectionInput>(
      initialInspectionInputValues
    )
    let onUpdateValue = useCallback((name, value) => {
      setPendingInspectionInputValues((currentValues) => {
        let nextValues: InspectionInput = { ...currentValues }
        nextValues[name] = value
        return nextValues
      })
    }, [])

    let onSave = useCallback(async () => {
      await saveValues(pendingInspectionInputValues!)
      setOldInspectionInputValues(pendingInspectionInputValues)
    }, [pendingInspectionInputValues])

    let isDirty = useMemo(
      () => !isEqual(oldInspectionInputValues, pendingInspectionInputValues),
      [pendingInspectionInputValues]
    )

    return (
      <InspectionConfigView>
        {!inspection ? (
          <MessageContainer>
            <MessageView>Tarkastusta ei ole valittu.</MessageView>
          </MessageContainer>
        ) : (
          <>
            <FlexRow>
              <FormColumn>
                <Input
                  value={pendingInspectionInputValues.name || ''}
                  onChange={(val) => onUpdateValue('name', val)}
                  label="Tarkastuksen nimi"
                />
              </FormColumn>
            </FlexRow>
            <FlexRow>
              <InspectionTimeline currentInspection={inspection} />
            </FlexRow>
            <FlexRow>
              {inspection.status !== InspectionStatus.Draft && (
                <FormColumn>
                  <InputLabel theme="light">Tuotantojakso</InputLabel>
                  <ControlGroup>
                    <Input
                      type="date"
                      value={inspection.startDate}
                      label="Alku"
                      subLabel={true}
                      disabled={true}
                    />
                    <Input
                      type="date"
                      value={inspection.endDate}
                      label="Loppu"
                      subLabel={true}
                      disabled={true}
                    />
                  </ControlGroup>
                </FormColumn>
              )}
              <FormColumn>
                <InputLabel theme="light">Tarkastusjakso</InputLabel>
                <ControlGroup>
                  <SelectDate
                    name="inspection_start"
                    minDate={format(
                      startOfISOWeek(parseISO(inspection.minStartDate)),
                      DATE_FORMAT
                    )}
                    value={pendingInspectionInputValues.inspectionStartDate}
                    onChange={(val) => onUpdateValue('inspectionStartDate', val)}
                    label="Alku"
                    disabled={!isEditable}
                  />
                  <SelectDate
                    name="inspection_end"
                    value={pendingInspectionInputValues.inspectionEndDate}
                    minDate={inspection.inspectionStartDate}
                    onChange={(val) => onUpdateValue('inspectionEndDate', val)}
                    label="Loppu"
                    disabled={!isEditable}
                    alignDatepicker="right"
                  />
                </ControlGroup>
              </FormColumn>
            </FlexRow>
            <FlexRow>
              <ActionsWrapper>
                <Button style={{ marginRight: '1rem' }} onClick={onSave} disabled={!isDirty}>
                  Tallenna
                </Button>
                <Button
                  buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                  onClick={() =>
                    setPendingInspectionInputValues(getInspectionInputValues(inspection))
                  }>
                  Peruuta
                </Button>
              </ActionsWrapper>
            </FlexRow>
          </>
        )}
      </InspectionConfigView>
    )
  }
)

export default InspectionConfig
