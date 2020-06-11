import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionType, Report } from '../schema-types'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'

const ReportTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
`

const ReportDescription = styled.p`
  margin: 0;
  line-height: 1.4;
`

export type PropTypes = {
  children: React.ReactChild
  headerContent?: React.ReactChild
  reportData: Report
  inspectionType?: InspectionType
  inspectionId?: string
  isExpanded?: boolean
}

const ReportListItem: React.FC<PropTypes> = observer(
  ({
    reportData,
    children: report,
    headerContent,
    isExpanded = false,
    inspectionId,
    inspectionType,
  }) => {
    return (
      <ExpandableSection
        isExpanded={isExpanded}
        headerContent={
          <>
            <HeaderSection>
              <ReportTitle>{reportData.title}</ReportTitle>
              <ReportDescription>{reportData.description}</ReportDescription>
            </HeaderSection>
            {headerContent}
          </>
        }>
        {report}
      </ExpandableSection>
    )
  }
)

export default ReportListItem