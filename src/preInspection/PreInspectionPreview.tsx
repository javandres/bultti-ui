import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { TabChildProps } from '../common/components/Tabs'
import PreInspectionMeta from './PreInspectionMeta'
import { PreInspectionContext } from './PreInspectionContext'
import { InspectionStatus } from '../schema-types'
import { ErrorView, MessageContainer } from '../common/components/Messages'
import PreInspectionReports from './PreInspectionReports'
import InspectionActions from './InspectionActions'

const PreviewPreInspectionView = styled.div``

const PreviewMeta = styled(PreInspectionMeta)`
  margin-left: 1rem;
`

export type PropTypes = {
  refetchData: () => unknown
} & TabChildProps

const PreInspectionPreview: React.FC<PropTypes> = observer(({ refetchData }) => {
  let inspection = useContext(PreInspectionContext)

  // Validate that the form has each dependent piece of data.
  let formCondition = useMemo(() => {
    return {
      inspection: !!inspection,
      status: inspection?.status === InspectionStatus.Draft,
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
    <PreviewPreInspectionView>
      {inspection && <InspectionActions inspection={inspection} onRefresh={refetchData} />}
      {activeBlockers.length !== 0 && (
        <MessageContainer style={{ marginBottom: '1rem' }}>
          {activeBlockers.map((blockerName) => (
            <ErrorView key={blockerName}>{blockerName}</ErrorView>
          ))}
        </MessageContainer>
      )}
      <PreviewMeta isLoading={false} />
      <PreInspectionReports showInfo={false} showItemActions={false} />
    </PreviewPreInspectionView>
  )
})

export default PreInspectionPreview
