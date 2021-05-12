import React from 'react'
import { observer } from 'mobx-react-lite'
import { Page } from '../common/components/common'
import { PageTitle } from '../common/components/PageTitle'
import { RouteChildrenProps } from 'react-router-dom'

type PropTypes = {
  children?: React.ReactNode
} & RouteChildrenProps

const Index: React.FC<PropTypes> = observer(() => {
  return (
    <Page>
      <PageTitle>Tervetuloa Bulttiin</PageTitle>
    </Page>
  )
})

export default Index
