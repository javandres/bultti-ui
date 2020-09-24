import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import SelectDate from '../common/input/SelectDate'
import Input from '../common/input/Input'
import { ControlGroup, FormColumn, InputLabel } from '../common/components/form'
import { Inspection, InspectionInput } from '../schema-types'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { FlexRow } from '../common/components/common'
import { Button, ButtonStyle } from '../common/components/Button'
import { ActionsWrapper } from '../common/input/ItemForm'
import { DATE_FORMAT } from '../constants'
import styled from 'styled-components'
import { format, parseISO, startOfISOWeek } from 'date-fns'

const InspectionConfigView = styled.div`
  border: 1px solid var(--lighter-grey);
  margin-top: 1rem;
  border-radius: 0.5rem;
  background: white;
  padding: 1rem;
`

export type PropTypes = {
  inspection: Inspection
  isEditable: boolean
  saveValues: (updatedValues: InspectionInput) => Promise<unknown>
}

const InspectionConfig: React.FC<PropTypes> = observer(
  ({ saveValues, isEditable, inspection }) => {
    let isDirty = useRef(false)
    let [inspectionValues, setInspectionValues] = useState<InspectionInput>({})

    let onUpdateValue = useCallback((name, value) => {
      isDirty.current = true

      setInspectionValues((currentValues) => {
        let nextValues: InspectionInput = { ...currentValues }
        nextValues[name] = value
        return nextValues
      })
    }, [])

    let onSaveValues = useCallback(async () => {
      isDirty.current = false
      await saveValues(inspectionValues)
    }, [inspectionValues])

    useEffect(() => {
      if (!isDirty.current) {
        setValuesFromInspection(inspection)
      }
    }, [inspection])

    let setValuesFromInspection = useCallback((setFromInspection: Inspection) => {
      setInspectionValues({
        name: setFromInspection.name || '',
        startDate: setFromInspection.startDate || '',
        endDate: setFromInspection.endDate || '',
        inspectionStartDate: setFromInspection.inspectionStartDate || '',
        inspectionEndDate: setFromInspection.inspectionEndDate || '',
      })
    }, [])

    return (
      <InspectionConfigView>
        {!inspection ? (
          <MessageContainer>
            <MessageView>Ennakkotarkastus ei valittu.</MessageView>
          </MessageContainer>
        ) : (
          <>
            <FlexRow>
              <FormColumn>
                <Input
                  value={inspectionValues.name || ''}
                  onChange={(val) => onUpdateValue('name', val)}
                  label="Tarkastuksen nimi"
                />
              </FormColumn>
            </FlexRow>
            <FlexRow>
              <FormColumn>
                <InputLabel theme="light">Tuotantojakso</InputLabel>
                <ControlGroup>
                  <SelectDate
                    name="production_start"
                    value={inspectionValues.startDate}
                    minDate={inspection.minStartDate}
                    maxDate={inspection.season.endDate}
                    onChange={(val) => onUpdateValue('startDate', val)}
                    label="Alku"
                    disabled={!isEditable}
                    alignDatepicker="left"
                  />
                  <Input
                    value={inspectionValues.endDate}
                    label="Loppu"
                    subLabel={true}
                    disabled={true}
                  />
                </ControlGroup>
              </FormColumn>
              <FormColumn>
                <InputLabel theme="light">Tarkastusjakso</InputLabel>
                <ControlGroup>
                  <SelectDate
                    name="inspection_start"
                    minDate={format(
                      startOfISOWeek(parseISO(inspection.minStartDate)),
                      DATE_FORMAT
                    )}
                    value={inspectionValues.inspectionStartDate}
                    onChange={(val) => onUpdateValue('inspectionStartDate', val)}
                    label="Alku"
                    disabled={!isEditable}
                  />
                  <SelectDate
                    name="inspection_end"
                    value={inspectionValues.inspectionEndDate}
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
                <Button style={{ marginRight: '1rem' }} onClick={onSaveValues}>
                  Tallenna
                </Button>
                <Button
                  buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                  onClick={() => setValuesFromInspection(inspection)}>
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
