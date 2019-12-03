import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page, PageSection } from '../components/common'
import FunctionBar from '../components/FunctionBar'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PreInspection: React.FC<PropTypes> = observer((props) => {
  return (
    <Page>
      <FunctionBar functions={[{ label: 'Uusi ennakkotarkastus', action: () => {} }]} />
      <PageSection>
        <h3>Ennakkotarkastus</h3>
        <h2>Tehdyt ennakkotarkastukset</h2>
        <p>Tehdyt ennakkotarkastukset lista tässä...</p>
      </PageSection>
    </Page>
  )
})

export default PreInspection
