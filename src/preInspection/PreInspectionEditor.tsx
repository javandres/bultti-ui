import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { InspectionValidationError, PreInspection } from '../schema-types'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { SectionHeading } from '../common/components/Typography'
import PreInspectionExecutionRequirements from '../executionRequirement/PreInspectionExecutionRequirements'
import { PageSection } from '../common/components/common'
import PreInspectionDevTools from '../dev/PreInspectionDevTools'
import { useInspectionErrors } from '../util/useInspectionErrors'
import { DEBUG } from '../constants'
import { Text } from '../util/translate'
import styled from 'styled-components/macro'
import { getDateObject } from '../util/formatDate'

const PreInspectionEditorView = styled.div`
  margin-top: 1rem;
`

type PreInspectionProps = {
  refetchData: () => unknown
  isEditable: boolean
  inspection: PreInspection
}

const PreInspectionEditor: React.FC<PreInspectionProps> = observer(
  ({ inspection, refetchData, isEditable }) => {
    let { getByObjectId } = useInspectionErrors(inspection.inspectionErrors || [])

    let departureBlocksInvalid = useMemo(
      () =>
        (inspection?.inspectionErrors || []).some(
          (err) => err.type === InspectionValidationError.MissingBlockDepartures
        ),
      [inspection]
    )

    let executionRequirementsInvalid = useMemo(
      () =>
        (inspection?.inspectionErrors || []).some(
          (err) => err.type === InspectionValidationError.MissingExecutionRequirements
        ),
      [inspection]
    )

    return (
      <PreInspectionEditorView>
        <DepartureBlocks
          onUpdate={refetchData}
          isEditable={isEditable}
          isValid={!departureBlocksInvalid}
        />
        <PreInspectionExecutionRequirements isValid={!executionRequirementsInvalid} />
        <SectionHeading>
          <Text>procurementUnits</Text>
        </SectionHeading>
        {inspection && (
          <ProcurementUnits
            requirementsEditable={isEditable}
            getErrorsById={getByObjectId}
            operatorId={inspection.operatorId!}
            startDate={inspection.inspectionStartDate}
            endDate={inspection.inspectionEndDate}
            contractSelectionDate={getDateObject(inspection.startDate || '')}
          />
        )}
        {DEBUG && (
          <PageSection>
            <PreInspectionDevTools onUpdate={refetchData} inspection={inspection} />
          </PageSection>
        )}
      </PreInspectionEditorView>
    )
  }
)

export default PreInspectionEditor
