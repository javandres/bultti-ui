import React from 'react'
import { observer } from 'mobx-react-lite'
import { Inspection } from '../schema-types'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { SectionHeading } from '../common/components/Typography'
import PreInspectionExecutionRequirements from '../executionRequirement/PreInspectionExecutionRequirements'
import { PageSection } from '../common/components/common'
import PreInspectionDevTools from '../dev/PreInspectionDevTools'

type PreInspectionProps = {
  refetchData: () => unknown
  isEditable: boolean
  inspection: Inspection
}

const PreInspectionEditor: React.FC<PreInspectionProps> = observer(
  ({ inspection, refetchData, isEditable }) => {
    return (
      <>
        <DepartureBlocks onUpdate={refetchData} isEditable={isEditable} />
        <PreInspectionExecutionRequirements />
        <SectionHeading theme="light">Kilpailukohteet</SectionHeading>
        <ProcurementUnits onUpdate={refetchData} requirementsEditable={isEditable} />
        <PageSection>
          <PreInspectionDevTools onUpdate={refetchData} inspection={inspection} />
        </PageSection>
      </>
    )
  }
)

export default PreInspectionEditor
