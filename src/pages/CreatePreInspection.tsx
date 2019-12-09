import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import CreatePreInspectionForm from '../partials/CreatePreInspectionForm'
import { PageTitle } from '../components/common'
import { observer } from 'mobx-react-lite'

const CreatePreInspectionView = styled.div``

export type PropTypes = {} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = observer(() => {
  return (
    <CreatePreInspectionView>
      <PageTitle>Uusi ennakkotarkastus</PageTitle>
      <CreatePreInspectionForm />
    </CreatePreInspectionView>
  )
})

export default CreatePreInspection
