import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link, RouteComponentProps } from '@reach/router'
import { Page } from '../components/common'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PreInspectionReports: React.FC<PropTypes> = observer((props) => {
  return (
    <Page>
      <h3>Ennakkotarkastus</h3>
      <h2>Raportit</h2>
      <p>Ennakkotarkastuksien raportit tässä...</p>
    </Page>
  )
})

export default PreInspectionReports
