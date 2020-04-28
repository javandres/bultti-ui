import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ReportListItem as ReportListItemType } from '../schema-types'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'
import DownloadReport from './DownloadReport'

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
  inspectionType?: 'preinspection' | 'postInspection' | undefined
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
              <div>
                <ReportTitle>{reportData.title}</ReportTitle>
                <ReportDescription>{reportData.description}</ReportDescription>
              </div>
              {inspectionId && inspectionType && (
                <DownloadReport
                  style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}
                  reportName={reportData.name}
                  inspectionType={inspectionType}
                  inspectionId={inspectionId}
                />
              )}
            </HeaderSection>
          </>
        }>
        {report}
      </ExpandableSection>
    )
  }
)

export default ReportListItem
