import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionStatus } from '../schema-types'
import InspectionIndexItem from '../inspection/InspectionIndexItem'
import { Heading } from '../common/components/Typography'
import { useInspectionReports } from '../inspection/inspectionUtils'
import { useMutationData } from '../util/useMutationData'
import { inspectionQuery, updateBaseInspectionMutation } from '../inspection/inspectionQueries'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import PostInspectionExecutionRequirements from '../executionRequirement/PostInspectionExecutionRequirements'

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

    let [updateConnectedInspection, { loading: updateLoading }] = useMutationData(
      updateBaseInspectionMutation,
      {
        variables: {
          inspectionId: inspection.id,
        },
        refetchQueries: [
          { query: inspectionQuery, variables: { inspectionId: inspection?.id || '' } },
        ],
      }
    )

    return (
      <div>
        {connectedPreInspection && (
          <>
            <Heading>
              Pre-inspection{' '}
              {inspection.status === InspectionStatus.Draft && (
                <Button
                  style={{ marginLeft: 'auto' }}
                  loading={updateLoading}
                  onClick={() => updateConnectedInspection()}
                  buttonStyle={ButtonStyle.SECONDARY}
                  size={ButtonSize.SMALL}>
                  Päivitä
                </Button>
              )}
            </Heading>
            <InspectionIndexItem
              onClick={onClickConnectedInspection}
              inspection={connectedPreInspection}
            />
          </>
        )}
        <PostInspectionExecutionRequirements />
      </div>
    )
  }
)

export default PostInspectionEditor
