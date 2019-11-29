import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../components/common'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PostInspection: React.FC<PropTypes> = observer((props) => {
  return (
    <Page>
      <h2>Jälkitarkastus</h2>
    </Page>
  )
})

export default PostInspection
