import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PostInspectionReports: React.FC<PropTypes> = observer((props) => {
  return (
    <div>
      <h1>PostInspectionReports</h1>
    </div>
  )
})

export default PostInspectionReports
