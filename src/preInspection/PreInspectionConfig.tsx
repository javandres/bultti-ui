import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InputLabel, SectionHeading } from '../common/components/common'
import SelectDate from '../common/input/SelectDate'
import Input from '../common/input/Input'
import { endOfISOWeek, format, parseISO, startOfISOWeek } from 'date-fns'
import { DATE_FORMAT } from '../constants'
import SelectOperator from '../common/input/SelectOperator'
import SelectSeason from '../common/input/SelectSeason'
import { useStateValue } from '../state/useAppState'
import { ControlGroup, FormColumn, FormWrapper } from '../common/components/form'
import { PreInspectionContext } from './PreInspectionForm'
import { PreInspection } from '../schema-types'

const PreInspectionConfigView = styled.div``

export type PropTypes = {
  onUpdateValue: (name: string) => (value: any) => void
}

const PreInspectionConfig: React.FC<PropTypes> = observer(({ onUpdateValue }) => {
  var [season, setGlobalSeason] = useStateValue('globalSeason')
  var [operator, setGlobalOperator] = useStateValue('globalOperator')

  let preInspection: null | PreInspection = useContext(PreInspectionContext)

  return (
    <PreInspectionConfigView>
      {!preInspection && (
        <SectionHeading theme="light">Valitse liikennöitsijä ja kausi</SectionHeading>
      )}
      <FormWrapper>
        <FormColumn width="50%">
          <ControlGroup>
            <SelectOperator
              label="Liikennöitsijä"
              theme="light"
              value={operator}
              onSelect={setGlobalOperator}
            />
          </ControlGroup>
          <ControlGroup>
            <SelectSeason
              label="Aikataulukausi"
              theme="light"
              value={season}
              onSelect={setGlobalSeason}
            />
          </ControlGroup>
        </FormColumn>
        {!!preInspection && (
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
        )}
      </FormWrapper>
    </PreInspectionConfigView>
  )
})

export default PreInspectionConfig
