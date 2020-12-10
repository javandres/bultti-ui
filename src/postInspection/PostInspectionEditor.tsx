import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Inspection } from '../schema-types'
import InspectionIndexItem from '../inspection/InspectionIndexItem'
import { Heading } from '../common/components/Typography'
import { useInspectionReports } from '../inspection/inspectionUtils'
import { useMutationData } from '../util/useMutationData'
import { inspectionQuery, updateBaseInspectionMutation } from '../inspection/inspectionQueries'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import PostInspectionExecutionRequirements from '../executionRequirement/PostInspectionExecutionRequirements'
import LoadInspectionHfpData from './LoadInspectionHfpData'
import { MessageContainer, MessageView } from '../common/components/Messages'

type PostInspectionProps = {
  refetchData: () => unknown
  isEditable: boolean
  inspection: Inspection
}

const PostInspectionEditor: React.FC<PostInspectionProps> = observer(
  ({ refetchData, isEditable, inspection }) => {
    let [hfpLoaded, setHfpLoaded] = useState(false)

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

    let onUpdateConnectedInspection = useCallback(() => {
      if (isEditable) {
        updateConnectedInspection()
      }
    }, [updateConnectedInspection, isEditable])

    return (
      <div>
        <LoadInspectionHfpData setHfpLoaded={setHfpLoaded} />
        {hfpLoaded ? (
          <>
            {connectedPreInspection && (
              <>
                <Heading>
                  Ennakkotarkastus{' '}
                  {isEditable && (
                    <Button
                      style={{ marginLeft: 'auto' }}
                      loading={updateLoading}
                      onClick={onUpdateConnectedInspection}
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
            <PostInspectionExecutionRequirements isEditable={isEditable} />
          </>
        ) : (
          <MessageContainer style={{ margin: '1rem 0 0', padding: '0' }}>
            <MessageView>Lataa tarkastusjakson HFP-tiedot ennen jatkamista.</MessageView>
          </MessageContainer>
        )}
      </div>
    )
  }
)

export default PostInspectionEditor
