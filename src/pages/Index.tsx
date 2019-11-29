import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../components/common'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const Index: React.FC<PropTypes> = observer(() => {
  return (
    <Page>
      <h2>Tervetuloa Bulttiin</h2>
    </Page>
  )
})

export default Index
