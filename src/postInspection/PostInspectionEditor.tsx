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
    let connectedPreInspection = inspection.preInspection
    console.log(connectedPreInspection)

    return <div>Post-inspection editor</div>
  }
)

export default PostInspectionEditor
