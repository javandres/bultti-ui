import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../components/common'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PostInspectionReports: React.FC<PropTypes> = observer((props) => {
  return (
    <Page>
      <h3>Jälkitarkastus</h3>
      <h2>Raportit</h2>
      <p>Jälkitarkastuksen raportit tässä...</p>
    </Page>
  )
})

export default PostInspectionReports
