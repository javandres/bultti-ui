import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionType } from '../schema-types'
import InspectionIndexItem from '../inspection/InspectionIndexItem'
import { Heading } from '../common/components/Typography'
import { useInspectionReports } from '../inspection/inspectionUtils'
import { useMutationData } from '../util/useMutationData'
import {
  inspectionQuery,
  updateLinkedInspectionsMutation,
} from '../inspection/inspectionQueries'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import PostInspectionExecutionRequirements from '../executionRequirement/PostInspectionExecutionRequirements'
import LoadInspectionHfpData from './LoadInspectionHfpData'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Text } from '../util/translate'
import styled from 'styled-components/macro'

const PostInspectionEditorView = styled.div`
  margin-top: 1rem;
`

type PostInspectionProps = {
  refetchData: () => unknown
  isEditable: boolean
  inspection: Inspection
}

const PostInspectionEditor: React.FC<PostInspectionProps> = observer(
  ({ refetchData, isEditable, inspection }) => {
    let [hfpLoaded, setHfpLoaded] = useState(false)

    var connectedPreInspections = inspection.inspectionMappings || []
    let goToPreInspectionReports = useInspectionReports()

    let onClickConnectedInspection = useCallback(
      (inspectionId) => {
        goToPreInspectionReports(inspectionId, InspectionType.Pre)
      },
      [goToPreInspectionReports]
    )

    let [updateConnectedInspections, { loading: updateLoading }] = useMutationData(
      updateLinkedInspectionsMutation,
      {
        variables: {
          inspectionId: inspection.id,
        },
        refetchQueries: [
          { query: inspectionQuery, variables: { inspectionId: inspection?.id || '' } },
        ],
      }
    )

    let onUpdateConnectedInspection = useCallback(() => {
      if (isEditable) {
        updateConnectedInspections()
      }
    }, [updateConnectedInspections, isEditable])

    return (
      <PostInspectionEditorView>
        <LoadInspectionHfpData setHfpLoaded={setHfpLoaded} />
        {connectedPreInspections.length !== 0 && (
          <>
            <Heading>
              <Text>inspection_editor_linkedInspections</Text>
              {isEditable && (
                <Button
                  style={{ marginLeft: 'auto' }}
                  loading={updateLoading}
                  onClick={onUpdateConnectedInspection}
                  buttonStyle={ButtonStyle.SECONDARY}
                  size={ButtonSize.SMALL}>
                  <Text>update</Text>
                </Button>
              )}
            </Heading>
            {connectedPreInspections.map((inspectionMapping) => (
              <InspectionIndexItem
                key={inspectionMapping.id}
                onClick={() => onClickConnectedInspection(inspectionMapping.inspection.id)}
                inspection={inspectionMapping.inspection}
              />
            ))}
          </>
        )}
        {hfpLoaded ? (
          <PostInspectionExecutionRequirements isEditable={isEditable} />
        ) : (
          <MessageContainer style={{ margin: '1rem 0 0', padding: '0' }}>
            <MessageView>
              <Text>inspection_editor_hfp_unavailable</Text>
            </MessageView>
          </MessageContainer>
        )}
      </PostInspectionEditorView>
    )
  }
)

export default PostInspectionEditor
