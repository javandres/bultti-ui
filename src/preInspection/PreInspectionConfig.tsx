import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import SelectDate from '../common/input/SelectDate'
import Input from '../common/input/Input'
import { ControlGroup, FormColumn, FormWrapper, InputLabel } from '../common/components/form'
import { Inspection } from '../schema-types'
import { PreInspectionContext } from './PreInspectionContext'
import { MessageContainer, MessageView } from '../common/components/Messages'

const PreInspectionConfigView = styled.div``

export type PropTypes = {
  isEditable: boolean
  onUpdateValue: (name: string) => (value: any) => void
}

const PreInspectionConfig: React.FC<PropTypes> = observer(({ onUpdateValue, isEditable }) => {
  let inspection: null | Inspection = useContext(PreInspectionContext)

  return (
    <PreInspectionConfigView>
      {!inspection ? (
        <MessageContainer>
          <MessageView>Ennakkotarkastus ei valittu.</MessageView>
        </MessageContainer>
      ) : (
        <FormWrapper>
          <FormColumn>
            <InputLabel theme="light">Tuotantojakso</InputLabel>
            <ControlGroup>
              <SelectDate
                name="production_start"
                value={inspection.startDate}
                minDate={inspection.minStartDate}
                maxDate={inspection.season.endDate}
                onChange={onUpdateValue('startDate')}
                label="Alku"
                disabled={!isEditable}
              />
              <Input
                value={inspection.endDate}
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
                value={inspection.inspectionStartDate}
                onChange={onUpdateValue('inspectionStartDate')}
                label="Alku"
                disabled={!isEditable}
              />
              <SelectDate
                name="inspection_end"
                value={inspection.inspectionEndDate}
                minDate={inspection.inspectionStartDate}
                onChange={onUpdateValue('inspectionEndDate')}
                label="Loppu"
                disabled={!isEditable}
              />
            </ControlGroup>
          </FormColumn>
        </FormWrapper>
      )}
    </PreInspectionConfigView>
  )
})

export default PreInspectionConfig
