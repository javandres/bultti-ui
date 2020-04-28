import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ReportListItem as ReportListItemType } from '../schema-types'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'

const ReportTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 0.75rem;
`

const ReportDescription = styled.p`
  margin-bottom: 0;
`

export type PropTypes = {
  children: React.ReactChild
  reportData: ReportListItemType
  isExpanded?: boolean
}

const ReportListItem: React.FC<PropTypes> = observer(
  ({ reportData, children: report, isExpanded = false }) => {
    return (
      <ExpandableSection
        isExpanded={isExpanded}
        headerContent={
          <>
            <HeaderSection>
              <ReportTitle>{reportData.title}</ReportTitle>
              <ReportDescription>{reportData.description}</ReportDescription>
            </HeaderSection>
          </>
        }>
        {report}
      </ExpandableSection>
    )
  }
)

export default ReportListItem
