import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { PageTitle } from '../common/components/Typography'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const Index: React.FC<PropTypes> = observer(() => {
  return (
    <Page>
      <PageTitle>Tervetuloa Bulttiin</PageTitle>
    </Page>
  )
})

export default Index
