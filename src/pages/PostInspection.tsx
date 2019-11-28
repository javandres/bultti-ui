import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link, RouteComponentProps } from '@reach/router'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PostInspection: React.FC<PropTypes> = observer((props) => {
  return (
    <div>
      <Link to="/">Home</Link>
      <h1>PostInspection</h1>
    </div>
  )
})

export default PostInspection
