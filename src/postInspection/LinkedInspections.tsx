import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Heading } from '../common/components/Typography'
import { text, Text } from '../util/translate'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import InspectionIndexItem from '../inspection/InspectionIndexItem'
import { Inspection, InspectionType, InspectionValidationError } from '../schema-types'
import { useNavigateToInspectionReports } from '../inspection/inspectionUtils'
import { useMutationData } from '../util/useMutationData'
import {
  inspectionQuery,
  updateLinkedInspectionsMutation,
} from '../inspection/inspectionQueries'
import { MessageView } from '../common/components/Messages'
import { observedExecutionRequirementsQuery } from '../executionRequirement/executionRequirementsQueries'
import { useHasInspectionError } from '../util/hasInspectionError'

const LinkedInspectionsView = styled.div<{ error?: boolean }>`
  border: 1px solid ${(p) => (p.error ? 'var(--red)' : 'transparent')};
  border-radius: 0.5rem;
  margin-top: 2rem;
  padding: ${(p) => (p.error ? '1rem 1rem 0rem' : '0')};
  transition: all 0.2s ease-out;
`

const LinkedStatusText = styled.span<{ updateIsAvailable?: boolean }>`
  display: block;
  font-size: 0.875rem;
  align-self: center;
  color: ${(p) => (p.updateIsAvailable ? 'var(--red)' : 'var(--light-grey)')};
`

export type PropTypes = {
  inspection: Inspection
  isEditable?: boolean
}

const LinkedInspections = observer(({ inspection, isEditable = false }: PropTypes) => {
  let navigateToInspectionReports = useNavigateToInspectionReports()
  let connectedPreInspections = inspection.inspectionMappings || []

  let hasLinkedInspectionsError = useHasInspectionError(
    inspection,
    InspectionValidationError.PostInspectionMissingLinkedPreInspections
  )

  let onClickConnectedInspection = useCallback(
    (preInspectionId) => {
      navigateToInspectionReports(preInspectionId, InspectionType.Pre)
    },
    [navigateToInspectionReports]
  )

  let [updateConnectedInspections, { loading: updateLoading }] = useMutationData(
    updateLinkedInspectionsMutation,
    {
      variables: {
        inspectionId: inspection.id,
      },
      refetchQueries: [
        { query: inspectionQuery, variables: { inspectionId: inspection?.id || '' } },
        {
          query: observedExecutionRequirementsQuery,
          variables: { postInspectionId: inspection?.id || '' },
        },
      ],
    }
  )

  let onUpdateConnectedInspection = useCallback(() => {
    if (isEditable && confirm(text('inspection_editor_linkedInspectionsUpdateConfirm'))) {
      updateConnectedInspections()
    }
  }, [updateConnectedInspections, isEditable])

  return (
    <LinkedInspectionsView error={hasLinkedInspectionsError}>
      <Heading style={{ marginTop: 0 }}>
        <Text>inspection_editor_linkedInspections</Text>
        <div style={{ marginLeft: 'auto', display: 'flex', alignSelf: 'stretch' }}>
          <LinkedStatusText updateIsAvailable={!!inspection.linkedInspectionUpdateAvailable}>
            {!inspection.linkedInspectionUpdateAvailable ? (
              <Text>inspection_editor_linkedInspectionsUpToDate</Text>
            ) : (
              <Text>inspection_editor_linkedInspectionsUpdateAvailable</Text>
            )}
          </LinkedStatusText>
          {isEditable && inspection.linkedInspectionUpdateAvailable && (
            <Button
              style={{ marginLeft: '1rem', alignSelf: 'center' }}
              loading={updateLoading}
              onClick={onUpdateConnectedInspection}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSize.SMALL}>
              <Text>update</Text>
            </Button>
          )}
        </div>
      </Heading>
      {connectedPreInspections.map((inspectionMapping) => (
        <InspectionIndexItem
          key={inspectionMapping.id}
          onClick={() => onClickConnectedInspection(inspectionMapping.inspection.id)}
          inspection={inspectionMapping.inspection}
        />
      ))}
      {connectedPreInspections.length === 0 && (
        <MessageView>
          <Text>inspection_editor_noLinkedInspections</Text>
        </MessageView>
      )}
    </LinkedInspectionsView>
  )
})

export default LinkedInspections
