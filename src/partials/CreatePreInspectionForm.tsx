import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ColumnWrapper, HalfWidth } from '../components/common'

const CreatePreInspectionFormView = styled(ColumnWrapper)``

const FormColumn = styled(HalfWidth)``

export type PropTypes = {
  children?: React.ReactNode
}

const CreatePreInspectionForm: React.FC<PropTypes> = observer(({ children }) => {
  return (
    <CreatePreInspectionFormView>
      <FormColumn>Column 1</FormColumn>
      <FormColumn>Column 2</FormColumn>
    </CreatePreInspectionFormView>
  )
})

export default CreatePreInspectionForm
