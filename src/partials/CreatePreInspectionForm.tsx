import React from 'react'
import styled from 'styled-components'
import { observer, useLocalStore } from 'mobx-react-lite'
import { ColumnWrapper, HalfWidth } from '../components/common'
import SelectOperator from '../inputs/SelectOperator'
import SelectSeason from '../inputs/SelectSeason'

const CreatePreInspectionFormView = styled(ColumnWrapper)``
const FormColumn = styled(HalfWidth)``

const ControlGroup = styled.div`
  margin: 0 0 2rem;
`

const CreatePreInspectionForm: React.FC = observer(() => {
  const formState = useLocalStore(() => ({
    operator: null,
    season: null,
    selectOperator: (operator = null) => {
      formState.operator = operator
    },
    selectSeason: (season = null) => {
      formState.season = season
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
      <FormColumn>Column 2</FormColumn>
    </CreatePreInspectionFormView>
  )
})

export default CreatePreInspectionForm
