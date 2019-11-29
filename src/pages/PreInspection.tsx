import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../components/common'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PreInspection: React.FC<PropTypes> = observer((props) => {
  return (
    <Page>
      <h3>Ennakkotarkastus</h3>
      <h2>Tehdyt ennakkotarkastukset</h2>
      <p>Tehdyt ennakkotarkastukset lista tässä...</p>
    </Page>
  )
})

export default PreInspection
