import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import PreInspectionForm from '../preInspection/PreInspectionForm'
import { Page, PageTitle } from '../common/components/common'
import { observer } from 'mobx-react-lite'

const CreatePreInspectionView = styled(Page)``

export type PropTypes = {} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = observer(() => {
  return (
    <CreatePreInspectionView>
      <PageTitle>Uusi ennakkotarkastus</PageTitle>
      <PreInspectionForm />
    </CreatePreInspectionView>
  )
})

export default CreatePreInspection
