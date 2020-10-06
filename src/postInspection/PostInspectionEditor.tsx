import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Inspection } from '../schema-types'
import InspectionIndexItem from '../inspection/InspectionIndexItem'
import { Heading } from '../common/components/Typography'
import { useInspectionReports } from '../inspection/inspectionUtils'

type PostInspectionProps = {
  refetchData: () => unknown
  isEditable: boolean
  inspection: Inspection
}

const PostInspectionEditor: React.FC<PostInspectionProps> = observer(
  ({ refetchData, isEditable, inspection }) => {
    var connectedPreInspection = inspection.preInspection
    let goToPreInspectionReports = useInspectionReports()

    let onClickConnectedInspection = useCallback(() => {
      if (!connectedPreInspection) {
        return
      }

      goToPreInspectionReports(
        connectedPreInspection.id,
        connectedPreInspection.inspectionType
      )
    }, [connectedPreInspection, goToPreInspectionReports])

    return (
      <div>
        {connectedPreInspection && (
          <>
            <Heading>Pre-inspection</Heading>
            <InspectionIndexItem
              onClick={onClickConnectedInspection}
              inspection={connectedPreInspection}
            />
          </>
        )}
        Post-inspection editor
      </div>
    )
  }
)

export default PostInspectionEditor
