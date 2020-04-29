import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page, PageTitle } from '../common/components/common'

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
