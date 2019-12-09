import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import { ColumnWrapper, HalfWidth } from '../components/common'

const CreatePreInspectionView = styled(ColumnWrapper)``
const FormColumn = styled(HalfWidth)``


export type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = ({ children }) => {
  return (
    <CreatePreInspectionView>
      <FormColumn>

      </FormColumn>
    </CreatePreInspectionView>
  )
}

export default CreatePreInspection
