import React from 'react'
import { observer } from 'mobx-react-lite'
import { Inspection } from '../schema-types'

type PostInspectionProps = {
  refetchData: () => unknown
  isEditable: boolean
  inspection: Inspection
}

const PostInspectionEditor: React.FC<PostInspectionProps> = observer(
  ({ refetchData, isEditable, inspection }) => {
    return null
  }
)

export default PostInspectionEditor
