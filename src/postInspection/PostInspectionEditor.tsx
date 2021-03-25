import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Inspection } from '../schema-types'
import PostInspectionExecutionRequirements from '../executionRequirement/PostInspectionExecutionRequirements'
import LoadInspectionHfpData from './LoadInspectionHfpData'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Text } from '../util/translate'
import styled from 'styled-components/macro'
import LinkedInspections from './LinkedInspections'

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

    return (
      <PostInspectionEditorView>
        <LoadInspectionHfpData setHfpLoaded={setHfpLoaded} />
        <LinkedInspections inspection={inspection} isEditable={isEditable} />
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
