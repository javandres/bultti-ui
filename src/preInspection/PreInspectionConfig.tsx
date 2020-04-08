import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InputLabel, MessageContainer, MessageView } from '../common/components/common'
import SelectDate from '../common/input/SelectDate'
import Input from '../common/input/Input'
import { endOfISOWeek, format, parseISO, startOfISOWeek } from 'date-fns'
import { DATE_FORMAT } from '../constants'
import { ControlGroup, FormColumn, FormWrapper } from '../common/components/form'
import { PreInspection } from '../schema-types'
import { PreInspectionContext } from './PreInspectionContext'

const PreInspectionConfigView = styled.div``

export type PropTypes = {
  onUpdateValue: (name: string) => (value: any) => void
}

const PreInspectionConfig: React.FC<PropTypes> = observer(({ onUpdateValue }) => {
  let preInspection: null | PreInspection = useContext(PreInspectionContext)

  return (
    <PreInspectionConfigView>
      {!preInspection ? (
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
                value={preInspection.startDate}
                onChange={onUpdateValue('startDate')}
                label="Alku"
              />
              <Input value={preInspection.endDate} label="Loppu" subLabel={true} disabled={true} />
            </ControlGroup>
            <InputLabel theme="light">Tarkastusjakso</InputLabel>
            <ControlGroup>
              <Input
                value={format(startOfISOWeek(parseISO(preInspection.startDate)), DATE_FORMAT)}
                label="Alku"
                subLabel={true}
                disabled={true}
              />
              <Input
                value={format(endOfISOWeek(parseISO(preInspection.startDate)), DATE_FORMAT)}
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
