import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'

const CreatePreInspectionView = styled.div``

export type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = ({ children }) => {
  return (
    <CreatePreInspectionView>
      <></>
    </CreatePreInspectionView>
  )
}

export default CreatePreInspection
