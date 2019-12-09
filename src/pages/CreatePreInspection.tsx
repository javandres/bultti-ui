import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import CreatePreInspectionForm from '../partials/CreatePreInspectionForm'
import { PageTitle } from '../components/common'
import { observer } from 'mobx-react-lite'
import OperatorTitle from '../components/OperatorTitle'

const CreatePreInspectionView = styled.div``

export type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = observer(() => {
  return (
    <CreatePreInspectionView>
      <PageTitle>Uusi ennakkotarkastus</PageTitle>
      <OperatorTitle />
      <CreatePreInspectionForm />
    </CreatePreInspectionView>
  )
})

export default CreatePreInspection
