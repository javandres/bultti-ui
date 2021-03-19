import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import SelectDate from '../common/input/SelectDate'
import { ControlGroup, FormColumn, InputLabel } from '../common/components/form'
import { Inspection } from '../schema-types'
import { FlexRow } from '../common/components/common'
import { Button, ButtonStyle } from '../common/components/Button'
import { ActionsWrapper } from '../common/input/ItemForm'
import styled from 'styled-components/macro'
import { addDays, max, parseISO } from 'date-fns'
import { getDateString } from '../util/formatDate'
import { LoadingDisplay } from '../common/components/Loading'
import { text, Text } from '../util/translate'

const InspectionConfigView = styled.div`
  border: 1px solid var(--lighter-grey);
  border-radius: 0.5rem;
  background: white;
  padding: 0 1rem 1rem;
  margin: 0 1rem 1rem;
  position: relative;
`

export type PropTypes = {
  inspection: Inspection
  onSubmit: (startDate: string, endDate: string) => Promise<unknown>
  onCancel: () => unknown
  loading?: boolean
  disabled: boolean
}

type InspectionDateValues = {
  startDate: string
  endDate: string
}

const InspectionApprovalSubmit: React.FC<PropTypes> = observer(
  ({ inspection, onSubmit, onCancel, loading = false, disabled = false }) => {
    let getValuesFromInspection = useCallback((setFromInspection: Inspection) => {
      let minStartDate = parseISO(setFromInspection.minStartDate)

      let startDate = setFromInspection.startDate
        ? parseISO(setFromInspection.startDate)
        : minStartDate

      startDate = max([startDate, minStartDate])

      let endDate = setFromInspection.endDate
        ? parseISO(setFromInspection.endDate)
        : addDays(startDate, 1)

      endDate = max([addDays(startDate, 1), endDate])

      return {
        startDate: getDateString(startDate),
        endDate: getDateString(endDate),
      }
    }, [])

    let [inspectionValues, setInspectionValues] = useState<InspectionDateValues>(
      getValuesFromInspection(inspection)
    )

    let onUpdateValue = useCallback((name, value) => {
      setInspectionValues((currentValues) => {
        let nextValues: InspectionDateValues = { ...currentValues }
        nextValues[name] = value
        return nextValues
      })
    }, [])

    let onSubmitValues = useCallback(async () => {
      await onSubmit(inspectionValues.startDate, inspectionValues.endDate)
    }, [inspectionValues])

    useEffect(() => {
      let values = getValuesFromInspection(inspection)
      setInspectionValues(values)
    }, [inspection])

    return (
      <InspectionConfigView>
        <LoadingDisplay loading={loading} />
        <FlexRow>
          <FormColumn>
            <InputLabel>
              <Text>inspection_inspectionSeason</Text>
            </InputLabel>
            <ControlGroup>
              <SelectDate
                name="production_startDate"
                value={inspectionValues.startDate}
                minDate={inspection.minStartDate}
                maxDate={inspection.season.endDate}
                onChange={(val) => onUpdateValue('startDate', val)}
                label={text('startDate')}
                alignDatepicker="left"
              />
              <SelectDate
                name="production_endDate"
                value={inspectionValues.endDate}
                minDate={getDateString(
                  addDays(parseISO(inspectionValues.startDate || inspection.minStartDate), 1)
                )}
                maxDate={inspection.season.endDate}
                onChange={(val) => onUpdateValue('endDate', val)}
                label={text('endDate')}
              />
            </ControlGroup>
          </FormColumn>
        </FlexRow>
        <FlexRow>
          <ActionsWrapper>
            <Button
              disabled={disabled}
              style={{ marginRight: '1rem' }}
              onClick={onSubmitValues}>
              Lähetä hyväksyttäväksi
            </Button>
            <Button buttonStyle={ButtonStyle.SECONDARY_REMOVE} onClick={onCancel}>
              Peruuta
            </Button>
          </ActionsWrapper>
        </FlexRow>
      </InspectionConfigView>
    )
  }
)

export default InspectionApprovalSubmit
