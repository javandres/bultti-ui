import React from 'react'
import styled from 'styled-components'
import { observer, useLocalStore } from 'mobx-react-lite'
import { ColumnWrapper, HalfWidth } from '../components/common'
import { format } from 'date-fns'
import SelectOperator from '../components/SelectOperator'

const CreatePreInspectionFormView = styled(ColumnWrapper)``
const FormColumn = styled(HalfWidth)``

const OperatorSelect = styled(SelectOperator)``

export type PropTypes = {}

const currentYear = format(new Date(), 'yyyy')

const CreatePreInspectionForm: React.FC<PropTypes> = observer(() => {
  const formState = useLocalStore(() => ({
    operator: null,
    season: '',
    selectOperator: (operator = null) => {
      formState.operator = operator
    },
  }))

  return (
    <CreatePreInspectionFormView>
      <FormColumn>
        <OperatorSelect
          label="Liikennöitsijä"
          theme="light"
          selectedOperator={formState.operator}
          onSelectOperator={formState.selectOperator}
        />
      </FormColumn>
      <FormColumn>Column 2</FormColumn>
    </CreatePreInspectionFormView>
  )
})

export default CreatePreInspectionForm
