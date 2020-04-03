import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import PreInspectionForm from '../preInspection/PreInspectionForm'
import { Page, PageTitle } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import Tabs from '../common/components/Tabs'

const CreatePreInspectionView = styled(Page)``

const PreviewView = styled.div<{ name?: string; label?: string }>``

export type PropTypes = {} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = observer(() => {
  return (
    <CreatePreInspectionView>
      <PageTitle>Uusi ennakkotarkastus</PageTitle>
      <Tabs>
        <PreInspectionForm name="create" label="Luo" />
        <PreviewView name="preview" label="Esikatsele">
          Esikatselu
        </PreviewView>
      </Tabs>
    </CreatePreInspectionView>
  )
})

export default CreatePreInspection
