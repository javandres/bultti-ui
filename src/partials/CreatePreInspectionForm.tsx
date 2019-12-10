import React from 'react'
import styled from 'styled-components'
import { observer, useLocalStore } from 'mobx-react-lite'
import { ColumnWrapper, HalfWidth } from '../components/common'
import SelectOperator from '../inputs/SelectOperator'
import SelectSeason from '../inputs/SelectSeason'
import WeeklyExecutionRequirements, {
  ExecutionRequirement,
} from '../inputs/WeeklyExecutionRequirements'
import { DepartureBlock, Season } from '../types/inspection'
import { Operator } from '../schema-types'

const CreatePreInspectionFormView = styled(ColumnWrapper)``
const FormColumn = styled(HalfWidth)``

const ControlGroup = styled.div`
  margin: 0 0 2rem;
`

interface PreInspectionFormActions {
  selectOperator: (operator: Operator | null) => void
  selectSeason: (season: Season | null) => void
  changeRequirements: (executionRequirements: ExecutionRequirement[]) => void
  setDepartureBlocks: (departureBlocks: DepartureBlock[]) => void
  setStartDate: (startDate: string) => void
  setEndDate: (endDate: string) => void
  setProductionStartDate: (startDate: string) => void
  setProductionEndDate: (endDate: string) => void
}

interface PreInspectionFormData extends PreInspectionFormActions {
  operator: Operator | null
  season: Season | null
  executionRequirements: ExecutionRequirement[]
  startDate: string
  endDate: string
  productionStart: string
  productionEnd: string
  departureBlocks: DepartureBlock[]
}

const CreatePreInspectionForm: React.FC = observer(() => {
  const formState = useLocalStore<PreInspectionFormData>(() => ({
    operator: null,
    season: null,
    executionRequirements: [],
    startDate: '',
    endDate: '',
    productionStart: '',
    productionEnd: '',
    departureBlocks: [],
    selectOperator: (operator = null) => {
      formState.operator = operator
    },
    selectSeason: (season = null) => {
      formState.season = season
    },
    changeRequirements: (executionRequirements = []) => {
      formState.executionRequirements = executionRequirements
    },
    setDepartureBlocks: (departureBlocks = []) => {
      formState.departureBlocks = departureBlocks
    },
    setStartDate: (startDate: string = '') => {
      formState.startDate = startDate
    },
    setEndDate: (endDate: string = '') => {
      formState.endDate = endDate
    },
    setProductionStartDate: (startDate: string = '') => {
      formState.productionStart = startDate
    },
    setProductionEndDate: (endDate: string = '') => {
      formState.productionEnd = endDate
    },
  }))

  return (
    <CreatePreInspectionFormView>
      <FormColumn>
        <ControlGroup>
          <SelectOperator
            label="Liikennöitsijä"
            theme="light"
            value={formState.operator}
            onSelect={formState.selectOperator}
          />
        </ControlGroup>
        <ControlGroup>
          <SelectSeason
            label="Aikataulukausi"
            theme="light"
            value={formState.season}
            onSelect={formState.selectSeason}
          />
        </ControlGroup>
      </FormColumn>
      <FormColumn>
        <WeeklyExecutionRequirements
          startDate={formState.startDate}
          endDate={formState.endDate}
          requirements={formState.executionRequirements}
          onChange={formState.changeRequirements}
        />
      </FormColumn>
    </CreatePreInspectionFormView>
  )
})

export default CreatePreInspectionForm
