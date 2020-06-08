import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { PageTitle } from '../common/components/Typography'
import { Page } from '../common/components/common'

const ReportsPageView = styled(Page)``

export type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const ReportsPage = observer(({ children }: PropTypes) => {
  return (
    <ReportsPageView>
      <PageTitle>Raportit</PageTitle>
    </ReportsPageView>
  )
})

export default ReportsPage
