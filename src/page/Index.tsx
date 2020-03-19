import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page, PageSection } from '../common/components/common'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const Index: React.FC<PropTypes> = observer(() => {
  return (
    <Page>
      <PageSection>
        <h2>Tervetuloa Bulttiin</h2>
      </PageSection>
    </Page>
  )
})

export default Index
