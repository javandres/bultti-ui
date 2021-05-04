import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { TabChildProps } from '../common/components/Tabs'
import InspectionMeta from './InspectionMeta'
import { InspectionStatus } from '../schema-types'
import { ErrorView, MessageContainer } from '../common/components/Messages'
import InspectionReports from './InspectionReports'
import { Inspection } from './inspectionTypes'

const PreviewInspectionView = styled.div`
  padding: 1rem 0.75rem 2rem;
`

export type PropTypes = {
  inspection: Inspection
} & TabChildProps

const InspectionPreview: React.FC<PropTypes> = observer(({ inspection }) => {
  // Validate that the form has each dependent piece of data.
  let formCondition = useMemo(() => {
    return {
      inspection: !!inspection,
      status: inspection?.status !== InspectionStatus.InProduction,
      operator: !!inspection?.operator,
      startDate: !!inspection?.startDate,
      season: !!inspection?.season,
    }
  }, [inspection])

  // Validation issues that affect the form at this moment
  let activeBlockers = Object.entries(formCondition)
    .filter(([, status]) => !status)
    .map(([key]) => key)

  return (
    <PreviewInspectionView>
      {activeBlockers.length !== 0 && (
        <MessageContainer style={{ marginBottom: '1rem' }}>
          {activeBlockers.map((blockerName) => (
            <ErrorView key={blockerName}>{blockerName}</ErrorView>
          ))}
        </MessageContainer>
      )}
      {inspection && <InspectionMeta inspection={inspection} />}
      <InspectionReports showInfo={false} showItemActions={false} inspection={inspection} />
    </PreviewInspectionView>
  )
})

export default InspectionPreview
