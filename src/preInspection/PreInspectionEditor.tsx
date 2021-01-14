import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionValidationError } from '../schema-types'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { SectionHeading } from '../common/components/Typography'
import PreInspectionExecutionRequirements from '../executionRequirement/PreInspectionExecutionRequirements'
import { PageSection } from '../common/components/common'
import PreInspectionDevTools from '../dev/PreInspectionDevTools'
import { useInspectionErrors } from '../util/useInspectionErrors'
import { DEBUG } from '../constants'

type PreInspectionProps = {
  refetchData: () => unknown
  isEditable: boolean
  inspection: Inspection
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
      <>
        <DepartureBlocks
          onUpdate={refetchData}
          isEditable={isEditable}
          isValid={!departureBlocksInvalid}
        />
        <PreInspectionExecutionRequirements isValid={!executionRequirementsInvalid} />
        <SectionHeading theme="light">Kilpailukohteet</SectionHeading>
        {inspection && (
          <ProcurementUnits
            requirementsEditable={isEditable}
            getErrorsById={getByObjectId}
            operatorId={inspection.operatorId!}
            startDate={inspection.inspectionStartDate}
            endDate={inspection.inspectionEndDate}
          />
        )}
        {DEBUG && (
          <PageSection>
            <PreInspectionDevTools onUpdate={refetchData} inspection={inspection} />
          </PageSection>
        )}
      </>
    )
  }
)

export default PreInspectionEditor
