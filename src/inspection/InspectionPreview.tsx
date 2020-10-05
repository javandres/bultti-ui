import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { TabChildProps } from '../common/components/Tabs'
import InspectionMeta from './InspectionMeta'
import { Inspection, InspectionStatus, InspectionType } from '../schema-types'
import { ErrorView, MessageContainer } from '../common/components/Messages'
import InspectionReports from './InspectionReports'

const PreviewInspectionView = styled.div``

const PreviewMeta = styled(InspectionMeta)`
  margin-left: 0.75rem;
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
      {inspection && <PreviewMeta inspection={inspection} />}
      <InspectionReports showInfo={false} showItemActions={false} inspection={inspection} />
    </PreviewInspectionView>
  )
})

export default InspectionPreview
