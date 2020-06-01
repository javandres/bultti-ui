import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import SelectDate from '../common/input/SelectDate'
import Input from '../common/input/Input'
import { endOfISOWeek, format, parseISO, startOfISOWeek } from 'date-fns'
import { DATE_FORMAT } from '../constants'
import { ControlGroup, FormColumn, FormWrapper, InputLabel } from '../common/components/form'
import { Inspection } from '../schema-types'
import { PreInspectionContext } from './PreInspectionContext'
import { MessageContainer, MessageView } from '../common/components/Messages'

const PreInspectionConfigView = styled.div``

export type PropTypes = {
  onUpdateValue: (name: string) => (value: any) => void
}

const PreInspectionConfig: React.FC<PropTypes> = observer(({ onUpdateValue }) => {
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
              <Input
                value={format(startOfISOWeek(parseISO(inspection.startDate)), DATE_FORMAT)}
                label="Alku"
                subLabel={true}
                disabled={true}
              />
              <Input
                value={format(endOfISOWeek(parseISO(inspection.startDate)), DATE_FORMAT)}
                label="Loppu"
                subLabel={true}
                disabled={true}
              />
            </ControlGroup>
          </FormColumn>
        </FormWrapper>
      )}
    </PreInspectionConfigView>
  )
})

export default PreInspectionConfig
