import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionType, ReportListItem as ReportListItemType } from '../schema-types'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'
import DownloadReport from './DownloadReport'

const ReportTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
`

const ReportDescription = styled.p`
  margin: 0;
`

export type PropTypes = {
  children: React.ReactChild
  reportData: ReportListItemType
  inspectionType?: InspectionType
  inspectionId?: string
  isExpanded?: boolean
}

const ReportListItem: React.FC<PropTypes> = observer(
  ({ reportData, children: report, isExpanded = false, inspectionId, inspectionType }) => {
    return (
      <ExpandableSection
        isExpanded={isExpanded}
        headerContent={
          <>
            <HeaderSection>
              <ReportTitle>{reportData.title}</ReportTitle>
              <ReportDescription>{reportData.description}</ReportDescription>
            </HeaderSection>
            {inspectionId && inspectionType && (
              <HeaderSection style={{ flex: '1 1 auto', justifyContent: 'flex-end' }}>
                <DownloadReport
                  style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}
                  reportName={reportData.name}
                  inspectionType={inspectionType}
                  inspectionId={inspectionId}
                />
              </HeaderSection>
            )}
          </>
        }>
        {report}
      </ExpandableSection>
    )
  }
)

export default ReportListItem
